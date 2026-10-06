




import { renderMap } from "./renderMap";

import { renderEarth } from "./renderEarth";

export function initJourney(root, onComplete) {
  let active = true;

  const timers = new Set(),
    frames = new Set(),
    controller = new AbortController();

  root.querySelectorId = (id) => root.querySelector("#" + id);

  const disposeEarth = renderEarth(root.querySelectorId("ea"));

  const mapFlight = renderMap(root.querySelectorId("intro"));

  const oldOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  const setTimeout = (fn, ms) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
    return id;
  };

  const requestAnimationFrame = (fn) => {
    const id = window.requestAnimationFrame((t) => {
      frames.delete(id);
      fn(t);
    });
    frames.add(id);
    return id;
  };

  const cancelAnimationFrame = (id) => {
    window.cancelAnimationFrame(id);
    frames.delete(id);
  };

  const addEventListener = (type, fn) =>
    window.addEventListener(type, fn, { signal: controller.signal });

  root.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Tab") {
        const items = [...root.querySelectorAll("button")].filter(
            (e) =>
              e.getClientRects().length && getComputedStyle(e).opacity !== "0",
          ),
          first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    { signal: controller.signal },
  );

  /* ---- cinematic intro ---- */

  (function () {
    var AV =
      '<svg class="avs" viewBox="0 0 120 134" aria-hidden="true"><path d="M8 134C8 104 34 94 60 94s52 10 52 40z" fill="#2f6fe0"/><path d="M47 94l13 15 13-15z" fill="#dbe7ff"/><rect x="51" y="78" width="18" height="20" rx="7" fill="var(--skin)"/><circle cx="33" cy="60" r="5" fill="var(--skin)"/><circle cx="87" cy="60" r="5" fill="var(--skin)"/><ellipse cx="60" cy="57" rx="27" ry="30" fill="var(--skin)"/><path d="M32 56C30 28 48 19 62 20c18 1 29 15 26 36-5-10-13-17-28-17s-23 6-28 17z" fill="#1d1a1a"/><circle class="eye" cx="49" cy="61" r="3.2" fill="#1d1a1a"/><circle class="eye" cx="71" cy="61" r="3.2" fill="#1d1a1a"/><path d="M43 53q6-4 12-1M65 52q6-3 12 1" stroke="#1d1a1a" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M50 73q10 9 20 0" stroke="#6b3a2a" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle class="hm" cx="60" cy="58" r="42" fill="#9fdcff" fill-opacity=".1" stroke="#bfe8ff" stroke-opacity=".6" stroke-width="2.5"/></svg>';

    root.querySelectorId("avh").innerHTML = AV;

    const coach = document.createElement("div");
    coach.className = "journey-coach";
    coach.setAttribute("aria-hidden", "true");
    coach.innerHTML = `<svg viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="160" cy="112" rx="143" ry="8" fill="#000" opacity=".3"/>
      <g class="coach-body">
        <path d="M18 26Q18 14 32 14H264Q282 14 288 30L303 70V99H18Z" fill="#0962b9"/>
        <path d="M18 73H303V96H18Z" fill="#f4ce37"/>
        <path d="M28 24H246V65H28Z" fill="#142c45"/>
        <path d="M255 24H269Q275 24 278 34L289 65H255Z" fill="#18374f"/>
        <path d="M33 29H240V35H33Z" fill="#9ddfff" opacity=".45"/>
        <path d="M70 24V65M112 24V65M154 24V65M196 24V65M249 22V96" stroke="#0d66ba" stroke-width="5"/>
        <path d="M18 96H303V103H18Z" fill="#102845"/>
        <rect x="291" y="77" width="11" height="9" rx="2" fill="#fff7bf"/>
        <rect x="18" y="78" width="5" height="10" fill="#f76b67"/>
        <text x="117" y="88" fill="#12385e" font-size="12" font-weight="700" font-family="Arial,sans-serif">IRELAND EXPRESS</text>
        <rect x="259" y="40" width="24" height="12" rx="2" fill="#081c29"/>
        <text x="271" y="49" text-anchor="middle" fill="#ffe164" font-size="7" font-family="Arial,sans-serif">DUBLIN</text>
      </g>
      <g class="coach-wheel" style="--wheel-x:70px"><circle cx="70" cy="102" r="17" fill="#111b27"/><circle cx="70" cy="102" r="10" fill="#b8c9d8"/><path d="M70 94V110M62 102H78" stroke="#526b82" stroke-width="3"/></g>
      <g class="coach-wheel" style="--wheel-x:259px"><circle cx="259" cy="102" r="17" fill="#111b27"/><circle cx="259" cy="102" r="10" fill="#b8c9d8"/><path d="M259 94V110M251 102H267" stroke="#526b82" stroke-width="3"/></g>
    </svg><div class="coach-road"></div>`;
    root.querySelectorId("av").appendChild(coach);


    var I = root.querySelectorId("intro"),
      gi = root.querySelectorId("gi"),
      ea = root.querySelectorId("ea"),
      map = root.querySelectorId("map"),
      mw = root.querySelectorId("mw"),
      dub = root.querySelectorId("dub"),
      cap = root.querySelectorId("cap"),
      bub = root.querySelectorId("bub"),
      trail = root.querySelectorId("trail"),
      go = root.querySelectorId("go");

    var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches,
      gen = 0,
      warp = 0,
      vw = 0,
      raf = 0,
      on = false;

    /* map data (lon,lat) */

    function pr(t) {
      return t
        .trim()
        .split(" ")
        .map(function (q) {
          var c = q.split(",");
          return [(+c[0] + 12) * 8.96, (72 - c[1]) * 14];
        });
    }

    function pth(t) {
      return (
        "M" +
        pr(t)
          .map(function (c) {
            return c[0].toFixed(2) + " " + c[1].toFixed(2);
          })
          .join("L") +
        "Z"
      );
    }

    var EU =
      "-9,37 -8.8,38.4 -9.5,38.7 -8.9,40.2 -8.7,41.2 -8.8,42.1 -9.3,42.9 -8.2,43.7 -5.7,43.6 -3.8,43.5 -1.8,43.4 -1.2,44.6 -1.2,46.1 -2.3,47.2 -4.5,47.8 -4.7,48.4 -3.2,48.8 -1.6,48.7 -1.4,49.6 0.2,49.4 1.6,50.2 1.8,51 3.3,51.4 4.2,52.2 4.8,53 6.5,53.4 8.5,53.7 8.6,54.9 8.1,56 8.2,57 10.5,57.7 10.6,56.5 9.9,55.5 10.9,54.5 12.5,54.4 14,54 16.5,54.6 18.7,54.7 19.8,54.4 21.2,55.3 21,56.8 22.5,57.7 24.2,57.2 24.4,58.4 23.5,59.2 26,59.6 28,59.6 34,59.8 34,46 32,45.7 30.2,46.2 29.7,45.1 28.7,43.8 28,42 29,41.2 27,40.9 26.2,40.2 24,40.6 23,40.2 23.6,38.2 22.9,36.5 21.8,36.9 21.2,38.3 20.2,39.7 19.5,41.6 18.5,42.5 16.4,43.5 14.6,45 13.7,45.6 12.4,45.3 12.4,44.3 13.6,43.5 14.2,42.4 16,41.9 18.4,40.2 17,39.9 16.6,39 16,37.9 15.7,38.2 16,40 14.8,40.6 13,41.3 11.1,42.4 10.2,43.7 8.6,44.4 7.4,43.8 5.4,43.3 3.3,43.1 3.2,42.1 0.8,41 0.3,40.1 -0.3,39.3 -0.1,38.3 -0.9,37.6 -2.2,36.7 -4.4,36.7 -5.4,36.1 -6.3,36.6 -7.4,37.2";

    var SC =
      "5.5,58.9 5,60.5 5.5,62 8,63.3 11,64.8 13,66.5 16,68.5 19,69.8 23,70.6 27,71 30,70.5 34,70 34,60.5 30,60.5 28,60.4 26,60.2 24,60 22.5,60 21.3,61.5 21.5,63 23,64.4 25,65.3 24.2,65.8 22,65.6 21,64.2 19,62.4 17.3,61 17.2,59.5 18.8,59.8 16.9,58 16.4,56.5 14.3,56.1 12.8,55.5 12.8,56.7 11.8,58.4 10.5,59.2 8.5,58.2";

    var GB =
      "-5.7,50.1 -3.5,50.3 -1.9,50.7 0.3,50.75 1.4,51.15 0.9,51.5 0.7,51.7 1.7,52.5 0.35,52.9 0.3,53.3 0.1,53.6 -0.5,54.2 -1.5,55 -1.7,55.7 -2.5,56 -3.4,56.2 -2.5,56.5 -1.8,57.5 -3.5,57.7 -4,57.6 -3.7,58.6 -3,58.65 -5,58.6 -5.5,58 -5.5,57.3 -5.7,56.7 -5.5,55.9 -4.9,55.8 -4.8,55.4 -5.1,54.8 -3.5,54.9 -3.2,54.3 -3,54 -3.1,53.4 -4.3,53.3 -4.6,52.8 -4.1,52.3 -5.2,51.9 -4.3,51.6 -3,51.5 -3.2,51.3 -4.2,51.2 -5.1,50.5";

    var IE =
      "-7.4,55.38 -6.65,55.2 -6.15,55.2 -5.8,54.85 -5.8,54.65 -5.5,54.6 -5.5,54.4 -5.65,54.2 -6.2,54.0 -6.25,53.7 -6.1,53.5 -6.05,53.39 -6.16,53.368 -6.185,53.352 -6.17,53.335 -6.165,53.318 -6.13,53.295 -6.1,53.27 -6.08,53.2 -6.03,53.1 -6.0,52.97 -6.2,52.6 -6.35,52.2 -6.9,52.12 -7.6,52.07 -8.3,51.8 -8.5,51.6 -9.5,51.4 -9.82,51.45 -10.35,51.8 -10.45,52.12 -9.9,52.4 -9.45,52.58 -9.9,52.56 -9.27,53.15 -9.05,53.2 -9.9,53.4 -10.25,53.4 -9.9,53.62 -10.1,53.95 -9.9,54.2 -10,54.3 -9.2,54.3 -8.45,54.45 -8.7,54.7 -8.4,54.95 -8.3,55.15 -7.6,55.27";

    root.querySelectorId("eu").setAttribute("d", pth(EU));
    root.querySelectorId("sc").setAttribute("d", pth(SC));
    root.querySelectorId("gb").setAttribute("d", pth(GB));
    root.querySelectorId("ie").setAttribute("d", pth(IE));

    var LF = pr(
      "-6.33,53.355 -6.29,53.349 -6.26,53.3475 -6.23,53.346 -6.2,53.347",
    );
    root.querySelectorId("lf").setAttribute(
      "d",
      "M" +
        LF.map(function (c) {
          return c[0].toFixed(3) + " " + c[1].toFixed(3);
        }).join("L"),
    );

    var UC = pr("-6.2236,53.3067")[0],
      DC = pr("-6.26,53.3495")[0];

    ["r1", "pc"].forEach(function (id) {
      var e = root.querySelectorId(id);
      e.setAttribute("cx", UC[0]);
      e.setAttribute("cy", UC[1]);
    });

    var t1 = root.querySelectorId("tdub");
    t1.setAttribute("x", DC[0]);
    t1.setAttribute("y", DC[1] - 0.1);

    var t2 = root.querySelectorId("tuc");
    t2.setAttribute("x", UC[0] + 0.12);
    t2.setAttribute("y", UC[1] + 0.03);
    t2.removeAttribute("text-anchor");

    function foc(lon, lat, sc, ms) {
      var x = (lon + 12) * 8.96,
        y = (72 - lat) * 14;
      mw.style.transitionDuration = ms + "ms";
      mw.style.transform =
        "translate(" +
        (206 - sc * x) +
        "px," +
        (259 - sc * y) +
        "px) scale(" +
        sc +
        ")";
    }

    /* galaxy */

    (function () {
      var c = root.querySelectorId("gx").getContext("2d");
      c.translate(350, 350);

      var g = c.createRadialGradient(0, 0, 0, 0, 0, 150);
      g.addColorStop(0, "rgba(255,240,200,.95)");
      g.addColorStop(0.25, "rgba(255,190,110,.4)");
      g.addColorStop(1, "rgba(255,170,90,0)");
      c.fillStyle = g;
      c.fillRect(-350, -350, 700, 700);

      for (var i = 0; i < 9000; i++) {
        var arm = i % 4,
          t = Math.pow(Math.random(), 0.75),
          a = (arm * Math.PI) / 2 + t * 5.4 + (Math.random() - 0.5) * 0.55,
          r = t * 320 + (Math.random() - 0.5) * 30 * t;

        c.fillStyle =
          "hsla(" +
          (205 + t * 70) +
          ",90%," +
          (62 + (1 - t) * 25) +
          "%," +
          (0.15 + Math.random() * 0.55) +
          ")";
        c.fillRect(Math.cos(a) * r, Math.sin(a) * r * 0.78, 1.6, 1.6);
      }
    })();

    /* starfield */

    var cv = root.querySelectorId("sky"),
      cx = cv.getContext("2d"),
      W,
      H,
      st = [];

    function size() {
      W = cv.width = innerWidth;
      H = cv.height = innerHeight;
    }
    size();
    addEventListener("resize", size);

    for (var i = 0; i < 280; i++)
      st.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random(),
      });

    function tick() {
      if (!on) return;
      vw += (warp - vw) * 0.04;
      cx.clearRect(0, 0, W, H);

      st.forEach(function (s) {
        var d = 0.0012 + vw * 0.013;
        var oz = s.z;
        s.z -= d;
        if (s.z < 0.03) {
          s.x = Math.random() * 2 - 1;
          s.y = Math.random() * 2 - 1;
          s.z = 1;
          oz = 1;
        }

        var k = W * 0.11,
          px = W / 2 + (s.x / s.z) * k,
          py = H / 2 + (s.y / s.z) * k,
          ox = W / 2 + (s.x / (s.z + d * (1 + vw * 3))) * k,
          oy = H / 2 + (s.y / (s.z + d * (1 + vw * 3))) * k;

        cx.strokeStyle = "rgba(200,225,255," + (1 - s.z) * 0.9 + ")";
        cx.lineWidth = Math.max(0.6, (1 - s.z) * 2);
        cx.beginPath();
        cx.moveTo(ox, oy);
        cx.lineTo(px, py + 0.01);
        cx.stroke();
      });

      raf = requestAnimationFrame(tick);
    }

    /* helpers */

    function sl(ms, my) {
      return new Promise(function (r) {
        setTimeout(function () {
          r(my === gen);
        }, ms);
      });
    }

    function say(t) {
      bub.textContent = t;
      bub.classList.remove("pop");
      void bub.offsetWidth;
      bub.classList.add("pop");
    }

    function cp(t) {
      cap.textContent = t;
      cap.classList.remove("pop");
      void cap.offsetWidth;
      cap.classList.add("pop");
    }

    function cr(n) {
      trail.querySelectorAll("span").forEach(function (e, i) {
        e.classList.toggle("on", i <= n);
      });
    }

    function hero_in() {}

    function finish() {
      gen++;
      warp = 0;
      I.classList.add("end");
      document.body.classList.remove("lock");
      hero_in();
      setTimeout(function () {
        if (I.classList.contains("end")) {
          I.style.display = "none";
          on = false;
          cancelAnimationFrame(raf);
          onComplete();
        }
      }, 1000);
    }

    function reset() {
      gen++;
      I.style.display = "";
      I.className = "";
      gi.className = "gi";
      ea.className = "ea";
      map.className = "";
      dub.classList.remove("on");
      mw.style.transitionDuration = "0ms";
      mw.style.transform = "";
      go.hidden = false;
      cp("");
      cr(-1);
      say("Hey, I'm Roopesh! 👋 Come on, let's see about me.");
      document.body.classList.add("lock");
      scrollTo(0, 0);
      warp = 0;
      if (!on) {
        on = true;
        tick();
      }
      go.focus();
    }

    async function journey() {
      go.disabled = true;
      var my = ++gen;
      I.classList.add("fly");

      say("Buckle up! First stop, the galaxy 🌌");
      cr(0);
      cp("The Milky Way");
      warp = 5;
      gi.classList.add("on");
      if (!(await sl(4200, my))) return;

      say("…past the stars, to our little blue planet.");
      cr(1);
      cp("Planet Earth");
      warp = 1.2;
      gi.classList.add("out");
      ea.classList.add("on");
      if (!(await sl(3300, my))) return;

      const mapReady = await mapFlight.ready;
      if (!active || my !== gen) return;

      say("Europe. This is where I build applied AI.");
      cr(2);
      cp("Europe");
      warp = 0;
      ea.classList.add("zoom");

      if (mapReady) {
        mapFlight.show();
      } else {
        map.classList.add("on");
      }

      if (!(await sl(1000, my))) return;

      say("Ireland. I lead AI delivery here for startups and public bodies.");
      cr(3);
      cp("Ireland");

      if (mapReady) {
        mapFlight.fly("ireland");
      } else {
        foc(-8, 53.4, 7, 1600);
      }

      if (!(await sl(1800, my))) return;

      say("Dublin. Watch the city rise into view.");
      cr(4);
      cp("Dublin");

      if (mapReady) {
        mapFlight.fly("dublin");
      } else {
        foc(-6.24, 53.33, 130, 2200);
      }

      if (!(await sl(2400, my))) return;

      if (mapReady) {
        say("Flying to Nexus UCD in Belfield Office Park.");
        cp("Nexus UCD");
        mapFlight.fly("nexus");

        if (!(await sl(1800, my))) return;

        mapFlight.arrive();
        say("Welcome to my portfolio!");
      } else {
        dub.classList.add("on");
        say("Welcome to my portfolio!");
      }

      if (!(await sl(1800, my))) return;
      finish();
    }

    go.addEventListener("click", journey);

    root.querySelectorId("skip").addEventListener("click", finish);

    addEventListener("keydown", function (e) {
      if (
        e.key === "Escape" &&
        I.style.display !== "none" &&
        !I.classList.contains("end")
      )
        finish();
    });

    mw.style.transform = "";

    if (reduce) {
      I.style.display = "none";
      document.body.classList.remove("lock");
      onComplete();
    } else {
      document.body.classList.add("lock");
      on = true;
      tick();
      say("Hey, I'm Roopesh! 👋 Come on, let's see about me.");
      cr(-1);
      setTimeout(function () {
        go.focus();
      }, 300);
    }
  })();

  return () => {
    active = false;
    mapFlight.destroy();
    disposeEarth();
    controller.abort();
    timers.forEach(window.clearTimeout);
    frames.forEach(window.cancelAnimationFrame);
    document.body.style.overflow = oldOverflow;
    document.body.classList.remove("lock");
    delete root.querySelectorId;
  };
}
