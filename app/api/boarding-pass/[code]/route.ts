import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import bwipjs from "bwip-js";
import { supabase } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { data: pnr } = await supabase.from("pnrs")
    .select("*, flights(*, aircraft(type)), fares(cabin), boarding_passes(group_no, barcode), seats(row, col)")
    .eq("code", code).single();
  if (!pnr) return NextResponse.json({ error: "not found" }, { status: 404 });
  const bp = pnr.boarding_passes[0];

  const png = await bwipjs.toBuffer({
    bcid: "pdf417", text: bp.barcode, scale: 3, height: 20, includetext: false,
  });

  const doc = await PDFDocument.create();
  const page = doc.addPage([420, 700]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const navy = rgb(0, 0.2, 0.4);
  const img = await doc.embedPng(png);

  page.drawRectangle({ x: 0, y: 640, width: 420, height: 60, color: navy });
  page.drawText("DELTA", { x: 24, y: 662, size: 20, font: bold, color: rgb(1, 1, 1) });
  page.drawText("BOARDING PASS", { x: 250, y: 665, size: 11, font: bold, color: rgb(1, 1, 1) });

  let y = 600;
  const line = (l: string, v: string) => {
    page.drawText(l, { x: 24, y, size: 8, font: bold, color: rgb(0.35, 0.4, 0.46) });
    page.drawText(v, { x: 150, y, size: 12, font: reg });
    y -= 24;
  };
  line("PASSENGER", pnr.passenger_name);
  line("FROM", pnr.flights.origin);
  line("TO", pnr.flights.destination);
  line("FLIGHT", pnr.flights.flight_no);
  line("GATE", "B14");
  line("SEAT", `${pnr.seats.row}${pnr.seats.col}`);
  line("BOARDING GROUP", bp.group_no);
  line("CABIN", pnr.fares.cabin);
  line("DEPARTS", new Date(pnr.flights.departs_at).toUTCString());

  page.drawImage(img, { x: 24, y: 120, width: 372, height: 120 });
  page.drawText("TSA PreCheck ✓  ·  Demo boarding pass", { x: 24, y: 90, size: 8, font: reg });

  return new NextResponse(await doc.save(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="boarding-pass-${code}.pdf"`,
    },
  });
}
