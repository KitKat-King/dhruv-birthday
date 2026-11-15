#!/usr/bin/env python3
"""Generate the original warm-cinema placeholder art for the Dhruv site."""
from pathlib import Path

OUT = Path("public/media")
OUT.mkdir(parents=True, exist_ok=True)

GRAIN = """
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
"""


def grain(w, h, opacity=".10"):
    return (
        f'<rect width="{w}" height="{h}" filter="url(#grain)" opacity="{opacity}" '
        'style="mix-blend-mode:overlay"/>'
    )


def svg(w, h, body, defs=""):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">\n'
        f"  <defs>{GRAIN}{defs}</defs>\n{body}\n</svg>\n"
    )


# ── DP placeholder: golden bust silhouette ─────────────────────────────
dp_defs = """
    <radialGradient id="dpSky" cx="50%" cy="38%" r="72%">
      <stop offset="0" stop-color="#ffd89a"/>
      <stop offset=".42" stop-color="#e08a3c"/>
      <stop offset=".78" stop-color="#5a2c11"/>
      <stop offset="1" stop-color="#170d06"/>
    </radialGradient>
    <linearGradient id="dpBust" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a1009"/>
      <stop offset="1" stop-color="#070504"/>
    </linearGradient>
    <linearGradient id="dpRim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffe4b0"/>
      <stop offset=".55" stop-color="#ff9d4d"/>
      <stop offset="1" stop-color="#ff7a5c"/>
    </linearGradient>
    <filter id="dpBlur"><feGaussianBlur stdDeviation="26"/></filter>
"""
dp_body = """
  <rect width="900" height="1100" fill="url(#dpSky)"/>
  <circle cx="450" cy="430" r="300" fill="#ffcf7d" opacity=".55" filter="url(#dpBlur)"/>
  <circle cx="450" cy="430" r="218" fill="#fff0cc" opacity=".72"/>
  <circle cx="450" cy="430" r="218" fill="none" stroke="#ffe3a8" stroke-width="1.5" opacity=".7"/>
  <g fill="none" stroke="#ffe8bd" stroke-width="1" opacity=".32">
    <path d="M450 90v110"/><path d="M450 660v110"/>
    <path d="M110 430h110"/><path d="M680 430h110"/>
    <path d="M214 194l76 76"/><path d="M610 590l76 76"/>
    <path d="M686 194l-76 76"/><path d="M290 590l-76 76"/>
  </g>
  <path d="M254 1100c0-206 76-318 196-318 120 0 196 112 196 318H254Z" fill="url(#dpBust)"/>
  <path d="M450 782c74 0 106 58 112 120 10 96 32 158 70 198H268c38-40 60-102 70-198 6-62 38-120 112-120Z" fill="url(#dpBust)"/>
  <ellipse cx="450" cy="560" rx="122" ry="152" fill="url(#dpBust)"/>
  <path d="M340 520c0-94 46-158 110-158s110 64 110 158c0 22-8 44-18 60-4-58-30-92-52-108-26 40-84 56-132 50-10 28-14 48-18 58-10-16-18-38-18-60Z" fill="#0d0805" opacity=".85"/>
  <path d="M572 470c26 26 40 62 36 104-3 36-18 66-42 88 14-58 12-130 6-192Z" fill="url(#dpRim)" opacity=".45"/>
  <path d="M330 1002c40-78 82-120 120-120s80 42 120 120" fill="none" stroke="url(#dpRim)" stroke-width="2" opacity=".35"/>
  <g fill="#ffe9c4">
    <circle cx="170" cy="250" r="2.5" opacity=".8"/>
    <circle cx="742" cy="330" r="2" opacity=".6"/>
    <circle cx="700" cy="760" r="3" opacity=".5"/>
    <circle cx="196" cy="700" r="2" opacity=".55"/>
  </g>
"""
(OUT / "dp.svg").write_text(svg(900, 1100, dp_body, dp_defs))

