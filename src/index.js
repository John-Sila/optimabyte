// OptimaByte Cloudflare Worker (free plan is enough).
//
//   POST /notify   emails the owner about a new request (sent via Resend)
//   GET  /whoami   returns the caller's IP and approximate location (from Cloudflare)
//
// Secrets / vars (see wrangler.toml and README.md):
//   RESEND_API_KEY  secret   API key from resend.com
//   NOTIFY_TO       var      where the notification goes (your email)
//   NOTIFY_FROM     var      sender, e.g. "OptimaByte <onboarding@resend.dev>"
//   ALLOWED_ORIGINS var      comma separated list of site origins allowed to call this

const MAX = { name: 80, email: 120, phone: 30, service: 80, message: 2000, page: 200 };

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin) || /^https?:\/\/localhost(:\d+)?$/.test(origin);
  return ok
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      }
    : null;
}

const json = (data, status, headers) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function clean(body) {
  const out = {};
  for (const [k, max] of Object.entries(MAX)) {
    const v = body?.[k];
    if (typeof v !== "string") {
      if (k === "phone" || k === "page") { out[k] = ""; continue; }
      return null;
    }
    out[k] = v.trim().slice(0, max);
  }
  if (out.name.length < 2 || out.message.length < 10 || out.service.length < 2) return null;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(out.email)) return null;
  return out;
}

async function handleNotify(request, env, cors) {
  if (env.RL?.limit) {
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const { success } = await env.RL.limit({ key: ip });
    if (!success) return json({ ok: false, error: "rate-limited" }, 429, cors);
  }
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: "bad-json" }, 400, cors); }
  const r = clean(body);
  if (!r) return json({ ok: false, error: "invalid" }, 400, cors);
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO) return json({ ok: false, error: "not-configured" }, 500, cors);

  const rows = [
    ["Name", r.name], ["Email", r.email], ["Phone", r.phone || "-"],
    ["Service", r.service], ["Sent from", r.page || "-"],
  ]
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#64748b">${k}</td><td style="padding:6px 0"><b>${esc(v)}</b></td></tr>`)
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px">
    <h2 style="margin:0 0 4px">New request on OptimaByte</h2>
    <p style="margin:0 0 16px;color:#64748b">Status: Pending</p>
    <table style="border-collapse:collapse;font-size:14px">${rows}</table>
    <p style="margin:16px 0 4px;color:#64748b;font-size:14px">Message</p>
    <div style="white-space:pre-wrap;background:#f1f5f9;border-radius:8px;padding:12px;font-size:14px">${esc(r.message)}</div>
    <p style="margin-top:16px;font-size:14px">Reply to this email to answer ${esc(r.name)} directly.</p>
  </div>`;
  const text = `New request on OptimaByte (Pending)\n\nName: ${r.name}\nEmail: ${r.email}\nPhone: ${r.phone || "-"}\nService: ${r.service}\n\n${r.message}\n`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.NOTIFY_FROM || "OptimaByte <onboarding@resend.dev>",
      to: [env.NOTIFY_TO],
      reply_to: r.email,
      subject: `New ${r.service} request from ${r.name}`.slice(0, 150),
      html,
      text,
    }),
  });
  if (!res.ok) return json({ ok: false, error: "email-failed" }, 502, cors);
  return json({ ok: true }, 200, cors);
}

function handleWhoami(request, cors) {
  const cf = request.cf || {};
  const num = (v) => (v === undefined || v === null || v === "" ? null : Number(v));
  return json(
    {
      ip: request.headers.get("CF-Connecting-IP") || "",
      city: cf.city || "",
      region: cf.region || "",
      country: cf.country || "",
      latitude: num(cf.latitude),
      longitude: num(cf.longitude),
      isp: cf.asOrganization || "",
      timezone: cf.timezone || "",
    },
    200,
    cors,
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") {
      return cors ? new Response(null, { status: 204, headers: cors }) : new Response(null, { status: 403 });
    }
    // Browsers always send Origin on cross-site calls; refuse anything not from the site.
    if (!cors) return json({ ok: false, error: "forbidden" }, 403, {});

    if (url.pathname === "/notify" && request.method === "POST") return handleNotify(request, env, cors);
    if (url.pathname === "/whoami" && request.method === "GET") return handleWhoami(request, cors);
    return json({ ok: false, error: "not-found" }, 404, cors);
  },
};
