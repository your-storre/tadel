import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Delta Air Lines | Flight Booking" };

const NAV = [
  { href: "/", label: "Book" },
  { href: "/checkin", label: "Check-In" },
  { href: "/trips", label: "My Trips" },
  { href: "/status", label: "Flight Status" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <header className="bg-delta-navy">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white">
              <span className="w-8 h-8 rounded-full bg-white text-delta-red grid place-items-center font-black text-lg">Δ</span>
              <span className="font-black tracking-tight text-lg">
                DELTA<sup className="text-[10px] font-normal">®</sup>
              </span>
            </Link>
            <nav className="hidden md:flex gap-8">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href}
                  className="text-white/85 hover:text-white text-sm font-bold uppercase tracking-wide">
                  {n.label}
                </Link>
              ))}
            </nav>
            <button className="btn-red !py-2 !px-4">Log In</button>
          </div>
        </header>

        <main className="min-h-[60vh]">{children}</main>

        <footer className="bg-delta-navyDeep text-white/70 text-xs mt-20">
          <div className="max-w-7xl mx-auto px-6 py-10 space-y-3">
            <div className="font-bold text-white">DELTA<sup className="text-[9px]">®</sup></div>
            <p>
              Delta Air Lines and the Delta logo are registered trademarks of Delta Air Lines, Inc.
              This site is an unofficial demonstration clone and is not affiliated with Delta.
            </p>
            <p>© {new Date().getFullYear()} Delta Air Lines, Inc. — Demo build.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
