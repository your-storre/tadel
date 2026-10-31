const ALPH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function genPNR() {
  return Array.from({ length: 6 }, () => ALPH[Math.floor(Math.random() * ALPH.length)]).join("");
}
