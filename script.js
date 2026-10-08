(function () {
  var cfg = window.SITE_CONFIG || {};
  var form = document.getElementById("lead-form");
  var steps = form.querySelectorAll("[data-step]");
  var submitted = false;

  // PageView + ViewContent (fires once when the visitor scrolls past the hero)
  track("PageView");
  var viewed = false;
  function onScroll() {
    var past = window.scrollY > 300;
    document.getElementById("sticky").classList.toggle("show", past);
    if (past && !viewed) { viewed = true; track("ViewContent"); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // Hide sticky CTA while the form is on screen
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      document.getElementById("sticky").style.visibility = e[0].isIntersecting ? "hidden" : "visible";
    }).observe(document.getElementById("assessment"));
  }

  // Capture UTMs and Meta identifiers into hidden fields (and keep for thank-you page)
  var q = new URLSearchParams(location.search);
  var keys = { utm_source: "utm_source", utm_medium: "utm_medium", utm_campaign: "utm_campaign",
               utm_content: "utm_content", utm_term: "utm_term", adset: "utm_adset", ad: "utm_ad",
               placement: "placement", fbclid: "fbclid" };
  Object.keys(keys).forEach(function (field) {
    var v = q.get(keys[field]) || q.get(field);
    if (v && form.elements[field]) form.elements[field].value = v;
  });
  form.elements.page_version.value = cfg.pageVersion || "v1";

  function show(n) {
    steps.forEach(function (s) { s.hidden = s.getAttribute("data-step") !== String(n); });
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function setValid(input, ok) {
    input.closest(".field").classList.toggle("invalid", !ok);
    return ok;
  }
  function validStep1() {
    var f = form.elements;
    var phone = f.phone.value.replace(/[\s\-+]/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    var a = setValid(f.name, f.name.value.trim().length >= 2);
    var b = setValid(f.phone, /^[6-9]\d{9}$/.test(phone));
    var c = setValid(f.email, !f.email.value || /^\S+@\S+\.\S+$/.test(f.email.value));
    f.phone.value = phone;
    return a && b && c;
  }
  function validStep2() {
    var f = form.elements;
    return setValid(f.experience, !!f.experience.value) & setValid(f.goal, !!f.goal.value);
  }

  document.getElementById("next").addEventListener("click", function () {
    if (!validStep1()) return;
    // Lead event: step one contact captured. Guarded so it never fires twice.
    if (!window.__leadFired) {
      window.__leadFired = true;
      track("Lead", { content_name: "assessment_step1" }, "lead-" + Date.now());
    }
    show(2);
  });
  document.getElementById("back").addEventListener("click", function () { show(1); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitted || !validStep1() || !validStep2()) return;
    submitted = true;
    var btn = document.getElementById("submit");
    btn.disabled = true; btn.textContent = "Submitting...";

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data.whatsapp_consent = form.elements.whatsapp_consent.checked;
    data.submitted_at = new Date().toISOString();

    track("CompleteRegistration", { content_name: "assessment_step2", status: true }, "cr-" + Date.now());
    trackCustom("QualifiedLead",{ goal: data.goal, experience: data.experience }, "ql-" + Date.now());
    try { sessionStorage.setItem("fw_lead", JSON.stringify({ name: data.name, goal: data.goal })); } catch (_) {}

    function done() { location.href = "thank-you.html"; }
    if (cfg.leadEndpoint) {
      fetch(cfg.leadEndpoint, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), keepalive: true }).then(done, done);
    } else {
      console.info("[lead] no leadEndpoint configured. Payload:", data);
      done();
    }
  });

  // CTA click tracking helper (smooth scroll handled by CSS)
  document.querySelectorAll("[data-cta]").forEach(function (a) {
    a.addEventListener("click", function () { trackCustom("CTAClick", { location: a.dataset.cta }); });
  });
})();
