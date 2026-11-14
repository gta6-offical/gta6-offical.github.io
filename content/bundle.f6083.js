// Mobile menu toggle + release countdown (static fallback text stays if JS is off).
(function () {
  var hdr = document.querySelector("[data-nav]"), btn = hdr && hdr.querySelector(".ee-hdr__toggle");
  if (btn) {
    btn.hidden = false; hdr.classList.add("ee-has-js");
    btn.addEventListener("click", function () { var o = btn.getAttribute("aria-expanded") === "true"; btn.setAttribute("aria-expanded", String(!o)); hdr.classList.toggle("ee-is-open", !o); });
  }
  var cd = document.querySelector(".ee-cd[data-release]");
  if (!cd) return;
  var t = Date.parse(cd.getAttribute("data-release"));
  if (!t) return;
  function tick() {
    var s = Math.floor((t - Date.now()) / 1000);
    if (s <= 0) { cd.querySelector(".ee-cd__grid").hidden = true; cd.querySelector(".ee-cd__done").hidden = false; return; }
    cd.querySelector("[data-d]").textContent = Math.floor(s / 86400);
    cd.querySelector("[data-h]").textContent = Math.floor(s % 86400 / 3600);
    cd.querySelector("[data-m]").textContent = Math.floor(s % 3600 / 60);
    setTimeout(tick, 30000);
  }
  tick();
})();
