/* Shared site footer, defined once here and appended to every page.

   Where it goes depends on the page's layout, which is why this is not just
   an appendChild to <main>: the ten pages with a TOC or side rail lay <main>
   out as a grid (842px 230px), so appending there auto-places the footer into
   the narrow rail column. Those pages keep their content in main > .content,
   which is where it belongs. The block-layout pages have no such wrapper, so
   it goes at the end of <main>. Either way it ends up the same width as that
   page's other hr.rule elements.

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

  var host = main.querySelector(':scope > .content') || main;

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
