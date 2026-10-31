import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Confirm({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { data: pnr } = await supabase.from("pnrs")
    .select("*, flights(*, aircraft(type)), fares(cabin, price_cents)").eq("code", code).single();
  if (!pnr) notFound();

  return (
    <section className="max-w-2xl mx-auto px-6 py-10 text-center">
      <div className="text-4xl">✓</div>
      <h1 className="text-2xl font-black text-delta-navy mt-2">You're booked</h1>
      <p className="text-sm text-delta-muted">Confirmation {pnr.code} · {pnr.passenger_name}</p>
      <div className="card p-6 mt-6 text-left">
        <div className="text-lg font-black text-delta-navy">{pnr.flights.origin} → {pnr.flights.destination}</div>
        <div className="text-sm text-delta-muted">{pnr.flights.flight_no} · {pnr.fares.cabin}</div>
        <div className="flex gap-3 mt-4">
          <Link href={`/api/ticket/${pnr.code}`} className="btn-ghost">Download ticket (PDF)</Link>
          <Link href={`/api/boarding-pass/${pnr.code}`} className="btn-red">Boarding pass (PDF)</Link>
        </div>
      </div>
    </section>
  );
}
