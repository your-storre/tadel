"use client";
import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Suspense } from "react";

function CheckInForm() {
  const searchParams = useSearchParams();
  const pnr = searchParams.get("pnr");
  const [trip, setTrip] = useState<any>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!pnr) return;
    supabase.from("pnrs").select("*, flights(*), fares(cabin), seats(row,col)")
      .eq("code", pnr).single().then(({ data }) => setTrip(data));
  }, [pnr]);

  if (!pnr) {
    return (
      <section className="max-w-lg mx-auto px-6 py-10">
        <h1 className="text-2xl font-black text-delta-navy">Check In</h1>
        <p className="text-sm text-delta-muted mt-2">
          Find your trip in <Link href="/trips" className="underline">My Trips</Link> first.
        </p>
      </section>
    );
  }

  if (!trip) {
    return <div className="text-center p-6">Loading flight details...</div>;
  }

  return (
    <section className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-black text-delta-navy mb-4">Check In</h1>
      <div className="card p-6">
        <div className="font-black text-delta-navy">{trip.flights.origin} → {trip.flights.destination}</div>
        <div className="text-sm text-delta-muted mb-4">
          {trip.passenger_name} · Seat {trip.seats.row}{trip.seats.col}
        </div>
        {done ? (
          <Link href={`/api/boarding-pass/${pnr}`} className="btn-red inline-block">
            Download boarding pass
          </Link>
        ) : (
          <button className="btn-red" onClick={() => setDone(true)}>
            Check in now
          </button>
        )}
      </div>
    </section>
  );
}

export default function CheckIn() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <CheckInForm />
    </Suspense>
  );
}
