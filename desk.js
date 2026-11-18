(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var zTop = 20;

  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  /* ---------- sparkle burst ---------- */
  function burst(x, y, n) {
    if (reduce) return;
    var cols = ['#FF3D80', '#8A5BFF', '#FFB020', '#FF8AB8', '#35C98A'];
    for (var i = 0; i < (n || 14); i++) {
      var d = document.createElement('span');
      d.className = 'burst-dot';
      var a = Math.random() * Math.PI * 2, dist = 40 + Math.random() * 80;
      d.style.setProperty('--tx', Math.cos(a) * dist + 'px');
      d.style.setProperty('--ty', Math.sin(a) * dist + 'px');
      d.style.left = x + 'px'; d.style.top = y + 'px';
      var c = cols[i % cols.length];
      d.style.background = c; d.style.boxShadow = '0 0 6px ' + c;
      document.body.appendChild(d);
      (function (n) { setTimeout(function () { n.remove(); }, 800); })(d);
    }
  }

  /* ---------- generic drag helper ---------- */
  function makeDraggable(el, container, onTap) {
    var ox = 0, oy = 0, sx = 0, sy = 0, moved = 0, down = false, baseCx = 0, baseCy = 0, box = null;
    el.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      down = true; moved = 0;
      el.setPointerCapture(e.pointerId);
      sx = e.clientX - ox; sy = e.clientY - oy;
      var r = el.getBoundingClientRect();
      box = container.getBoundingClientRect();
      baseCx = r.left + r.width / 2 - ox; baseCy = r.top + r.height / 2 - oy;
      el.classList.add('dragging');
      el.style.zIndex = Math.min(++zTop, 40);
      e.preventDefault();
    });
    el.addEventListener('pointermove', function (e) {
      if (!down) return;
      var nx = e.clientX - sx, ny = e.clientY - sy;
      moved = Math.max(moved, Math.abs(nx - ox) + Math.abs(ny - oy));
      var cx = Math.min(Math.max(baseCx + nx, box.left + 10), box.right - 10);
      var cy = Math.min(Math.max(baseCy + ny, box.top + 10), box.bottom - 10);
      ox = cx - baseCx; oy = cy - baseCy;
      el.style.translate = ox + 'px ' + oy + 'px';
    });
    function up(e) {
      if (!down) return;
      down = false;
      el.classList.remove('dragging');
      if (moved < 6 && onTap) onTap(e);
    }
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', function () { down = false; el.classList.remove('dragging'); });
  }

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- BOOT INTRO ---------- */
    var boot = document.getElementById('boot');
    if (boot) {
      var laptop = document.getElementById('bootLaptop');
      var log = document.getElementById('bootLog');
      var charm = document.getElementById('bootCharm');
      var port = document.getElementById('bootPort');
      var hint = document.getElementById('bootHint');
      var done = false;

      function finish() {
        if (done) return;
        done = true;
        ssSet('booted', '1');
        document.body.classList.add('booted');
        document.body.classList.remove('has-boot');
        setTimeout(function () { if (boot) boot.remove(); }, 1000);
      }

      if (ssGet('booted') === '1') {
        document.body.classList.add('booted');
        document.body.classList.remove('has-boot');
        boot.remove();
      } else {
        document.getElementById('bootSkip').addEventListener('click', finish);
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter') finish(); });

        var lines = [
          'hanna.os  ✦  charm detected',
          '> loading creativity ........ ok',
          '> loading curiosity ......... ok',
          '> compiling ideas ............ ok',
          '> welcome ♥'
        ];
        function startBoot() {
          if (done) return;
          laptop.classList.add('on');
          hint.textContent = '';
          charm.style.visibility = 'hidden';
          log.textContent = '';
          var i = 0;
          (function next() {
            if (done) return;
            if (i >= lines.length) { setTimeout(finish, 700); return; }
            log.textContent += (i ? '\n' : '') + lines[i++];
            setTimeout(next, reduce ? 60 : 420);
          })();
          var r = port.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 2, 20);
        }

        var cox = 0, coy = 0, csx = 0, csy = 0, cdown = false;
        charm.addEventListener('pointerdown', function (e) {
          cdown = true; charm.setPointerCapture(e.pointerId);
          csx = e.clientX - cox; csy = e.clientY - coy;
          charm.classList.add('grab'); e.preventDefault();
        });
        charm.addEventListener('pointermove', function (e) {
          if (!cdown) return;
          cox = e.clientX - csx; coy = e.clientY - csy;
          charm.style.translate = cox + 'px ' + coy + 'px';
        });
        function release() {
          if (!cdown) return;
          cdown = false; charm.classList.remove('grab');
          var cr = charm.getBoundingClientRect(), pr = port.getBoundingClientRect();
          var dx = (cr.left + cr.width / 2) - (pr.left + pr.width / 2);
          var dy = (cr.top + cr.height / 2) - (pr.top + pr.height / 2);
          if (Math.sqrt(dx * dx + dy * dy) < 90) {
            cox -= dx; coy -= dy;
            charm.style.translate = cox + 'px ' + coy + 'px';
            charm.classList.add('in');
            startBoot();
          } else {
            cox = 0; coy = 0;
            charm.style.translate = '0px 0px';
          }
        }
        charm.addEventListener('pointerup', release);
        charm.addEventListener('pointercancel', release);
      }
    }

    /* ---------- DESK ---------- */
    var scene = document.getElementById('deskScene');
    if (scene) {
      var laptopMsgs = [
        '> hello, world ✦',
        '> git commit -m "add sparkle"',
        '> npm run make-it-pretty\n  ✓ done in 0.3s',
        '> sudo make me a coffee\n  ☕ permission granted',
        '> while(true){ create(); }',
        '> open to jobs & internships ♥'
      ];
      var li = 0;
      var actions = {
        lamp: function () { scene.classList.toggle('lamp-off'); },
        laptop: function (e) {
          li = (li + 1) % laptopMsgs.length;
          document.getElementById('laptopText').innerHTML = laptopMsgs[li].replace(/</g, '&lt;') + '<span class="caret"></span>';
          burst(e.clientX, e.clientY, 8);
        },
        mug: function (e) {
          burst(e.clientX, e.clientY, 16);
          scene.querySelectorAll('.steam').forEach(function (s) { s.style.opacity = ''; });
        },
        plant: function (e) {
          var p = scene.querySelector('.plant');
          p.classList.remove('wiggle'); void p.offsetWidth; p.classList.add('wiggle');
          burst(e.clientX, e.clientY, 10);
        }
      };
      scene.querySelectorAll('.drag').forEach(function (el) {
        var act = el.getAttribute('data-action');
        makeDraggable(el, scene, act ? function (e) { if (actions[act]) actions[act](e); } : null);
      });
      // typewriter line on the laptop screen
      var typeEl = document.getElementById('osTypeText');
      if (typeEl) {
        var phrases = ['building things that work and look good', 'currently: algorithms, languages and logic', 'last stop: INSA Lyon', 'open to jobs & internships', 'coffee: loaded'];
        var pi = 0, ci = 0, del = false;
        if (reduce) { typeEl.textContent = phrases[0]; }
        else (function tick() {
          var full = phrases[pi];
          if (!del) { ci++; typeEl.textContent = full.slice(0, ci); if (ci === full.length) { del = true; return setTimeout(tick, 1800); } }
          else { ci--; typeEl.textContent = full.slice(0, ci); if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; } }
          setTimeout(tick, del ? 28 : 60);
        })();
      }
      // watering can + growing plant
      var can = scene.querySelector('.can'), plant = scene.querySelector('.plant');
      if (can && plant) {
        var water = 0, MAX = 12, bloomed = false, timer = null;
        var hint = scene.querySelector('.desk-hint'), hintText = hint ? hint.textContent : '';
        function addWater(n) {
          if (bloomed) return;
          water += n || 1;
          var s = water >= MAX ? 3 : water >= MAX * 0.66 ? 2 : water >= MAX * 0.28 ? 1 : 0;
          plant.setAttribute('data-stage', s);
          if (water >= MAX) {
            bloomed = true; stopPour();
            var r = plant.getBoundingClientRect();
            burst(r.left + r.width / 2, r.top + r.height * 0.3, 40);
            if (hint) { hint.textContent = 'it bloomed ♥ thanks for stopping by'; setTimeout(function () { hint.textContent = hintText; }, 4500); }
          }
        }
        function drip(x, y) {
          if (reduce) return;
          var d = document.createElement('span');
          d.className = 'drop';
          d.style.left = (x + (Math.random() * 16 - 8)) + 'px'; d.style.top = y + 'px';
          document.body.appendChild(d);
          setTimeout(function () { d.remove(); }, 750);
        }
        function overPlant() {
          var cr = can.getBoundingClientRect(), pr = plant.getBoundingClientRect();
          var cx = cr.left + cr.width / 2, cy = cr.top + cr.height / 2, pad = Math.max(60, pr.width * 0.8);
          return cx > pr.left - pad && cx < pr.right + pad && cy > pr.top - pad && cy < pr.bottom + pad * 0.6;
        }
        function startPour() {
          if (timer || bloomed) return;
          can.classList.add('pour');
          timer = setInterval(function () {
            var cr = can.getBoundingClientRect();
            drip(cr.left + 6, cr.top + cr.height * 0.7);
            if (overPlant()) addWater(1);
          }, 330);
        }
        function stopPour() { can.classList.remove('pour'); clearInterval(timer); timer = null; }
        can.addEventListener('pointerdown', startPour);
        can.addEventListener('pointerup', stopPour);
        can.addEventListener('pointercancel', stopPour);
        // click/tap without dragging also waters (keyboard-free fallback)
        actions.can = function () {
          var pr = plant.getBoundingClientRect();
          drip(pr.left + pr.width / 2, pr.top - 30);
          addWater(2);
        };
        can.removeAttribute('data-x');
      }
      // steam is subtle until the mug is hovered
      var mug = scene.querySelector('.mug');
      if (mug) mug.addEventListener('pointerenter', function () { mug.classList.add('hot'); });
    }

    /* ---------- STICKER SHEET ---------- */
    var sheet = document.getElementById('stickerSheet');
    if (sheet) {
      sheet.querySelectorAll('.drag').forEach(function (el) {
        makeDraggable(el, sheet, function (e) { burst(e.clientX, e.clientY, 8); });
      });
    }

    /* ---------- ROUTE (scroll-drawn line) ---------- */
    var route = document.getElementById('route');
    if (route) {
      var items = Array.prototype.slice.call(route.querySelectorAll('.route-item'));
      function updateRoute() {
        var r = route.getBoundingClientRect();
        var vh = window.innerHeight;
        var p = (vh * 0.62 - r.top) / r.height;
        p = Math.max(0, Math.min(1, p));
        route.style.setProperty('--p', p.toFixed(4));
        items.forEach(function (it) {
          var ir = it.getBoundingClientRect();
          if (ir.top + 60 < vh * 0.62 + 60) it.classList.add('in');
        });
      }
      window.addEventListener('scroll', updateRoute, { passive: true });
      window.addEventListener('resize', updateRoute);
      updateRoute();
    }

  });
})();
