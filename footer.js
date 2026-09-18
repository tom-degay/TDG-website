/* Shared site footer, defined once here and appended to every page.

   Where it goes depends on the page's layout. The six case-study pages lay
   <main> out as a grid (content column + a 230px .toc column) with no other
   visible content beside the TOC, and the TOC itself is display:none below
   1100px -- so for those, and for the flat block-layout pages, appending
   inside main > .content (or main itself, when there is no .content) always
   puts the footer last, at every width.

   The three approach pages are the exception: their rail (.side-rail) also
   holds the "More" cross-links, which stay visible below 1100px (unlike the
   TOC). If the footer were appended inside .content there too, it would land
   *before* .side-rail in the DOM -- and since main is plain block layout
   below 1100px, "More" would render after the footer instead of before it.
   So on pages with a .side-rail, the footer is appended to main itself,
   after .side-rail, which fixes that stacking order at every width below
   1100px. At 1100px and up main is a two-column grid, and an unplaced grid
   item there auto-places into the second (230px rail) column rather than
   falling through to a new row in the first -- confirmed by testing it
   directly, not assumed -- so a matching rule in styles.css pins it back to
   the content column (see the .content/.side-rail media query there).

   Styling lives in styles.css (.site-footer*), including the fly-out arrow,
   which is the shared a[target="_blank"] effect extended to .site-footer-links
   so the internal Contact link gets one too.

   Trade-off: with JS disabled the footer does not render. Every link in it is
   reachable elsewhere -- Contact from the nav, LinkedIn and the CV from the
   about and contact pages. */
(function () {
  var main = document.querySelector('main');
  if (!main) return;
  if (document.querySelector('.site-footer')) return;   // never append twice

  var sideRail = main.querySelector(':scope > .side-rail');
  var host = sideRail ? main : (main.querySelector(':scope > .content') || main);

  var hr = document.createElement('hr');
  hr.className = 'rule';

  var footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML =
    '<p class="site-footer-copy">&copy; 2026 Tom de Gay</p>' +
    '<p class="site-footer-links">' +
      '<a href="/contact">Contact</a>' +
      '<a href="https://www.linkedin.com/in/tom-dg/" target="_blank" rel="noopener noreferrer">LinkedIn</a>' +
      '<a href="/TomdeGayCV.pdf" download="Tom de Gay - CV.pdf" target="_blank" rel="noopener noreferrer">Download CV</a>' +
    '</p>';

  host.appendChild(hr);
  host.appendChild(footer);
})();
