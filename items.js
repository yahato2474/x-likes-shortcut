// 左サイドバーの項目定義。content.js と popup.js で共有する。
// hide: 初期状態で隠すか / css: 隠すときの対象セレクタ
const NAV = 'nav[role="navigation"]';
const XLS_ITEMS = [
  { id: "home",          label: "ホーム",             css: [`${NAV} a[href="/home"]`] },
  { id: "explore",       label: "話題を検索",         css: [`${NAV} a[href="/explore"]`] },
  { id: "notifications", label: "通知",               css: [`${NAV} a[href^="/notifications"]`] },
  { id: "chat",          label: "チャット",           css: [`${NAV} a[href^="/i/chat"]`, `${NAV} a[href^="/messages"]`] },
  { id: "calls",         label: "通話",               css: [`${NAV} a[href^="/i/calls"]`], hide: true },
  { id: "grok",          label: "Grok",               css: [`${NAV} a[href^="/i/grok"]`] },
  { id: "history",       label: "履歴(ブックマーク)", css: [`${NAV} a[href="/i/history"]`, `${NAV} a[href^="/i/bookmarks"]`] },
  { id: "likes",         label: "いいね(この拡張)",   css: ["#xls-likes-link"] },
  { id: "creators",      label: "クリエイタースタジオ", css: [`${NAV} a[href^="/i/jf/creators"]`], hide: true },
  { id: "premium",       label: "プレミアム",         css: [`${NAV} a[href^="/i/premium"]`, `${NAV} a[href^="/i/verified-choose"]`], hide: true },
  { id: "profile",       label: "プロフィール",       css: [`${NAV} a[data-testid="AppTabBar_Profile_Link"]`] },
  { id: "more",          label: "もっと見る",         css: ['[data-testid="AppTabBar_More_Menu"]'] },
  { id: "post",          label: "ポストするボタン",   css: ['a[data-testid="SideNav_NewTweet_Button"]'] },
  { id: "account",       label: "アカウント切替(左下)", css: ['[data-testid="SideNav_AccountSwitcher_Button"]'] },
];

const XLS_STORAGE_KEY = "hidden";

function xlsDefaultHidden() {
  return XLS_ITEMS.filter((i) => i.hide).map((i) => i.id);
}
