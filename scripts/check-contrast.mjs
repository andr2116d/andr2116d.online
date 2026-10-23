// Verifies WCAG 2 contrast for every text token pair in both themes.
// Usage: pnpm contrast   (fails when a pair is below 4.5:1)
import { readFile } from "node:fs/promises";

const css = await readFile("src/styles/tokens.css", "utf8");
const tokens = Object.fromEntries(
  [
    ...css.matchAll(
      /(--[\w-]+): light-dark\((#[0-9a-f]{6}), (#[0-9a-f]{6})\)/gi,
    ),
  ].map(([, name, light, dark]) => [name, [light, dark]]),
);

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const foregrounds = [
  "--text",
  "--text-muted",
  "--text-subtle",
  "--accent",
  "--chem",
  "--group-backend",
  "--group-frontend",
  "--group-data",
  "--group-cloud",
];
const backgrounds = ["--bg", "--surface", "--surface-2"];
const pairs = [
  ...foregrounds.flatMap((fg) => backgrounds.map((bg) => [fg, bg])),
  ["--on-accent", "--accent"],
];

let failures = 0;
const rows = [];
for (const [index, theme] of ["light", "dark"].entries()) {
  for (const [fg, bg] of pairs) {
    const value = ratio(tokens[fg][index], tokens[bg][index]);
    if (value < 4.5) failures++;
    rows.push({
      theme,
      pair: `${fg} / ${bg}`,
      ratio: value.toFixed(2),
      AA: value >= 4.5 ? "✓" : "✗",
    });
  }
}
console.table(rows);
if (failures) {
  console.error(`${failures} pair(s) below 4.5:1`);
  process.exit(1);
}
