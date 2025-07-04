let lotteryResults = {};
fetch("data.json")
  .then((res) => res.json())
  .then((data) => (lotteryResults = data))
  .catch((err) => console.error("JSON読み込み失敗", err));

function drawLottery() {
  const id = document.getElementById("idInput").value.trim().toUpperCase();
  const gif = document.getElementById("resultGif");
  const resultText = document.getElementById("resultText");
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
  const log = JSON.parse(localStorage.getItem("lottery-log") || "[]");
  log.push({ id, result, time: new Date().toISOString() });
  localStorage.setItem("lottery-log", JSON.stringify(log));
  if (result === "win") {
    localStorage.setItem(`win-${id}`, "true");
  }

  // GIFを設定
  gif.src = (result === "win" ? "Red.gif" : "White.gif") + `?t=${Date.now()}`;
  gif.style.display = "block";

  // GIFの読み込みが完了した後に結果を表示
  gif.onload = function() {
    setTimeout(() => {
      resultText.innerHTML = result === "win"
        ? "🎉 当たりです！<br>おめでとうございます！<br>スクリーンショットをマネージャーに見せてね！"
        : "😢 はずれでした…";
      resultText.style.display = "block";
    }, 3500);
  };
}

window.drawLottery = drawLottery;
window.goToAdminPage = () => (window.location.href = "admin.html");
window.addEventListener("unhandledrejection", (e) => {
  console.warn("送信失敗（無視）:", e.reason);
  e.preventDefault();
});