# ── Memory 1: the entrance / arch of light ─────────────────────────────
m1_defs = """
    <linearGradient id="m1bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#170e07"/>
      <stop offset=".55" stop-color="#3a1e0b"/>
      <stop offset="1" stop-color="#0a0704"/>
    </linearGradient>
    <linearGradient id="m1light" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff4d2"/>
      <stop offset=".45" stop-color="#ffc46e"/>
      <stop offset="1" stop-color="#ff7a5c"/>
    </linearGradient>
    <mask id="m1m"><rect width="800" height="870" fill="#fff"/>
      <path d="M282 870V420a118 118 0 0 1 236 0v450Z" fill="#000"/>
    </mask>
    <filter id="m1glow"><feGaussianBlur stdDeviation="20"/></filter>
"""
m1_body = """
  <rect width="800" height="870" fill="url(#m1bg)"/>
  <g mask="url(#m1m)">
    <rect width="800" height="870" fill="url(#m1light)"/>
    <circle cx="400" cy="470" r="250" fill="#fff3d0" opacity=".55" filter="url(#m1glow)"/>
    <g stroke="#fff6dd" stroke-width="2" opacity=".4">
      <path d="M400 470 120 210"/><path d="M400 470 690 190"/>
      <path d="M400 470 90 600"/><path d="M400 470 720 610"/>
      <path d="M400 470 250 830"/><path d="M400 470 560 840"/>
    </g>
  </g>
  <path d="M282 870V420a118 118 0 0 1 236 0v450" fill="none" stroke="#ffd79a" stroke-width="4" opacity=".75"/>
  <path d="M298 870V424a102 102 0 0 1 204 0v446" fill="none" stroke="#ffedc9" stroke-width="1" opacity=".6"/>
  <ellipse cx="400" cy="866" rx="210" ry="34" fill="#ffc46e" opacity=".3" filter="url(#m1glow)"/>
  <g fill="#ffe9c4">
    <circle cx="150" cy="170" r="2" opacity=".5"/><circle cx="660" cy="240" r="2.5" opacity=".6"/>
    <circle cx="122" cy="660" r="1.8" opacity=".4"/><circle cx="688" cy="740" r="2" opacity=".5"/>
  </g>
"""
(OUT / "memory-1.svg").write_text(svg(800, 870, m1_body, m1_defs))

# ── Memory 2: the chaos / bokeh + ribbons ──────────────────────────────
m2_defs = """
    <linearGradient id="m2bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2a1208"/>
      <stop offset=".5" stop-color="#14100a"/>
      <stop offset="1" stop-color="#0a0806"/>
    </linearGradient>
    <filter id="m2blur"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="m2soft"><feGaussianBlur stdDeviation="4"/></filter>
"""
m2_body = """
  <rect width="800" height="870" fill="url(#m2bg)"/>
  <circle cx="250" cy="290" r="170" fill="#ff7a5c" opacity=".35" filter="url(#m2blur)"/>
  <circle cx="600" cy="600" r="200" fill="#f4b860" opacity=".32" filter="url(#m2blur)"/>
  <circle cx="620" cy="220" r="120" fill="#8fa6ff" opacity=".22" filter="url(#m2blur)"/>
  <path d="M-40 640C170 470 300 760 470 610s230-40 370 80" fill="none" stroke="#ffb067" stroke-width="46" opacity=".38" filter="url(#m2soft)"/>
  <path d="M-30 740C180 590 330 840 520 690s210-30 330 70" fill="none" stroke="#ff7a5c" stroke-width="20" opacity=".5"/>
  <path d="M-20 250C160 130 250 330 420 220s250 90 400 10" fill="none" stroke="#79e0be" stroke-width="6" opacity=".45"/>
  <g opacity=".8">
    <circle cx="210" cy="420" r="58" fill="none" stroke="#ffe0a6" stroke-width="2"/>
    <circle cx="540" cy="470" r="34" fill="none" stroke="#ff9f7c" stroke-width="2"/>
    <circle cx="660" cy="740" r="72" fill="none" stroke="#f4b860" stroke-width="1.5" opacity=".7"/>
    <circle cx="120" cy="700" r="22" fill="#ffd9a0" opacity=".4"/>
  </g>
  <g fill="#ffe9c4">
    <circle cx="330" cy="180" r="3"/><circle cx="470" cy="320" r="2"/><circle cx="720" cy="380" r="2.5"/>
    <circle cx="150" cy="540" r="2"/><circle cx="390" cy="760" r="3"/><circle cx="600" cy="120" r="2"/>
  </g>
  <g stroke="#f4b860" stroke-width="2" opacity=".6">
    <path d="M300 120l8 24 24 8-24 8-8 24-8-24-24-8 24-8Z"/>
    <path d="M690 500l5 15 15 5-15 5-5 15-5-15-15-5 15-5Z"/>
  </g>
"""
(OUT / "memory-2.svg").write_text(svg(800, 870, m2_body, m2_defs))

