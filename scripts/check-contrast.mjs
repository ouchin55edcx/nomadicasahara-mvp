const parse = (hex) => hex.replace("#", "").match(/.{2}/g).map((part) => parseInt(part, 16) / 255).map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
const luminance = (hex) => { const [r, g, b] = parse(hex); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (foreground, background) => { const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a); return (values[0] + 0.05) / (values[1] + 0.05); };
const pairs = [["white on forest", "#FFFFFF", "#006D41"], ["primary on black", "#67B500", "#000000"]];
let failed = false;
for (const [name, foreground, background] of pairs) {
  const value = ratio(foreground, background);
  const pass = value >= 4.5;
  console.log(`${pass ? "PASS" : "FAIL"} ${name}: ${value.toFixed(2)}:1 (WCAG AA normal text)`);
  failed ||= !pass;
}
if (failed) process.exitCode = 1;
