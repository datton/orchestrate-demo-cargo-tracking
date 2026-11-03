// Simulated dashboard: every value is generated here, nothing is real
(function () {
  var body = document.querySelector('#cargo-table tbody');
  if (!body) return;
  var announce = document.getElementById('announce');
  var summary = document.getElementById('summary');
  var stamp = document.getElementById('last-update');
  var toggle = document.getElementById('auto-toggle');
  var timer = null;

  var ships = [
    { id: 'DEMO-0001', from: 'Origin port A', to: 'Destination port X', reefer: false },
    { id: 'DEMO-0002', from: 'Origin port B', to: 'Destination port X', reefer: true },
    { id: 'DEMO-0003', from: 'Origin port A', to: 'Destination port Y', reefer: false },
    { id: 'DEMO-0004', from: 'Origin port C', to: 'Destination port Y', reefer: true },
    { id: 'DEMO-0005', from: 'Origin port B', to: 'Destination port Z', reefer: false },
    { id: 'DEMO-0006', from: 'Origin port C', to: 'Destination port Z', reefer: false }
  ];
  // starting simulated progress (percent) and speed per tick
  ships.forEach(function (s, i) {
    s.progress = 10 + i * 15;
    s.speed = 1 + (i % 3) * 0.7;
    s.delayed = i === 2;
    s.temp = 4;
  });

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function stampNow() {
    var d = new Date();
    return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function status(s) {
    if (s.progress >= 100) return { text: 'Arrived', sym: '✓' };
    if (s.delayed) return { text: 'Delayed', sym: '⚠' };
    if (s.progress >= 90) return { text: 'Arriving', sym: '→' };
    if (s.progress < 5) return { text: 'Loading', sym: '↑' };
    return { text: 'At sea', sym: '≈' };
  }

  function step() {
    ships.forEach(function (s) {
      if (s.progress < 100) {
        s.progress = Math.min(100, s.progress + s.speed * (s.delayed ? 0.3 : 1) * (0.5 + Math.random()));
        if (Math.random() < 0.05) s.delayed = !s.delayed;
      } else if (Math.random() < 0.3) {
        s.progress = 0; s.delayed = false; // simulated next voyage
      }
      if (s.reefer) s.temp = Math.round((4 + (Math.random() - 0.5) * 2) * 10) / 10;
    });
  }

  function cell(tr, label, node) {
    var td = document.createElement('td');
    td.setAttribute('data-label', label);
    td.appendChild(typeof node === 'string' ? document.createTextNode(node) : node);
    tr.appendChild(td);
  }

  function render() {
    body.textContent = '';
    var counts = {};
    ships.forEach(function (s) {
      var st = status(s), p = Math.round(s.progress);
      counts[st.text] = (counts[st.text] || 0) + 1;
      var tr = document.createElement('tr');
      cell(tr, 'Container ID', s.id + ' (simulated)');
      cell(tr, 'Route', s.from + ' to ' + s.to);
      cell(tr, 'Status', st.sym + ' ' + st.text);
      var prog = document.createElement('span');
      var bar = document.createElement('span');
      bar.className = 'bar'; bar.setAttribute('aria-hidden', 'true');
      var fill = document.createElement('span');
      fill.style.width = p + '%';
      bar.appendChild(fill);
      prog.appendChild(bar);
      prog.appendChild(document.createTextNode(p + '%'));
      cell(tr, 'Progress', prog);
      var left = Math.max(0, Math.round((100 - s.progress) / (s.speed * (s.delayed ? 0.3 : 1)) / 4));
      cell(tr, 'ETA', st.text === 'Arrived' ? 'Arrived' : 'in about ' + left + ' simulated days');
      cell(tr, 'Temperature', s.reefer ? s.temp.toFixed(1).replace('.', ',') + ' °C (simulated)' : 'Not applicable');
      body.appendChild(tr);
    });
    stamp.textContent = stampNow();
    var parts = Object.keys(counts).map(function (k) { return counts[k] + ' ' + k.toLowerCase(); });
    summary.textContent = 'Simulated summary: ' + parts.join(', ') + '.';
    return summary.textContent;
  }

  function tick() { step(); render(); }

  document.getElementById('refresh').addEventListener('click', function () {
    step();
    announce.textContent = '';
    announce.textContent = render();
  });
  toggle.addEventListener('click', function () {
    var on = toggle.getAttribute('aria-pressed') === 'true';
    toggle.setAttribute('aria-pressed', on ? 'false' : 'true');
    toggle.textContent = on ? 'Resume automatic updates' : 'Pause automatic updates';
    if (on) { clearInterval(timer); timer = null; } else { timer = setInterval(tick, 8000); }
  });

  render();
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    toggle.setAttribute('aria-pressed', 'false');
    toggle.textContent = 'Resume automatic updates';
  } else {
    timer = setInterval(tick, 8000);
  }
})();