# ── Memory 3: the calm / low sun over water ────────────────────────────
m3_defs = """
    <linearGradient id="m3sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d0b0a"/>
      <stop offset=".42" stop-color="#55280f"/>
      <stop offset=".68" stop-color="#d97b38"/>
      <stop offset=".78" stop-color="#ffd08a"/>
      <stop offset="1" stop-color="#2a150a"/>
    </linearGradient>
    <linearGradient id="m3water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c07a3c"/>
      <stop offset=".4" stop-color="#3d1f0e"/>
      <stop offset="1" stop-color="#120b06"/>
    </linearGradient>
    <radialGradient id="m3sun" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff8e2"/>
      <stop offset=".55" stop-color="#ffd28a"/>
      <stop offset="1" stop-color="#ff7a5c" stop-opacity=".1"/>
    </radialGradient>
"""
m3_body = """
  <rect width="800" height="870" fill="url(#m3sky)"/>
  <circle cx="400" cy="566" r="150" fill="url(#m3sun)"/>
  <circle cx="400" cy="566" r="66" fill="#fff4d6"/>
  <g stroke="#ffe3b0" stroke-width="1" opacity=".5">
    <path d="M120 566h150"/><path d="M530 566h150"/>
    <path d="M400 360v86"/>
  </g>
  <rect y="612" width="800" height="258" fill="url(#m3water)"/>
  <g stroke="#ffd699" stroke-linecap="round" opacity=".55">
    <path d="M180 650h110" stroke-width="2"/>
    <path d="M320 678h180" stroke-width="3"/>
    <path d="M240 710h110" stroke-width="1.5"/>
    <path d="M420 736h150" stroke-width="2"/>
    <path d="M150 760h90" stroke-width="1"/>
    <path d="M500 792h140" stroke-width="1.5"/>
    <path d="M280 820h120" stroke-width="1"/>
  </g>
  <g fill="none" stroke="#1a1008" stroke-width="3" stroke-linecap="round" opacity=".8">
    <path d="M548 300c10-10 22-10 32 0"/><path d="M590 320c7-7 15-7 22 0"/>
  </g>
  <g fill="#ffe9c4">
    <circle cx="180" cy="180" r="2"/><circle cx="620" cy="120" r="2.5"/><circle cx="690" cy="420" r="1.8"/>
  </g>
"""
(OUT / "memory-3.svg").write_text(svg(800, 870, m3_body, m3_defs))

# ── Memory 4: the gold / sunburst ──────────────────────────────────────
m4_defs = """
    <radialGradient id="m4bg" cx="50%" cy="46%" r="70%">
      <stop offset="0" stop-color="#ffe4ac"/>
      <stop offset=".32" stop-color="#f4b860"/>
      <stop offset=".68" stop-color="#9a4c18"/>
      <stop offset="1" stop-color="#150c06"/>
    </radialGradient>
    <filter id="m4glow"><feGaussianBlur stdDeviation="22"/></filter>
"""
m4_lines = "".join(
    f'<path d="M400 420 L {400 + 470 * __import__("math").cos(__import__("math").radians(a)):.1f} '
    f'{420 + 470 * __import__("math").sin(__import__("math").radians(a)):.1f}" />'
    for a in range(0, 360, 10)
)
m4_body = f"""
  <rect width="800" height="870" fill="url(#m4bg)"/>
  <g stroke="#ffe9bd" stroke-width="1.2" opacity=".35">{m4_lines}</g>
  <circle cx="400" cy="420" r="220" fill="#ffdb99" opacity=".55" filter="url(#m4glow)"/>
  <circle cx="400" cy="420" r="150" fill="#fff3d2"/>
  <circle cx="400" cy="420" r="150" fill="none" stroke="#fff8e4" stroke-width="1.5" opacity=".8"/>
  <g fill="none" stroke="#2a1509" stroke-width="2.5" opacity=".55">
    <path d="M210 742c30-60 70-90 120-90s90 30 120 90"/>
    <path d="M470 760c26-46 58-70 96-70s70 24 96 70"/>
  </g>
  <g fill="#ffe9c4">
    <circle cx="140" cy="180" r="2.5"/><circle cx="660" cy="230" r="2"/><circle cx="700" cy="650" r="2.5"/>
    <circle cx="120" cy="640" r="2"/><circle cx="400" cy="780" r="2"/>
  </g>
"""
(OUT / "memory-4.svg").write_text(svg(800, 870, m4_body, m4_defs))

