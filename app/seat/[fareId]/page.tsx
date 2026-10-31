import { supabase } from "@/lib/supabase";
import SeatMap from "./SeatMap";
import { notFound } from "next/navigation";

export default async function SeatPage({ params }: { params: Promise<{ fareId: string }> }) {
  const { fareId } = await params;
  const { data: fare } = await supabase.from("fares").select("*, flights(id)").eq("id", fareId).single();
  if (!fare) notFound();
  const { data: seats } = await supabase.from("seats").select("*").eq("flight_id", fare.flights.id).order("row").order("col");

  return (
    <section className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-black text-delta-navy mb-1">Choose your seat</h1>
      <p className="text-sm text-delta-muted mb-6">{fare.cabin} · exit rows marked</p>
      <SeatMap seats={seats ?? []} fareId={fareId} />
    </section>
  );
}
