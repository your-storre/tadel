import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Fare({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: fare } = await supabase
    .from("fares").select("*, flights(*, aircraft(type), origin_ap:airports!flights_origin_fkey(city,code), dest_ap:airports!flights_destination_fkey(city,code))")
    .eq("id", id).single();
  if (!fare) notFound();
  const fl = fare.flights;

  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <Link href={`/results?from=${fl.origin}&to=${fl.destination}`} className="text-sm text-delta-navy underline">← Back to results</Link>
      <div className="card p-6 mt-4">
        <div className="flex justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-delta-muted">{fare.cabin}</div>
            <div className="text-xl font-black text-delta-navy mt-1">{fl.origin} → {fl.destination}</div>
            <div className="text-sm text-delta-muted">{fl.flight_no} · {fl.aircraft.type}</div>
          </div>
          <div className="text-3xl font-black text-delta-navy">${(fare.price_cents/100).toFixed(0)}</div>
        </div>
        <div className="rule my-5" />
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <dt className="text-delta-muted font-bold uppercase text-xs">Baggage</dt><dd>{fare.baggage}</dd>
          <dt className="text-delta-muted font-bold uppercase text-xs">Changes</dt><dd>{fare.change_fee}</dd>
          <dt className="text-delta-muted font-bold uppercase text-xs">SkyMiles earned</dt><dd>{fare.miles.toLocaleString()}</dd>
          <dt className="text-delta-muted font-bold uppercase text-xs">Seat selection</dt><dd>Included</dd>
        </dl>
        <Link href={`/seat/${fare.id}`} className="btn-red inline-block mt-6">Continue to seats</Link>
      </div>
    </section>
  );
}