# ── Scene A: golden hour drive ─────────────────────────────────────────
sa_defs = """
    <linearGradient id="sabg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a1009"/>
      <stop offset=".42" stop-color="#7d3c12"/>
      <stop offset=".72" stop-color="#f4a34f"/>
      <stop offset="1" stop-color="#2a1509"/>
    </linearGradient>
    <radialGradient id="sasun" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff8e6"/>
      <stop offset=".6" stop-color="#ffd391"/>
      <stop offset="1" stop-color="#ff7a5c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="saroad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a170c"/>
      <stop offset="1" stop-color="#090604"/>
    </linearGradient>
"""
sa_body = """
  <rect width="800" height="620" fill="url(#sabg)"/>
  <circle cx="470" cy="360" r="210" fill="url(#sasun)"/>
  <circle cx="470" cy="360" r="96" fill="#fff2d0"/>
  <path d="M0 402C120 350 220 420 330 392s170-74 300-30 170 30 170 30v228H0Z" fill="#1c0f07" opacity=".8"/>
  <path d="M338 620 430 366h80l92 254Z" fill="url(#saroad)"/>
  <path d="M398 620l24-230h12l24 230Z" fill="#ffd79a" opacity=".65"/>
  <g stroke="#ffd79a" stroke-width="2" opacity=".5">
    <path d="M270 620 398 400"/><path d="M530 620 442 400"/>
  </g>
  <g fill="#0b0704">
    <rect x="44" y="330" width="8" height="120"/><rect x="120" y="300" width="6" height="150"/>
    <rect x="720" y="316" width="7" height="134"/>
  </g>
  <g fill="#140c06">
    <circle cx="70" cy="326" r="26"/><circle cx="126" cy="296" r="32"/><circle cx="724" cy="312" r="30"/>
  </g>
"""
(OUT / "scene-a.svg").write_text(svg(800, 620, sa_body, sa_defs))

# ── Scene B: afterglow hills ───────────────────────────────────────────
sb_defs = """
    <linearGradient id="sbbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b0810"/>
      <stop offset=".38" stop-color="#3a1424"/>
      <stop offset=".62" stop-color="#c9503f"/>
      <stop offset=".8" stop-color="#ffb36b"/>
      <stop offset="1" stop-color="#1a0f08"/>
    </linearGradient>
    <filter id="sbglow"><feGaussianBlur stdDeviation="26"/></filter>
"""
sb_body = """
  <rect width="800" height="620" fill="url(#sbbg)"/>
  <circle cx="400" cy="420" r="230" fill="#ff9a63" opacity=".35" filter="url(#sbglow)"/>
  <circle cx="400" cy="420" r="80" fill="#ffd9a0" opacity=".9"/>
  <g fill="#1a0d12">
    <path d="M0 500c90-70 160-100 240-70s120 60 190 30 130-12 190 20 120 50 180 30v110H0Z"/>
    <path d="M0 560c110-50 200-40 290-10s170 40 260 10 170-10 250 20v40H0Z" opacity=".9"/>
  </g>
  <g fill="#ffeed4">
    <circle cx="150" cy="120" r="2"/><circle cx="260" cy="80" r="1.6"/><circle cx="620" cy="140" r="2.2"/>
    <circle cx="700" cy="90" r="1.4"/><circle cx="520" cy="60" r="1.8"/><circle cx="360" cy="110" r="1.5"/>
    <circle cx="80" cy="220" r="1.6"/><circle cx="740" cy="250" r="1.5"/>
  </g>
  <g fill="none" stroke="#ffcf9a" stroke-width="1.4" opacity=".55">
    <path d="M210 330c12-12 26-12 38 0"/><path d="M262 352c9-9 19-9 28 0"/>
  </g>
"""
(OUT / "scene-b.svg").write_text(svg(800, 620, sb_body, sb_defs))

