import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Globe, Loader2, MapPin, Monitor, ShieldCheck, Smartphone, Tablet } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import PageHeader from "@/components/layout/PageHeader";
import RequireAdmin from "@/components/admin/RequireAdmin";
import { LOGIN_LOG_KEEP, subscribeLogins, type LoginRecord } from "@/lib/admin-data";

function DeviceIcon({ type }: { type?: string }) {
  const cls = "h-5 w-5 text-gold-text";
  if (type === "Mobile") return <Smartphone className={cls} />;
  if (type === "Tablet") return <Tablet className={cls} />;
  return <Monitor className={cls} />;
}

const GEO_NOTE: Record<string, string> = {
  denied: "Location permission was denied in the browser, so only the network location is shown.",
  unavailable: "The device could not provide a precise location.",
};

function LoginCard({ row, latest }: { row: LoginRecord; latest: boolean }) {
  const d = row.device as Record<string, string | number | boolean | undefined>;
  const n = row.network;
  const place = n ? [n.city, n.region, n.country].filter(Boolean).join(", ") : "";

  const details: Array<[string, string]> = [
    ["IP address", n?.ip || "Unknown"],
    ["Network location", place || "Unknown"],
    ["Internet provider", n?.isp || "Unknown"],
    ["Browser", String(d.browser ?? "Unknown")],
    ["Operating system", String(d.os ?? "Unknown")],
    ["Device type", String(d.type ?? "Unknown") + (d.touch ? " (touch)" : "")],
    ["Screen", String(d.screen ?? "Unknown")],
    ["Processor cores", d.cpuCores ? String(d.cpuCores) : "Unknown"],
    ["Memory", d.memoryGb ? `${d.memoryGb} GB or more` : "Unknown"],
    ["Connection", String(d.connection || "Unknown")],
    ["Language", String(d.language ?? "Unknown")],
    ["Device time zone", String(d.timezone ?? "Unknown")],
    ["Device ID", String(d.deviceId ?? "Unknown")],
  ];

  return (
    <article className="animate-fade-up rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <DeviceIcon type={String(d.type ?? "")} />
          </span>
          <div>
            <h3 className="flex flex-wrap items-center gap-2 text-base font-semibold text-foreground">
              {String(d.browser ?? "Unknown browser")} on {String(d.os ?? "unknown OS")}
              {latest && (
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-400">
                  Latest
                </span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">{place || "Location unknown"}</p>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p className="font-medium text-foreground">{format(row.at, "EEE d MMM yyyy, HH:mm:ss")}</p>
          <p>{formatDistanceToNow(row.at, { addSuffix: true })}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-secondary/50 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-gold-text" /> Precise location
        </p>
        {row.geo ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {row.geo.latitude}, {row.geo.longitude} (accurate to about {row.geo.accuracyM} m){" "}
            <a
              href={`https://www.google.com/maps?q=${row.geo.latitude},${row.geo.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Open in Maps
            </a>
          </p>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">{GEO_NOTE[row.geoStatus] ?? GEO_NOTE.unavailable}</p>
        )}
        {n?.latitude != null && n?.longitude != null && (
          <p className="mt-1 text-xs text-muted-foreground">
            Network estimate: {n.latitude}, {n.longitude} (city level only)
          </p>
        )}
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
        {details.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="font-semibold text-foreground">{k}</dt>
            <dd className="break-all text-muted-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function LoginsInner() {
  const [rows, setRows] = useState<LoginRecord[] | null>(null);
  const [error, setError] = useState("");

  useEffect(
    () =>
      subscribeLogins(
        (list) => {
          setRows(list);
          setError("");
        },
        () => {
          setError("Could not load the login history. Make sure firestore.rules are deployed.");
          setRows((p) => p ?? []);
        },
      ),
    [],
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow="Admin"
        title="Login activity"
        description={`The last ${LOGIN_LOG_KEEP} admin sign-ins with device, time and location. Older entries are deleted automatically.`}
      />
      <section className="py-10 md:py-14">
        <div className="site-container space-y-5">
          {error && (
            <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </p>
          )}
          {rows === null ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading" />
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-20 text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-medium text-foreground">No sign-ins recorded yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Each admin sign-in from now on will appear here.</p>
            </div>
          ) : (
            <>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" /> If you see a sign-in you do not recognise, change the admin password in Firebase straight away.
              </p>
              <div className="grid gap-4 xl:grid-cols-2">
                {rows.map((r, i) => (
                  <LoginCard key={r.id} row={r} latest={i === 0} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

export default function AdminLogins() {
  return (
    <RequireAdmin>
      <LoginsInner />
    </RequireAdmin>
  );
}
