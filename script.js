document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ---------- Live local-time readout ---------- */
  var clocks = document.querySelectorAll('[data-clock]');
  if (clocks.length) {
    function tick() {
      var now = new Date();
      var hh = String(now.getHours()).padStart(2, '0');
      var mm = String(now.getMinutes()).padStart(2, '0');
      clocks.forEach(function (c) { c.textContent = hh + ':' + mm; });
    }
    tick();
    setInterval(tick, 15000);
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- v7: glitter backdrop ---------- */
  if (!reduceMotion) {
    var gcanvas = document.createElement('canvas');
    gcanvas.id = 'glitter-canvas';
    document.body.insertBefore(gcanvas, document.body.firstChild);
    var gctx = gcanvas.getContext('2d');
    var GW, GH, gparticles = [];
    var glitterColors = ['#FF3D80', '#FF8AB8', '#8A5BFF', '#FFB020', '#C9A27A'];

    function gresize() {
      GW = gcanvas.width = window.innerWidth;
      GH = gcanvas.height = document.documentElement.scrollHeight;
    }
    gresize();
    window.addEventListener('resize', gresize);
    window.addEventListener('load', gresize);

    var gcount = Math.min(110, Math.floor((window.innerWidth * window.innerHeight) / 11000));
    for (var gi = 0; gi < gcount; gi++) {
      gparticles.push({
        x: Math.random() * GW,
        y: Math.random() * GH,
        r: Math.random() * 1.3 + 0.3,
        c: glitterColors[Math.floor(Math.random() * glitterColors.length)],
        tw: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.12 + 0.02
      });
    }

    function gloop() {
      gctx.clearRect(0, 0, GW, GH);
      var scrollY = window.scrollY || window.pageYOffset;
      gparticles.forEach(function (p) {
        p.tw += 0.025;
        var alpha = (Math.sin(p.tw) + 1) / 2 * 0.55 + 0.1;
        var sy = p.y - scrollY;
        if (sy < -10 || sy > window.innerHeight + 10) return;
        gctx.globalAlpha = alpha;
        gctx.fillStyle = p.c;
        gctx.beginPath();
        gctx.arc(p.x, sy, p.r, 0, Math.PI * 2);
        gctx.fill();
      });
      gctx.globalAlpha = 1;
      requestAnimationFrame(gloop);
    }
    gresize();
    gcanvas.style.position = 'fixed';
    requestAnimationFrame(gloop);
  }

  /* ---------- v7: nav glitch data attributes ---------- */
  document.querySelectorAll('nav.main-nav a, .about-nav a').forEach(function (a) {
    a.setAttribute('data-text', a.textContent.trim());
  });

  /* ---------- v7: cursor sparkle trail ---------- */
  if (!isTouch && !reduceMotion) {
    var lastSpark = 0;
    document.addEventListener('mousemove', function (e) {
      var now = Date.now();
      if (now - lastSpark < 70) return;
      lastSpark = now;
      var s = document.createElement('div');
      s.className = 'spark-trail';
      var size = 2 + Math.random() * 4;
      var hue = Math.random() < 0.6 ? '#FF8AB8' : '#8A5BFF';
      s.style.left = e.clientX + 'px';
      s.style.top = e.clientY + 'px';
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.background = hue;
      s.style.boxShadow = '0 0 6px ' + hue;
      s.style.opacity = '0.85';
      s.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
      document.body.appendChild(s);
      requestAnimationFrame(function () {
        s.style.transform = 'translateY(' + (14 + Math.random() * 16) + 'px) scale(0.2)';
        s.style.opacity = '0';
      });
      setTimeout(function () { s.remove(); }, 650);
    });
  }

  /* ---------- Split big headings into hoverable letters ---------- */
  function splitLetters(heading) {
    if (!heading || heading.dataset.split) return;
    var frag = document.createDocumentFragment();
    heading.childNodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span');
          w.style.whiteSpace = 'nowrap'; w.style.display = 'inline-block';
          part.split('').forEach(function (ch) {
            var span = document.createElement('span');
            span.className = 'letter';
            span.textContent = ch;
            w.appendChild(span);
          });
          frag.appendChild(w);
        });
      } else {
        frag.appendChild(node.cloneNode(true));
      }
    });
    heading.innerHTML = '';
    heading.appendChild(frag);
    heading.dataset.split = 'true';
  }
  document.querySelectorAll('.hero h1, .about-intro h1, .section-head h2').forEach(splitLetters);

  /* ---------- Custom cursor ---------- */
  if (!isTouch && !reduceMotion) {
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();

    var hoverables = 'a, button, .reel-card, .shot-frame, .project-card, .skill-card, .chip, input, textarea';
    document.querySelectorAll(hoverables).forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
    });
    document.addEventListener('mouseleave', function () { document.body.classList.add('cursor-active'); });
    document.addEventListener('mouseenter', function () { document.body.classList.remove('cursor-active'); });
  }

  /* ---------- About page: active section tab ---------- */
  var aboutNav = document.querySelector('.about-nav');
  if (aboutNav) {
    var navLinks = Array.prototype.slice.call(aboutNav.querySelectorAll('a'));
    var anchors = Array.prototype.slice.call(document.querySelectorAll('.section-anchor'));
    if ('IntersectionObserver' in window && anchors.length) {
      var navIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.closest('section').id;
            navLinks.forEach(function (a) {
              a.classList.toggle('active', a.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { rootMargin: '-140px 0px -70% 0px', threshold: 0 });
      anchors.forEach(function (el) { navIo.observe(el); });
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.card, .reel-card, .project-card, .ledger-row, .skill-card, .shot-frame, .two-col, .case-banner');
  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 6) * 0.05 + 's';
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll('.btn, .project-link, .logo').forEach(function (el) {
      el.classList.add('magnetic');
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var relX = e.clientX - r.left - r.width / 2;
        var relY = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + (relX * 0.18) + 'px,' + (relY * 0.3) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Reel: drag-to-scroll + 3D tilt ---------- */
  var reel = document.querySelector('.reel');
  if (reel) {
    reel.scrollLeft = 0;
    window.addEventListener('load', function () { reel.scrollLeft = 0; });
    var isDown = false, startX, scrollLeft;
    reel.addEventListener('mousedown', function (e) {
      isDown = true;
      reel.classList.add('dragging');
      startX = e.pageX - reel.offsetLeft;
      scrollLeft = reel.scrollLeft;
    });
    ['mouseleave', 'mouseup'].forEach(function (evt) {
      reel.addEventListener(evt, function () { isDown = false; reel.classList.remove('dragging'); });
    });
    reel.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - reel.offsetLeft;
      reel.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });

    if (!isTouch && !reduceMotion) {
      reel.querySelectorAll('.reel-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--rx', (px * 10).toFixed(2) + 'deg');
          card.style.setProperty('--ry', (-py * 10).toFixed(2) + 'deg');
        });
        card.addEventListener('mouseleave', function () {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
        });
      });
    }
  }

  /* ---------- Lightbox for project screenshots ---------- */
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot, .case-banner img'));
  if (shots.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lightbox-close" aria-label="Close">×</button>' +
      '<button class="lightbox-prev" aria-label="Previous">←</button>' +
      '<div class="lightbox-inner">' +
        '<img src="" alt="">' +
        '<div class="lightbox-caption"><span class="cap-text"></span><span class="count"></span></div>' +
      '</div>' +
      '<button class="lightbox-next" aria-label="Next">→</button>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.cap-text');
    var lbCount = lb.querySelector('.count');
    var current = 0;

    function openLb(i) {
      current = i;
      var el = shots[i];
      var src = el.dataset.full || el.getAttribute('src');
      var cap = el.dataset.caption || el.getAttribute('alt') || '';
      lbImg.src = src;
      lbImg.alt = cap;
      lbCap.textContent = cap;
      lbCount.textContent = (i + 1) + ' / ' + shots.length;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
    function step(dir) {
      current = (current + dir + shots.length) % shots.length;
      openLb(current);
    }

    shots.forEach(function (el, i) {
      el.addEventListener('click', function () { openLb(i); });
    });
    lb.querySelector('.lightbox-close').addEventListener('click', closeLb);
    lb.querySelector('.lightbox-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lightbox-next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---------- Click burst (a little "oj!" moment on primary buttons) ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('.btn, .project-card, .reel-card, .chip, .skill-card, .shot-frame').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var colors = ['#FF3D80', '#FF8AB8', '#8A5BFF', '#FFB020', '#35C98A'];
        for (var i = 0; i < 12; i++) {
          var d = document.createElement('span');
          d.className = 'burst-dot';
          var angle = Math.random() * Math.PI * 2;
          var dist = 40 + Math.random() * 70;
          var col = colors[i % colors.length];
          d.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
          d.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
          d.style.left = e.clientX + 'px';
          d.style.top = e.clientY + 'px';
          d.style.background = col;
          d.style.boxShadow = '0 0 6px ' + col;
          document.body.appendChild(d);
          (function (node) { setTimeout(function () { node.remove(); }, 750); })(d);
        }
      });
    });
  }
});
