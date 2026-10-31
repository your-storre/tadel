import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function Results({ searchParams }: { searchParams: any }) {
  const { from, to, date } = searchParams;
  const { data: flights } = await supabase
    .from("flights")
    .select("*, fares(*), aircraft(type)")
    .eq("origin", from).eq("destination", to);

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-black text-delta-navy">{from} → {to}</h1>
      <p className="text-sm text-delta-muted mb-6">Select a fare to continue.</p>

      {flights?.map((fl) => (
        <article key={fl.id} className="card p-5 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-black text-delta-navy">
                {new Date(fl.departs_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {" – "}
                {new Date(fl.arrives_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="text-xs text-delta-muted">{fl.flight_no} · {fl.aircraft.type} · {Math.floor(fl.duration_min/60)}h {fl.duration_min%60}m</div>
            </div>
            <div className="flex gap-2">
              {fl.fares.sort((a: any, b: any) => a.price_cents - b.price_cents).map((fare: any) => (
                <Link key={fare.id} href={`/fare/${fare.id}`}
                  className="border border-delta-hair rounded-card px-3 py-2 text-center hover:border-delta-navy">
                  <div className="text-[10px] uppercase font-bold text-delta-muted">{fare.cabin}</div>
                  <div className="font-black text-delta-navy">${(fare.price_cents/100).toFixed(0)}</div>
                  <div className="text-[10px] text-delta-red font-bold mt-1">Select</div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
