/* ============================================
   簡易パスワード保護 — auth.js v2
   コンテンツの上にオーバーレイを被せる方式
   ============================================ */
(function () {
  // djb2 hash
  function djb2(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash;
  }

  var CORRECT_HASH = -1268498008; // djb2("ngt2026")

  // Already authenticated this session?
  if (sessionStorage.getItem("gt_auth") === "ok") return;

  // Create full-screen overlay that covers everything
  var overlay = document.createElement("div");
  overlay.id = "auth-overlay";
  overlay.style.cssText = "position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a3318 0%,#2d5a27 40%,#4a8a42 100%);font-family:'Noto Sans JP',sans-serif;";

  overlay.innerHTML = '<div style="background:#fff;border-radius:12px;padding:48px 40px;max-width:380px;width:90%;text-align:center;box-shadow:0 16px 48px rgba(0,0,0,0.25);">'
    + '<div style="font-size:2rem;margin-bottom:8px;">&#128274;</div>'
    + '<h2 style="font-size:1.2rem;font-weight:700;color:#1a1a1a;margin:0 0 8px;">パスワードを入力</h2>'
    + '<p style="font-size:0.82rem;color:#888;margin:0 0 24px;">閲覧にはパスワードが必要です</p>'
    + '<input id="auth-pw" type="password" placeholder="パスワード" autocomplete="off" style="width:100%;padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:0.95rem;outline:none;box-sizing:border-box;">'
    + '<p id="auth-err" style="color:#d32f2f;font-size:0.78rem;margin:10px 0 0;min-height:1.2em;">&nbsp;</p>'
    + '<button id="auth-btn" style="width:100%;padding:12px;background:#2d5a27;color:#fff;border:none;border-radius:8px;font-size:0.92rem;font-weight:600;cursor:pointer;margin-top:8px;">入場する</button>'
    + '</div>';

  document.body.appendChild(overlay);

  var pwInput = document.getElementById("auth-pw");
  var errMsg = document.getElementById("auth-err");
  var btn = document.getElementById("auth-btn");

  function tryAuth() {
    if (djb2(pwInput.value) === CORRECT_HASH) {
      sessionStorage.setItem("gt_auth", "ok");
      overlay.remove();
    } else {
      errMsg.textContent = "パスワードが正しくありません";
      pwInput.style.borderColor = "#d32f2f";
      pwInput.value = "";
      pwInput.focus();
    }
  }

  btn.addEventListener("click", tryAuth);
  pwInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") tryAuth();
  });
  pwInput.focus();
})();
