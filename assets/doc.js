/* Language handling shared by the document pages.
   English lives in the HTML (so it works with JS off and is crawlable).
   PT/ES come from window.DOC_I18N, defined by each page. */
(function () {
  var LANGS = ["en", "pt", "es"];

  function pick() {
    var saved = null;
    try { saved = localStorage.getItem("askivan_lang"); } catch (e) {}
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    var list = (navigator.languages && navigator.languages.length)
      ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).toLowerCase().slice(0, 2);
      if (LANGS.indexOf(code) !== -1) return code;
    }
    return "en";
  }

  function apply(lang) {
    if (LANGS.indexOf(lang) === -1) lang = "en";
    var html = document.documentElement;
    html.lang = lang;

    // English is already in the markup: restore it from the data attribute snapshot.
    var dict = (lang === "en") ? null : ((window.DOC_I18N || {})[lang] || null);

    document.querySelectorAll("[data-t]").forEach(function (el) {
      if (!el.dataset.en) el.dataset.en = el.textContent;
      var v = dict ? dict[el.dataset.t] : undefined;
      el.textContent = (v === undefined || v === null) ? el.dataset.en : v;
    });

    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });

    if (window.DOC_TITLES && window.DOC_TITLES[lang]) {
      document.title = window.DOC_TITLES[lang];
    }
    if (window.DOC_DESCRIPTIONS && window.DOC_DESCRIPTIONS[lang]) {
      var m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", window.DOC_DESCRIPTIONS[lang]);
    }

    try { localStorage.setItem("askivan_lang", lang); } catch (e) {}
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { apply(b.dataset.lang); });
  });

  apply(pick());
})();