# ── Gift illustration ──────────────────────────────────────────────────
gift_defs = """
    <radialGradient id="gbg" cx="50%" cy="42%" r="70%">
      <stop offset="0" stop-color="#3a220f"/>
      <stop offset="1" stop-color="#0a0704"/>
    </radialGradient>
    <linearGradient id="gbox" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff8a63"/>
      <stop offset="1" stop-color="#b43d2a"/>
    </linearGradient>
    <linearGradient id="glid" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff0c9"/>
      <stop offset=".5" stop-color="#f4b860"/>
      <stop offset="1" stop-color="#c07a2c"/>
    </linearGradient>
    <filter id="gglow"><feGaussianBlur stdDeviation="18"/></filter>
"""
gift_body = """
  <rect width="720" height="720" fill="url(#gbg)"/>
  <circle cx="360" cy="360" r="240" fill="#f4b860" opacity=".2" filter="url(#gglow)"/>
  <ellipse cx="360" cy="606" rx="190" ry="30" fill="#000" opacity=".45" filter="url(#gglow)"/>
  <rect x="196" y="300" width="328" height="260" rx="10" fill="url(#gbox)"/>
  <rect x="176" y="250" width="368" height="76" rx="8" fill="#e0603f"/>
  <rect x="330" y="250" width="60" height="310" fill="url(#glid)"/>
  <rect x="176" y="250" width="368" height="76" rx="8" fill="none" stroke="#ffd9a0" stroke-width="1.5" opacity=".5"/>
  <path d="M360 250c-70-10-116-46-106-84 9-34 62-26 106 34 44-60 97-68 106-34 10 38-36 74-106 84Z" fill="url(#glid)"/>
  <circle cx="360" cy="248" r="16" fill="#ffdf9e"/>
  <g fill="#ffe9c4">
    <path d="M170 160l5 16 16 5-16 5-5 16-5-16-16-5 16-5Z"/>
    <path d="M556 190l4 12 12 4-12 4-4 12-4-12-12-4 12-4Z"/>
    <circle cx="580" cy="470" r="3"/><circle cx="142" cy="470" r="2.4"/><circle cx="234" cy="640" r="2"/>
  </g>
  <g stroke="#ffd9a0" stroke-width="1.2" opacity=".45">
    <path d="M120 360h60"/><path d="M546 340h60"/><path d="M360 96v54"/>
  </g>
"""
(OUT / "gift.svg").write_text(svg(720, 720, gift_body, gift_defs))

# ── Reel 1: light-leak film frame ──────────────────────────────────────
r1_defs = """
    <linearGradient id="r1bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#211208"/>
      <stop offset=".55" stop-color="#5c2c11"/>
      <stop offset="1" stop-color="#0b0704"/>
    </linearGradient>
    <linearGradient id="r1leak" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff7a5c" stop-opacity=".0"/>
      <stop offset=".5" stop-color="#ffb067" stop-opacity=".7"/>
      <stop offset="1" stop-color="#fff0c9" stop-opacity=".0"/>
    </linearGradient>
    <filter id="r1blur"><feGaussianBlur stdDeviation="30"/></filter>
"""
r1_body = """
  <rect width="800" height="1000" fill="url(#r1bg)"/>
  <circle cx="540" cy="280" r="210" fill="#f4b860" opacity=".28" filter="url(#r1blur)"/>
  <path d="M-100 620 900 240" stroke="url(#r1leak)" stroke-width="160" filter="url(#r1blur)"/>
  <circle cx="330" cy="470" r="190" fill="none" stroke="#ffd9a0" stroke-width="2" opacity=".55"/>
  <circle cx="330" cy="470" r="150" fill="none" stroke="#ff7a5c" stroke-width="10" opacity=".3"/>
  <circle cx="330" cy="470" r="86" fill="#1b1007" stroke="#ffd9a0" stroke-width="1.5" opacity=".8"/>
  <g stroke="#ffe9c4" stroke-width="1" opacity=".4">
    <path d="M90 190h180"/><path d="M90 210h120"/><path d="M610 780h120"/><path d="M560 800h170"/>
  </g>
  <g fill="#ffe9c4">
    <circle cx="620" cy="560" r="3"/><circle cx="180" cy="760" r="2"/><circle cx="700" cy="180" r="2.4"/>
  </g>
"""
(OUT / "reel-1.svg").write_text(svg(800, 1000, r1_body, r1_defs))

