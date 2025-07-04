let lotteryResults = {};

// 外部JSONを読み込む
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    lotteryResults = data;
  })
  .catch(error => {
    console.error("JSON読み込み失敗:", error);
  });

function drawLottery() {
  const id = document.getElementById('idInput').value.trim().toUpperCase();
  const gif = document.getElementById('resultGif');
  const resultText = document.getElementById('resultText');

  gif.style.display = "none";
  resultText.style.display = "none";
  resultText.textContent = "";
  gif.src = "";

  if (!id) {
    resultText.textContent = "⚠️ IDを入力してください";
    resultText.style.display = "block";
    return;
  }

  const result = lotteryResults[id];

  if (!result) {
    resultText.textContent = "⚠️ 該当するIDが見つかりません";
    resultText.style.display = "block";
    return;
  }

  const alreadyWon = localStorage.getItem(`win-${id}`);
  if (result === "win" && alreadyWon) {
    resultText.textContent = "⚠️ このIDはすでに当たり判定済みです。";
    resultText.style.display = "block";
    return;
  }

  // ログ保存
  const log = JSON.parse(localStorage.getItem("lottery-log") || "[]");
  log.push({ id, result, time: new Date().toISOString() });
  localStorage.setItem("lottery-log", JSON.stringify(log));

  if (result === "win") {
    localStorage.setItem(`win-${id}`, "true");
  }

  // GIF表示
  const gifName = result === "win" ? "Red.gif" : "White.gif";
  gif.src = gifName + "?t=" + new Date().getTime(); // キャッシュ防止
  gif.style.display = "block";

  // 結果表示（GIF再生後）
  setTimeout(() => {
    resultText.textContent = result === "win"
      ? "🎉 当たりです！おめでとうございます！"
      : "😢 はずれでした…";
    resultText.style.display = "block";
  }, 2500);
}

function testGif(result) {
  const gif = document.getElementById("resultGif");
  const resultText = document.getElementById("resultText");

  gif.src = (result === "win" ? "Red.gif" : "White.gif") + "?t=" + new Date().getTime();
  gif.style.display = "block";
  resultText.style.display = "none";
  resultText.textContent = "";

  setTimeout(() => {
    resultText.textContent = result === "win"
      ? "🎉 当たりです！（テスト）"
      : "😢 はずれです（テスト）";
    resultText.style.display = "block";
  }, 2500);
}  

function goToAdminPage() {
  window.location.href = "admin.html";
}

// エラー時のアラートを抑制（fetchでの送信失敗など）
window.addEventListener("unhandledrejection", function(event) {
  console.warn("送信失敗（無視）:", event.reason);
  event.preventDefault();
});
