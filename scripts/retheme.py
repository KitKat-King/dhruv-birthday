#!/usr/bin/env python3
"""Retheme the ERA CUT stylesheet into Dhruv's warm golden-hour palette."""
from pathlib import Path

p = Path("src/app/globals.css")
s = p.read_text()

# ── type system ───────────────────────────────────────────────
s = s.replace(
    '@import url("https://fonts.googleapis.com/css2?family=Anton&family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&family=Playfair+Display:ital,wght@0,700;0,800;1,700;1,800&display=swap");',
    '@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,600;1,9..144,700&family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700;800&display=swap");',
)

s = s.replace(
    '''  --ink: #07070a;
  --ink-2: #0b0a10;
  --ink-3: #12101a;
  --paper: #f7f2ff;
  --muted: rgba(247, 242, 255, 0.62);
  --faint: rgba(247, 242, 255, 0.38);
  --lilac: #cbb7ff;
  --mint: #a5f2d3;
  --pink: #ff9bd4;
  --gold: #e7cfa1;
  --line: rgba(255, 255, 255, 0.13);
  --line-strong: rgba(255, 255, 255, 0.26);
  --sans: "DM Sans", system-ui, -apple-system, sans-serif;
  --mono: "DM Mono", ui-monospace, monospace;
  --serif: "Playfair Display", Georgia, serif;
  --display: "Anton", Impact, sans-serif;
  --pad: clamp(92px, 12vw, 150px);''',
    '''  --ink: #0a0806;
  --ink-2: #100c08;
  --ink-3: #17110b;
  --paper: #fff6e8;
  --muted: rgba(255, 246, 232, 0.64);
  --faint: rgba(255, 246, 232, 0.4);
  --gold: #f4b860;
  --coral: #ff7a5c;
  --jade: #79e0be;
  --sky: #8fa6ff;
  --line: rgba(255, 246, 232, 0.14);
  --line-strong: rgba(255, 246, 232, 0.28);
  --sans: "Manrope", system-ui, -apple-system, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --serif: "Fraunces", Georgia, serif;
  --display: "Bebas Neue", Impact, sans-serif;
  --pad: clamp(64px, 8.5vw, 112px);''',
)

s = s.replace("THE ERA CUT — design tokens", "THE GOLDEN CUT — design tokens")

# ── token names ───────────────────────────────────────────────
s = s.replace("var(--lilac)", "var(--gold)")
s = s.replace("var(--pink)", "var(--coral)")
s = s.replace("var(--mint)", "var(--jade)")

