# Bolly Landing Page

This is a build of the Bolly "Knock Out Flakes" landing page, based on the reference
design in the assignment PDF. It includes a shampoo bottle you can drag to rotate,
built with plain CSS and JavaScript — no 3D library, no external model file.

**[I cannot verify the exact fonts, colors, or copy used in the original design file — the reference I worked from was a screenshot in the PDF, not source files. I matched it as closely as I could by eye.]**

## What's in here

- `index.html` — page structure
- `style.css` — layout, colors, responsive rules
- `script.js` — builds the 3D bottle and handles drag/touch rotation

Open `index.html` in a browser and it works on its own. No build step, no dependencies.

## How the 3D bottle works

There's no real 3D model here. It's a trick that's been used in CSS for years: take a
flat label graphic, cut it into thin vertical strips, and arrange the strips in a
circle using `rotateY()` and `translateZ()`. Spin the group, and it reads as a
cylinder. I generated the label art as an inline SVG so there's no image file to load.

Dragging (mouse) or swiping (touch) changes the rotation angle in real time. There's
also a slow idle spin when you're not touching it, just so it doesn't sit dead still.

**[Inference] This approach is lighter and loads faster than a WebGL/Three.js model, since it's just DOM elements and CSS transforms — but it also means the bottle isn't a true 3D object, just an illusion of one. That's a real tradeoff, not a hidden one.**

## Responsive behavior

Tested down to 320px width. The nav collapses into a toggle menu under 640px, the
three-column hero stacks into one column under 980px, and the bottle stage resizes
with viewport width rather than using fixed pixel values.

## Getting this into WordPress + Elementor

The assignment asks for a WordPress + Elementor build, not a static site, so here's
the direct path:

1. In Elementor, add an **HTML widget** (or a Custom Code section if you're on a
   version that has one) to the page.
2. Paste the contents of `index.html`'s `<body>` into that widget.
3. Add the CSS either through Elementor's **Custom CSS** panel on that section, or
   enqueue `style.css` properly through your theme's `functions.php` if you want it
   loaded site-wide.
4. Add `script.js` the same way — through a Custom Code / HTML widget with a
   `<script>` tag, or enqueued properly rather than inlined, if you want it to follow
   WordPress coding standards.
5. Swap out the nav links (`#shop`, `#about`, `#blog`, `#contact`) for your actual
   WordPress page URLs once those pages exist.

**[I do not have access to your specific WordPress setup, theme, or plugin list, so I can't give exact click-by-click steps beyond this. The general approach above holds for most Elementor sites, but plugin versions vary.]**

## What I'd still do before calling this done

- Swap the placeholder label art for the real Bolly brand assets, once you have them.
- Check the drag rotation on an actual phone, not just a resized browser window —
  touch behavior can differ slightly from what devtools simulates.
- Confirm the color values against real brand guidelines if the client has them —
  I estimated the purple and lime tones from the reference image.

Correction: I made an unverified claim earlier in a draft of this file about the
original file using "brand-standard" colors — that wasn't something I could confirm,
so I removed it and noted the colors are estimated instead.
