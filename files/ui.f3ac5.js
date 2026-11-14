// Field notebook: sections panel, contents rail from h2, reading meter, facts ledger rows, countdown. All progressive.
(function () {
  var d = document, root = d.documentElement;
  root.setAttribute("data-js", "");
  function q(s, c) { return (c || d).querySelector(s); }
  function qa(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

  // Sections panel
  var btn = q("[data-panel-btn]"), panel = q("[data-panel]"), sr = q("[data-lbl-sr]");
  if (btn && panel) {
    var lblOpen = sr ? sr.textContent : "", lblClose = "";
    btn.hidden = false;
    function set(open) {
      btn.setAttribute("aria-expanded", String(open));
      if (open) panel.setAttribute("data-open", ""); else panel.removeAttribute("data-open");
      if (sr) sr.textContent = open ? (lblClose || lblOpen) : lblOpen;
    }
    lblClose = btn.getAttribute("data-close") || "";
    btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); if (btn.getAttribute("aria-expanded") === "true") { var a = q("a", panel); if (a) a.focus(); } });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.hasAttribute("data-open")) { set(false); btn.focus(); } });
    d.addEventListener("click", function (e) { if (panel.hasAttribute("data-open") && !panel.contains(e.target) && !btn.contains(e.target)) set(false); });
  }

  var prose = q("[data-prose]");
  if (prose) {
    // Key facts ledger: title + label/value rows
    var ft = prose.getAttribute("data-facts-title");
    qa(".py-facts", prose).forEach(function (box) {
      if (ft && !box.querySelector("h2,h3,p")) { var t = d.createElement("p"); t.className = "py-facts__t"; t.textContent = ft; box.insertBefore(t, box.firstChild); }
      qa("li", box).forEach(function (li) {
        var s = li.firstElementChild;
        if (!s || s.tagName !== "STRONG" || li.firstChild !== s) return;
        var v = d.createElement("span");
        while (s.nextSibling) v.appendChild(s.nextSibling);
        s.textContent = s.textContent.replace(/[:\s]+$/, "");
        li.appendChild(v); li.setAttribute("data-row", "");
      });
    });

    // Contents rail
    var toc = q("[data-toc]"), list = q("[data-toc-list]"), hs = qa(":scope > h2", prose), links = [];
    if (toc && list && hs.length > 1) {
      hs.forEach(function (h, i) {
        if (!h.id) h.id = "s" + (i + 1) + "-" + h.textContent.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 48);
        var li = d.createElement("li"), a = d.createElement("a"), b = d.createElement("b");
        a.href = "#" + h.id; b.textContent = (i < 9 ? "0" : "") + (i + 1);
        a.appendChild(b); a.appendChild(d.createTextNode(h.textContent));
        li.appendChild(a); list.appendChild(li); links.push(a);
      });
      toc.hidden = false;
      var box = q("[data-toc-box]", toc);
      if (box && matchMedia("(min-width:64em)").matches) box.open = true;
    }

    // Reading meter + active contents entry
    var bar = q("[data-meter]");
    var cur = -1;
    if (bar || links.length) {
      var ticking = false;
      function upd() {
        ticking = false;
        var r = prose.getBoundingClientRect(), tot = r.height - innerHeight * 0.6;
        var x = tot > 0 ? Math.min(1, Math.max(0, -r.top / tot)) : 0;
        if (bar) bar.style.transform = "scaleX(" + x.toFixed(3) + ")";
        if (links.length) {
          var i = -1, lim = innerHeight * 0.3;
          for (var k = 0; k < hs.length; k++) { if (hs[k].getBoundingClientRect().top < lim) i = k; else break; }
          if (i !== cur) { if (links[cur]) links[cur].removeAttribute("aria-current"); if (links[i]) links[i].setAttribute("aria-current", "true"); cur = i; }
        }
      }
      addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
      addEventListener("resize", upd); upd();
    }
  }

  // Countdown
  var ck = q("[data-release]");
  if (ck) {
    var t = Date.parse(ck.getAttribute("data-release")), row = q("[data-clock-row]", ck), done = q("[data-clock-done]", ck);
    if (t && row) (function tick() {
      var s = Math.floor((t - Date.now()) / 1000);
      if (s <= 0) { row.hidden = true; if (done) done.hidden = false; return; }
      q("[data-d]", ck).textContent = Math.floor(s / 86400);
      q("[data-h]", ck).textContent = Math.floor(s % 86400 / 3600);
      q("[data-m]", ck).textContent = Math.floor(s % 3600 / 60);
      setTimeout(tick, 30000);
    })();
  }
})();
