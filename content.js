(() => {
  const LINK_ID = "xls-likes-link";
  const HEART_PATH =
    "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z";

  const label = document.documentElement.lang.startsWith("ja") ? "いいね" : "Likes";

  function likesPath() {
    const profile = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
    const path = profile && profile.getAttribute("href");
    return path ? `${path.replace(/\/$/, "")}/likes` : null;
  }

  function inject() {
    if (document.getElementById(LINK_ID)) return;

    // 見た目を揃えるため、既存のナビ項目を複製して使う
    // 優先: ブックマーク(href は /i/bookmarks など) → なければプロフィール
    const bookmarks =
      document.querySelector('nav a[href="/i/history"]') ||
      document.querySelector('nav a[href*="/i/bookmarks"]') ||
      document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
    const path = likesPath();
    if (!bookmarks || !path) return;

    const link = bookmarks.cloneNode(true);
    link.id = LINK_ID;
    link.setAttribute("href", path);
    link.removeAttribute("data-testid");
    link.removeAttribute("aria-label");
    link.setAttribute("aria-label", label);

    // アイコンをハートに差し替え
    const svgPath = link.querySelector("svg path");
    if (svgPath) {
      svgPath.setAttribute("d", HEART_PATH);
      link.querySelectorAll("svg path").forEach((p, i) => i > 0 && p.remove());
    }

    // ラベルを差し替え(末端のテキストノードだけ書き換える)
    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    if (texts.length) {
      texts[0].textContent = label;
      texts.slice(1).forEach((t) => (t.textContent = ""));
    }

    // 通常のリンク遷移(フルロード)で確実に開く
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      location.assign(path);
    }, true);

    bookmarks.insertAdjacentElement("afterend", link);
  }

  // X は SPA でナビが再描画されるため、監視して再挿入する
  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      inject();
    });
  }).observe(document.body, { childList: true, subtree: true });

  // 非表示設定を <style> として反映する
  const style = document.createElement("style");
  style.id = "xls-hide-style";
  document.documentElement.appendChild(style);

  function applyHidden(ids) {
    const hidden = new Set(ids);
    const selectors = XLS_ITEMS.filter((i) => hidden.has(i.id)).flatMap((i) => i.css);
    style.textContent = selectors.length
      ? `${selectors.join(",\n")} { display: none !important; }`
      : "";
  }

  chrome.storage.sync.get(XLS_STORAGE_KEY, (res) =>
    applyHidden(res[XLS_STORAGE_KEY] ?? xlsDefaultHidden())
  );
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes[XLS_STORAGE_KEY]) {
      applyHidden(changes[XLS_STORAGE_KEY].newValue ?? xlsDefaultHidden());
    }
  });

  inject();
})();