# ── Reel 2: vinyl / prism ──────────────────────────────────────────────
r2_defs = """
    <linearGradient id="r2bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c0a08"/>
      <stop offset=".6" stop-color="#2b160c"/>
      <stop offset="1" stop-color="#0a0704"/>
    </linearGradient>
    <radialGradient id="r2label" cx="50%" cy="45%" r="55%">
      <stop offset="0" stop-color="#fff0cd"/>
      <stop offset=".55" stop-color="#f4b860"/>
      <stop offset="1" stop-color="#b4562a"/>
    </radialGradient>
"""
r2_body = """
  <rect width="800" height="1000" fill="url(#r2bg)"/>
  <circle cx="400" cy="520" r="300" fill="#0a0806" stroke="#2a1a0e" stroke-width="2"/>
  <g fill="none" stroke="#4a2f1a" opacity=".7">
    <circle cx="400" cy="520" r="270" stroke-width="1"/>
    <circle cx="400" cy="520" r="240" stroke-width="1"/>
    <circle cx="400" cy="520" r="210" stroke-width="1"/>
    <circle cx="400" cy="520" r="180" stroke-width="1"/>
    <circle cx="400" cy="520" r="150" stroke-width="1"/>
  </g>
  <circle cx="400" cy="520" r="106" fill="url(#r2label)"/>
  <circle cx="400" cy="520" r="24" fill="#1a1008"/>
  <g fill="none" stroke="#ffe0a6" stroke-width="1.2" opacity=".5">
    <path d="M400 260v44"/><path d="M400 736v44"/><path d="M140 520h44"/><path d="M616 520h44"/>
  </g>
  <path d="M-40 860C160 760 300 940 480 860s240-20 360 40" fill="none" stroke="#ff7a5c" stroke-width="2" opacity=".5"/>
  <g fill="#ffe9c4">
    <circle cx="160" cy="180" r="2"/><circle cx="650" cy="240" r="2.5"/><circle cx="690" cy="800" r="2"/>
  </g>
"""
(OUT / "reel-2.svg").write_text(svg(800, 1000, r2_body, r2_defs))

# ── Side A: golden hour ────────────────────────────────────────────────
gh_defs = """
    <linearGradient id="ghsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a1008"/>
      <stop offset=".4" stop-color="#7a3d13"/>
      <stop offset=".66" stop-color="#e9963f"/>
      <stop offset=".82" stop-color="#ffd79a"/>
      <stop offset="1" stop-color="#2a160a"/>
    </linearGradient>
    <radialGradient id="ghsun" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff9ea"/>
      <stop offset=".58" stop-color="#ffd494"/>
      <stop offset="1" stop-color="#ff9a63" stop-opacity=".08"/>
    </radialGradient>
    <filter id="ghblur"><feGaussianBlur stdDeviation="18"/></filter>
"""
gh_body = """
  <rect width="900" height="1100" fill="url(#ghsky)"/>
  <circle cx="450" cy="540" r="300" fill="url(#ghsun)"/>
  <circle cx="450" cy="540" r="120" fill="#fff3d6"/>
  <path d="M0 730c140-60 260-20 380-50s220-64 340-30 140 44 180 30v420H0Z" fill="#1c0f08" opacity=".85"/>
  <g fill="#100a05">
    <circle cx="330" cy="760" r="22"/><rect x="316" y="772" width="28" height="86" rx="14"/>
    <circle cx="390" cy="778" r="19"/><rect x="378" y="788" width="24" height="70" rx="12"/>
    <path d="M310 856c0-14 9-24 20-24s20 10 20 24Z"/>
    <path d="M372 854c0-12 8-21 18-21s18 9 18 21Z"/>
  </g>
  <g fill="none" stroke="#1a0f08" stroke-width="2.5" stroke-linecap="round" opacity=".65">
    <path d="M600 330c12-12 26-12 38 0"/><path d="M652 352c9-9 19-9 28 0"/>
  </g>
  <g stroke="#ffe3b4" stroke-width="1" opacity=".35">
    <path d="M120 540h150"/><path d="M630 540h150"/><path d="M450 260v92"/>
  </g>
"""
(OUT / "golden-hour.svg").write_text(svg(900, 1100, gh_body, gh_defs))

