/* Runs before paint; also works when the prototype is opened from file://. */
(() => {
  let theme = "dark",
    language = "es";
  try {
    theme = localStorage.getItem("av-theme") === "light" ? "light" : "dark";
    language = localStorage.getItem("av-language") === "en" ? "en" : "es";
  } catch (_) {
    /* Private browsing can deny local storage. */
  }
  const query = new URLSearchParams(location.search);
  if (["es", "en"].includes(query.get("lang"))) language = query.get("lang");
  document.documentElement.dataset.theme = theme;
  document.documentElement.lang = language;
})();
