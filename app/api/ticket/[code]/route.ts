import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import bwipjs from "bwip-js";
import { supabase } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { data: pnr } = await supabase.from("pnrs")
    .select("*, flights(*, aircraft(type)), fares(cabin, price_cents)").eq("code", code).single();
  if (!pnr) return NextResponse.json({ error: "not found" }, { status: 404 });

  const png = await bwipjs.toBuffer({
    bcid: "pdf417", text: `M1${code}DL`, scale: 2, height: 12, includetext: false,
  });

  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const navy = rgb(0, 0.2, 0.4);
  const img = await doc.embedPng(png);

  page.drawRectangle({ x: 0, y: 782, width: 595, height: 60, color: navy });
  page.drawText("DELTA", { x: 40, y: 800, size: 22, font: bold, color: rgb(1, 1, 1) });
  page.drawText("E-TICKET RECEIPT", { x: 380, y: 805, size: 11, font: bold, color: rgb(1, 1, 1) });

  let y = 740;
  const line = (l: string, v: string) => {
    page.drawText(l, { x: 40, y, size: 9, font: bold, color: rgb(0.35, 0.4, 0.46) });
    page.drawText(v, { x: 180, y, size: 11, font: reg });
    y -= 22;
  };
  line("PASSENGER", pnr.passenger_name);
  line("CONFIRMATION", pnr.code);
  line("FLIGHT", pnr.flights.flight_no);
  line("ROUTE", `${pnr.flights.origin} → ${pnr.flights.destination}`);
  line("DEPARTS", new Date(pnr.flights.departs_at).toUTCString());
  line("CABIN", pnr.fares.cabin);
  line("FARE", `$${(pnr.fares.price_cents / 100).toFixed(2)}`);
  line("SKYMILES", pnr.sky_miles ?? "—");
  line("AIRCRAFT", pnr.flights.aircraft.type);

  page.drawImage(img, { x: 40, y: 200, width: 300, height: 90 });
  page.drawText("Delta Air Lines, Inc. — Demo e-ticket", { x: 40, y: 60, size: 8, font: reg, color: rgb(0.5, 0.5, 0.5) });

  return new NextResponse(await doc.save(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="ticket-${code}.pdf"`,
    },
  });
}
