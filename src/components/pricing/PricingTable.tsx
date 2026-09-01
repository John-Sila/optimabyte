import { pricing } from "@/lib/site-config";

export default function PricingTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left">
        <thead className="bg-secondary">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-foreground">Service</th>
            <th className="px-6 py-4 text-sm font-semibold text-foreground">Fee</th>
            <th className="px-6 py-4 text-sm font-semibold text-foreground hidden md:table-cell">
              Covers
            </th>
          </tr>
        </thead>
        <tbody>
          {pricing.map((item, index) => (
            <tr
              key={item.title}
              className={index !== pricing.length - 1 ? "border-b border-border" : ""}
            >
              <td className="px-6 py-5 align-top">
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.cadence}</p>
              </td>
              <td className="px-6 py-5 align-top">
                <p className="font-semibold text-primary whitespace-nowrap">{item.price}</p>
              </td>
              <td className="px-6 py-5 align-top text-sm text-muted-foreground hidden md:table-cell">
                {item.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
