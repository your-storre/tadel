"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SeatMap({ seats, fareId }: { seats: any[]; fareId: string }) {
  const router = useRouter();
  const [pick, setPick] = useState<any>(null);
  const rows = [...new Set(seats.map((s) => s.row))];

  return (
    <>
      <div className="card p-4 inline-block mx-auto">
        <div className="text-center text-[10px] uppercase text-delta-muted mb-2">Front</div>
        {rows.map((r) => {
          const rowSeats = seats.filter((s) => s.row === r);
          const left = rowSeats.filter((s) => "ABC".includes(s.col));
          const right = rowSeats.filter((s) => "DEF".includes(s.col));
          return (
            <div key={r} className="flex items-center gap-2 mb-1.5 justify-center">
              <span className="text-[10px] text-delta-muted w-4 text-right">{r}</span>
              {left.map((s) => <SeatBtn key={s.id} s={s} pick={pick} setPick={setPick} />)}
              <span className="w-5" />
              {right.map((s) => <SeatBtn key={s.id} s={s} pick={pick} setPick={setPick} />)}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm">{pick ? `Selected ${pick.row}${pick.col}` : "Select a seat"}</div>
        <button className="btn-red" disabled={!pick}
          onClick={() => router.push(`/passenger/${fareId}?seat=${pick.id}`)}>Continue</button>
      </div>
    </>
  );
}

function SeatBtn({ s, pick, setPick }: any) {
  const sel = pick?.id === s.id;
  const cls = s.occupied ? "bg-delta-muted/30 cursor-not-allowed"
    : sel ? "bg-delta-red text-white"
    : s.exit_row ? "bg-amber-100 border-amber-400 hover:border-delta-navy"
    : "bg-white border-delta-hair hover:border-delta-navy";
  return (
    <button disabled={s.occupied} onClick={() => setPick(s)}
      className={`w-7 h-7 rounded-[3px] border text-[10px] font-bold ${cls}`}>{s.col}</button>
  );
}
