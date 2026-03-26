/* ============================================
   簡易パスワード保護 — auth.js
   sessionStorage で認証状態を保持
   ============================================ */
(function () {
  // SHA-256 hash of the password (pre-computed)
  var HASH = "a]Kx";  // placeholder replaced by check below

  // Simple hash function (djb2)
  function djb2(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  var CORRECT_HASH = -1268498008; // djb2("ngt2026")

  // Already authenticated this session?
  if (sessionStorage.getItem("gt_auth") === "ok") return;

  // Hide page content
  document.documentElement.style.visibility = "hidden";

  window.addEventListener("DOMContentLoaded", function () {
    document.documentElement.style.visibility = "hidden";
    document.body.style.visibility = "hidden";

    // Create overlay
    var overlay = document.createElement("div");
    overlay.id = "auth-overlay";
    overlay.innerHTML = [
      '<div style="position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;',
      'background:linear-gradient(135deg,#1a3318 0%,#2d5a27 40%,#4a8a42 100%);font-family:\'Noto Sans JP\',sans-serif;">',
      '<div style="background:#fff;border-radius:12px;padding:48px 40px;max-width:380px;width:90%;text-align:center;',
      'box-shadow:0 16px 48px rgba(0,0,0,0.25);">',
      '<div style="font-size:2rem;margin-bottom:8px;">&#128274;</div>',
      '<h2 style="font-size:1.2rem;font-weight:700;color:#1a1a1a;margin:0 0 8px;">パスワードを入力</h2>',
      '<p style="font-size:0.82rem;color:#888;margin:0 0 24px;">閲覧にはパスワードが必要です</p>',
      '<input id="auth-pw" type="password" placeholder="パスワード" autocomplete="off" ',
      'style="width:100%;padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:0.95rem;',
      'outline:none;box-sizing:border-box;transition:border-color 0.2s;" ',
      'onfocus="this.style.borderColor=\'#2d5a27\'" onblur="this.style.borderColor=\'#ddd\'">',
      '<p id="auth-err" style="color:#d32f2f;font-size:0.78rem;margin:10px 0 0;min-height:1.2em;">&nbsp;</p>',
      '<button id="auth-btn" style="width:100%;padding:12px;background:#2d5a27;color:#fff;border:none;',
      'border-radius:8px;font-size:0.92rem;font-weight:600;cursor:pointer;margin-top:8px;',
      'transition:background 0.2s;" onmouseover="this.style.background=\'#3d7a35\'" ',
      'onmouseout="this.style.background=\'#2d5a27\'">入場する</button>',
      '</div></div>'
    ].join("");
    document.body.appendChild(overlay);
    overlay.style.display = "block";

    var pwInput = document.getElementById("auth-pw");
    var errMsg = document.getElementById("auth-err");
    var btn = document.getElementById("auth-btn");

    function tryAuth() {
      var val = pwInput.value;
      if (djb2(val) === CORRECT_HASH) {
        sessionStorage.setItem("gt_auth", "ok");
        overlay.remove();
        document.documentElement.style.visibility = "";
        document.body.style.visibility = "";
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
  });
})();
