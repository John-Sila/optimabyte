// Date helpers. Business hours are Nairobi time, regardless of where the
// visitor is, because that is when the team actually replies.

const TZ = "Africa/Nairobi";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function nairobiParts(now: Date) {
  const f = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    hourCycle: "h23",
  });
  const get = (type: string) => Number(f.formatToParts(now).find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour") };
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

/** 23rd Mar 2026 */
export function formatOrdinalDate(year: number, month: number, day: number): string {
  return `${ordinal(day)} ${MONTHS[month - 1]} ${year}`;
}

export interface ReplyExpectation {
  /** True when it is 18:00 (Nairobi) or later. */
  late: boolean;
  /** Human sentence fragment, e.g. "early tomorrow morning" or "later today in the evening". */
  when: string;
  /** Formatted date the reply is expected on, e.g. "24th Oct 2026". */
  date: string;
}

export function replyExpectation(now: Date = new Date()): ReplyExpectation {
  const { year, month, day, hour } = nairobiParts(now);
  if (hour >= 18) {
    const t = new Date(Date.UTC(year, month - 1, day + 1));
    return {
      late: true,
      when: "early tomorrow morning",
      date: formatOrdinalDate(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()),
    };
  }
  return {
    late: false,
    when: "later today in the evening",
    date: formatOrdinalDate(year, month, day),
  };
}
