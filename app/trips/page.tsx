"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Trips() {
  const [code, setCode] = useState("");
  const [trip, setTrip] = useState<any>(null);
  const [err, setErr] = useState("");

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from("pnrs")
      .select("*, flights(*), fares(cabin)").eq("code", code.toUpperCase()).single();
    data ? (setTrip(data), setErr("")) : setErr("Confirmation not found");
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-black text-delta-navy mb-6">My Trips</h1>
      <form onSubmit={lookup} className="card p-6 flex gap-3">
        <input className="field" placeholder="Confirmation number" value={code}
          onChange={(e) => setCode(e.target.value)} maxLength={6} />
        <button className="btn-red">Find</button>
      </form>
      {err && <p className="text-delta-red text-sm mt-3">{err}</p>}

      {trip && (
        <div className="card p-6 mt-6">
          <div className="text-lg font-black text-delta-navy">{trip.flights.origin} → {trip.flights.destination}</div>
          <div className="text-sm text-delta-muted">{trip.flights.flight_no} · {trip.fares.cabin} · {trip.code}</div>
          <div className="flex gap-3 mt-4">
            <Link href={`/confirm/${trip.code}`} className="btn-ghost">Manage</Link>
            <Link href={`/checkin?pnr=${trip.code}`} className="btn-red">Check In</Link>
          </div>
        </div>
      )}
    </section>
  );
}
