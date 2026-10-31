"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Status() {
  const [no, setNo] = useState("");
  const [res, setRes] = useState<any>(null);

  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from("flights")
      .select("*, flight_status(*)").eq("flight_no", no.toUpperCase()).single();
    setRes(data ?? { missing: true });
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-black text-delta-navy mb-6">Flight Status</h1>
      <form onSubmit={track} className="card p-6 flex gap-3">
        <input className="field" placeholder="Flight number (e.g. DL1234)" value={no} onChange={(e) => setNo(e.target.value)} />
        <button className="btn-red">Track</button>
      </form>
      {res?.missing && <p className="text-delta-red text-sm mt-3">No flight found.</p>}
      {res && !res.missing && (
        <div className="card p-6 mt-6">
          <div className="text-lg font-black text-delta-navy">{res.origin} → {res.destination}</div>
          <div className="text-sm text-delta-muted">{res.flight_no}</div>
          <div className="mt-3 inline-block bg-delta-navy text-white text-xs font-bold px-3 py-1 rounded-card">
            {res.flight_status[0]?.status ?? "On Time"}
          </div>
          {res.flight_status[0]?.gate && <div className="text-sm mt-2">Gate {res.flight_status[0].gate}</div>}
        </div>
      )}
    </section>
  );
}
