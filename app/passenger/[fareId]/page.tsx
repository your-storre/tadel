"use client";
import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { genPNR } from "@/lib/pnr";

export default function Passenger({ params }: { params: Promise<{ fareId: string }> }) {
  const { fareId } = use(params);
  const seatId = useSearchParams().get("seat");
  const router = useRouter();
  const [form, setForm] = useState({ first: "", last: "", skymiles: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data: fare } = await supabase.from("fares").select("flights(id)").eq("id", fareId).single();
    const code = genPNR();
    const { data: pnr } = await supabase.from("pnrs").insert({
      code, flight_id: fare!.flights.id, fare_id: Number(fareId),
      passenger_name: `${form.first} ${form.last}`.trim(), seat_id: Number(seatId),
      sky_miles: form.skymiles || null,
    }).select().single();
    await supabase.from("seats").update({ occupied: true }).eq("id", Number(seatId));
    await supabase.from("tickets").insert({ pnr_id: pnr!.id });
    await supabase.from("boarding_passes").insert({
      pnr_id: pnr!.id, group_no: "3", barcode: `M1${form.last.toUpperCase().slice(0,3)}/${code}`,
    });
    router.push(`/confirm/${code}`);
  };

  return (
    <section className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-black text-delta-navy mb-6">Passenger details</h1>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <input className="field" placeholder="First name" required value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })} />
        <input className="field" placeholder="Last name" required value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} />
        <input className="field" placeholder="SkyMiles number (optional)" value={form.skymiles} onChange={(e) => setForm({ ...form, skymiles: e.target.value })} />
        <button className="btn-red w-full" disabled={busy}>{busy ? "Booking…" : "Confirm booking"}</button>
      </form>
    </section>
  );
}
