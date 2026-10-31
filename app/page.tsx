v"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [f, setF] = useState({ from: "ATL", to: "JFK", date: "", pax: 1, cabin: "Main Cabin" });

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({
      from: f.from.toUpperCase(), to: f.to.toUpperCase(),
      date: f.date, pax: String(f.pax), cabin: f.cabin,
    });
    router.push(`/results?${q}`);
  };

  return (
    <>
      <section className="bg-delta-navy text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h1 className="text-4xl font-black tracking-tight max-w-xl">
            Where will you go next?
          </h1>
          <p className="mt-3 text-white/80">Book flights, check in, and track status.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 -mt-10">
        <form onSubmit={search} className="card p-6 grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-1">
            <label className="text-xs font-bold uppercase text-delta-muted">From</label>
            <input className="field mt-1" maxLength={3} value={f.from}
              onChange={(e) => setF({ ...f, from: e.target.value })} required />
          </div>
          <div className="md:col-span-1">
            <label className="text-xs font-bold uppercase text-delta-muted">To</label>
            <input className="field mt-1" maxLength={3} value={f.to}
              onChange={(e) => setF({ ...f, to: e.target.value })} required />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase text-delta-muted">Depart</label>
            <input type="date" className="field mt-1" value={f.date}
              onChange={(e) => setF({ ...f, date: e.target.value })} required />
          </div>
          <div className="md:col-span-1">
            <label className="text-xs font-bold uppercase text-delta-muted">Travelers</label>
            <input type="number" min={1} max={9} className="field mt-1" value={f.pax}
              onChange={(e) => setF({ ...f, pax: Number(e.target.value) })} />
          </div>
          <div className="md:col-span-1 flex items-end">
            <button className="btn-red w-full">Search Flights</button>
          </div>
        </form>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-16 grid md:grid-cols-3 gap-6">
        {[
          ["Flight Status", "Track any flight in real time.", "/status"],
          ["Check In", "Get your boarding pass in seconds.", "/checkin"],
          ["My Trips", "View and manage your itinerary.", "/trips"],
        ].map(([t, d, href]) => (
          <a key={href} href={href} className="card p-6 hover:shadow-lift transition-shadow">
            <h3 className="font-black text-delta-navy text-lg">{t}</h3>
            <p className="text-sm text-delta-muted mt-1">{d}</p>
          </a>
        ))}
      </section>
    </>
  );
}
