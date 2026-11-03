// nav behaviour: ui/ux. Marks the current page in the nav.
(function () {
  var here = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  document.querySelectorAll('.site-header nav a').forEach(function (a) {
    var p = a.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    if (p === here) a.setAttribute('aria-current', 'page');
  });
})();