# ── Side B: afterglow ──────────────────────────────────────────────────
ag_defs = """
    <linearGradient id="agbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b0810"/>
      <stop offset=".36" stop-color="#3a1424"/>
      <stop offset=".6" stop-color="#b8473c"/>
      <stop offset=".78" stop-color="#ffb36b"/>
      <stop offset="1" stop-color="#1a0f08"/>
    </linearGradient>
    <filter id="agblur"><feGaussianBlur stdDeviation="26"/></filter>
"""
ag_body = """
  <rect width="900" height="1100" fill="url(#agbg)"/>
  <circle cx="450" cy="720" r="250" fill="#ff9a63" opacity=".4" filter="url(#agblur)"/>
  <circle cx="450" cy="720" r="92" fill="#ffdca8"/>
  <path d="M0 810c120-70 220-40 330-66s220-40 340 6 170 44 230 26v324H0Z" fill="#160c10"/>
  <path d="M0 880c140-44 250-10 380-30s250-24 360 10 120 30 160 20v220H0Z" fill="#0c0708" opacity=".9"/>
  <g fill="#ffe9d0">
    <circle cx="130" cy="160" r="2.4"/><circle cx="260" cy="110" r="1.6"/><circle cx="640" cy="180" r="2.2"/>
    <circle cx="740" cy="100" r="1.5"/><circle cx="520" cy="80" r="1.8"/><circle cx="380" cy="150" r="1.4"/>
    <circle cx="820" cy="300" r="1.6"/><circle cx="90" cy="330" r="1.5"/><circle cx="200" cy="420" r="1.3"/>
  </g>
  <g fill="none" stroke="#ffcf9a" stroke-width="1.4" opacity=".5">
    <path d="M240 470c14-14 30-14 44 0"/><path d="M300 494c10-10 22-10 32 0"/>
  </g>
"""
(OUT / "afterglow.svg").write_text(svg(900, 1100, ag_body, ag_defs))

# ── Cover / OG ─────────────────────────────────────────────────────────
cover_defs = """
    <linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0806"/>
      <stop offset=".55" stop-color="#2a160c"/>
      <stop offset="1" stop-color="#0a0806"/>
    </linearGradient>
    <radialGradient id="csun" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff4d6"/>
      <stop offset=".5" stop-color="#f4b860"/>
      <stop offset="1" stop-color="#ff7a5c" stop-opacity="0"/>
    </radialGradient>
"""
cover_body = """
  <rect width="1200" height="630" fill="url(#cbg)"/>
  <circle cx="960" cy="300" r="260" fill="url(#csun)" opacity=".9"/>
  <circle cx="960" cy="300" r="130" fill="#fff1cd" opacity=".9"/>
  <g fill="none" stroke="#ffdca6" stroke-width="1" opacity=".35">
    <circle cx="960" cy="300" r="186"/><circle cx="960" cy="300" r="210"/>
    <path d="M960 52v52"/><path d="M960 496v52"/><path d="M712 300h52"/><path d="M1156 300h52"/>
  </g>
  <g font-family="'Arial Narrow', 'Helvetica Neue', sans-serif" fill="#fff6e8">
    <text x="90" y="250" font-size="132" letter-spacing="2">DHRUV</text>
    <text x="94" y="330" font-size="34" letter-spacing="12" fill="#f4b860">GOLDEN HOUR</text>
    <text x="94" y="392" font-size="18" letter-spacing="6" fill="#fff6e8" opacity=".55">A PRIVATE BIRTHDAY TRANSMISSION</text>
  </g>
  <g stroke="#f4b860" stroke-width="2" opacity=".7">
    <path d="M90 300h40"/><path d="M90 420h250"/>
  </g>
  <g fill="#ffd9a0">
    <circle cx="420" cy="120" r="2.4"/><circle cx="520" cy="80" r="1.8"/><circle cx="620" cy="500" r="2"/>
    <circle cx="260" cy="520" r="1.8"/><circle cx="1100" cy="560" r="2.2"/>
  </g>
"""
(OUT / "cover.svg").write_text(svg(1200, 630, cover_body, cover_defs))

print("wrote", len(list(OUT.glob("*.svg"))), "svg files")