# ── hex palette ───────────────────────────────────────────────
hex_map = {
    "#030305": "#080503", "#040407": "#090604", "#050408": "#0a0704",
    "#050508": "#0a0705", "#07060a": "#0b0805", "#07070a": "#0a0806",
    "#08070c": "#110c07", "#09080d": "#120d07", "#0a0810": "#140e08",
    "#0b0910": "#140e07", "#0b0a10": "#130d08", "#0c0a12": "#150e07",
    "#0d0a13": "#160f08", "#0d0b13": "#170f08", "#0e0b16": "#181009",
    "#100c18": "#1a1109", "#100d17": "#1a1109", "#120f1b": "#1c1209",
    "#12101a": "#1c120a", "#12101c": "#1d130b", "#141019": "#1b1208",
    "#14101c": "#1c1209", "#151020": "#20150b", "#15111f": "#20150c",
    "#161020": "#24180d", "#16111f": "#251a0e", "#170f22": "#241408",
    "#171021": "#231609", "#191223": "#291a0d", "#191423": "#2a1d0f",
    "#1a1428": "#2c1d0f", "#1c1726": "#2d1e10", "#1e1929": "#31210f",
    "#21152f": "#33200f", "#211a30": "#34220f", "#241536": "#3a230f",
    "#241a33": "#3a2814", "#241b33": "#3a2814", "#241c36": "#3a2a16",
    "#261a36": "#3d2814", "#2a1a44": "#3a2410", "#2a2338": "#3b2a17",
    "#2b2140": "#45301c", "#2c2440": "#432817", "#2d2344": "#45301a",
    "#3b2a52": "#5a3a1c", "#3d2c52": "#5c3c1e", "#6d4fa8": "#b4762f",
    "#7a52c2": "#c07a2c", "#4b3570": "#7a5426", "#1c1328": "#2a1a0c",
    "#1d1429": "#2f1e0d", "#201530": "#332010", "#33234c": "#4a2f14",
    "#2b1c40": "#42280f", "#241733": "#3a2410", "#2a2020": "#241812",
    "#4c4559": "#5a4a3a", "#9b93ad": "#b8a58c",
    "#cbb7ff": "#f4b860", "#ff9bd4": "#ff7a5c", "#a5f2d3": "#79e0be",
    "#d6c6ff": "#ffe0b0", "#9b90b6": "#c9a37a", "#a98ee0": "#e0a35e",
    "#d9c8f6": "#f6d7a8", "#e6e0f2": "#f4e3c8", "#dcd5ec": "#efdcc0",
    "#ded6ee": "#eadbc4", "#ded7ea": "#e6d7c2", "#e2d7f6": "#f0dcbf",
    "#e7e1f4": "#ede0cc", "#eee7fb": "#f5e6cf", "#efe6ff": "#f9eeda",
    "#efe7fb": "#f7ead6", "#efe8ff": "#f8eedc", "#f0e9fc": "#fbf0dd",
    "#f7f2ff": "#fff6e8", "#f8f4ff": "#fffaf0", "#fdfaff": "#fffcf4",
    "#fdfbff": "#fffaef", "#fffdf9": "#fff9ee", "#ffe7f4": "#ffe8cc",
    "#eafff6": "#e6fff4", "#8fd8f2": "#8fa6ff", "#e7cfa1": "#f4b860",
}

for old, new in hex_map.items():
    s = s.replace(old, new)

# ── rgba palette ──────────────────────────────────────────────
rgba_map = {
    "rgba(203, 183, 255": "rgba(244, 184, 96",
    "rgba(255, 155, 212": "rgba(255, 122, 92",
    "rgba(165, 242, 211": "rgba(121, 224, 190",
    "rgba(247, 242, 255": "rgba(255, 246, 232",
    "rgba(122, 82, 194": "rgba(192, 122, 44",
    "rgba(109, 79, 168": "rgba(180, 118, 47",
    "rgba(150, 120, 200": "rgba(190, 140, 70",
    "rgba(76, 179, 151": "rgba(121, 224, 190",
    "rgba(220, 214, 235": "rgba(240, 226, 205",
    "rgba(29, 20, 41": "rgba(47, 30, 13",
    "rgba(51, 35, 76": "rgba(74, 46, 24",
    "rgba(52, 28, 84": "rgba(74, 44, 18",
    "rgba(43, 28, 64": "rgba(74, 46, 24",
    "rgba(40, 20, 60": "rgba(74, 44, 18",
    "rgba(40, 22, 62": "rgba(74, 44, 18",
    "rgba(28, 19, 40": "rgba(46, 30, 16",
    "rgba(36, 23, 51": "rgba(58, 36, 16",
    "rgba(60, 34, 96": "rgba(120, 78, 34",
    "rgba(32, 21, 48": "rgba(51, 32, 16",
    "rgba(26, 20, 40": "rgba(51, 35, 20",
    "rgba(22, 17, 31": "rgba(40, 28, 16",
    "rgba(20, 16, 28": "rgba(36, 24, 13",
    "rgba(17, 12, 24": "rgba(32, 22, 12",
    "rgba(12, 8, 20": "rgba(26, 18, 10",
    "rgba(10, 8, 14": "rgba(22, 16, 9",
    "rgba(9, 8, 13": "rgba(20, 14, 8",
    "rgba(8, 7, 12": "rgba(18, 13, 7",
}

for old, new in rgba_map.items():
    s = s.replace(old, new)

p.write_text(s)
print("retheme pass 1 complete")
