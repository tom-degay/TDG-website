/* Shared site-nav behaviour for tomdegay.com, loaded by every page.

   Two independent pieces:
     - the mobile hamburger, which toggles .site-nav.is-open below 640px
     - the two desktop popovers (Approach, Case Studies), which open on click
       and close when you click away or press Escape

   Both were previously copy-pasted, byte for byte, into all thirteen pages. */
(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;
  var toggle = nav.querySelector('.nav-toggle');
  var links = nav.querySelector('.site-nav-links');
  if (!toggle || !links) return;
  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-open'));
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 640) setOpen(false);
  });
})();

(function () {
  var items = document.querySelectorAll('.site-nav .nav-item');
  if (!items.length) return;
  function closeAll(except) {
    Array.prototype.forEach.call(items, function (it) {
      if (it !== except) it.classList.remove('is-open');
    });
  }
  Array.prototype.forEach.call(items, function (item) {
    var link = item.firstElementChild;
    if (!link || link.tagName !== 'A') return;
    link.addEventListener('click', function (e) {
      // On mobile the dropdown is shown expanded inline; let the link navigate.
      if (window.matchMedia('(max-width: 640px)').matches) return;
      e.preventDefault();
      var wasOpen = item.classList.contains('is-open');
      closeAll(item);
      item.classList.toggle('is-open', !wasOpen);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) closeAll(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
})();
