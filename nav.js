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
  var mobile = window.matchMedia('(max-width: 640px)');

  function closeAll(except) {
    Array.prototype.forEach.call(items, function (it) {
      if (it !== except) {
        it.classList.remove('is-open');
        syncAria(it, false);
      }
    });
  }

  /* On desktop this control never navigates -- it opens a popover -- so say so
     rather than letting it announce as a plain link. Below 640px the dropdown
     is expanded inline and the link does navigate, so the attributes come off. */
  function syncAria(item, open) {
    var link = item.firstElementChild;
    if (!link) return;
    if (mobile.matches) {
      link.removeAttribute('aria-haspopup');
      link.removeAttribute('aria-expanded');
    } else {
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  }

  /* Escape has to do more than drop .is-open: the panel is also revealed by
     :hover and :focus-within, which CSS keeps matching, so the key would look
     broken while the pointer rests on the item or focus sits inside it. Move
     focus out and mark the item dismissed until the pointer or focus leaves. */
  function dismissAll() {
    var active = document.activeElement;
    Array.prototype.forEach.call(items, function (it) {
      it.classList.remove('is-open');
      it.classList.add('is-dismissed');
      syncAria(it, false);
      if (active && it.contains(active) && active.blur) active.blur();
    });
  }

  Array.prototype.forEach.call(items, function (item) {
    syncAria(item, false);
    var link = item.firstElementChild;
    if (!link || link.tagName !== 'A') return;
    link.addEventListener('click', function (e) {
      // On mobile the dropdown is shown expanded inline; let the link navigate.
      if (mobile.matches) return;
      e.preventDefault();
      var wasOpen = item.classList.contains('is-open');
      closeAll(item);
      item.classList.remove('is-dismissed');
      item.classList.toggle('is-open', !wasOpen);
      syncAria(item, !wasOpen);
    });
    // re-entering the item should work normally again
    item.addEventListener('mouseleave', function () { item.classList.remove('is-dismissed'); });
    item.addEventListener('focusin', function () { item.classList.remove('is-dismissed'); });
  });

  if (mobile.addEventListener) {
    mobile.addEventListener('change', function () {
      Array.prototype.forEach.call(items, function (it) {
        syncAria(it, it.classList.contains('is-open'));
      });
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) closeAll(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') dismissAll();
  });
})();
