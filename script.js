const SCRIPT_URL = "https://script.google.com/macros/s/あなたのURL/exec";

let lotteryResults = {};

// JSON読み込み（GitHub上のdata.jsonなど）
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    lotteryResults = data;
  })
  .catch(err => {
    console.error("JSON読み込み失敗:", err);
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

  // ローカル保存
  const log = JSON.parse(localStorage.getItem("lottery-log") || "[]");
  const time = new Date().toISOString();
  log.push({ id, result, time });
  localStorage.setItem("lottery-log", JSON.stringify(log));
  if (result === "win") localStorage.setItem(`win-${id}`, "true");

  // Google Sheetsへ送信（ログ保存）
  fetch(SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      employee_id: id,
      result,
      time
    })
  }).catch(err => {
    alert("⚠️ ログの送信に失敗しました");
    console.error("送信エラー:", err);
  });

  // GIF表示
  const gifName = result === "win" ? "Red.gif" : "White.gif";
  gif.src = gifName + "?t=" + new Date().getTime();
  gif.style.display = "block";

  setTimeout(() => {
    resultText.textContent = result === "win"
      ? "🎉 当たりです！おめでとうございます！"
      : "😢 はずれでした…";
    resultText.style.display = "block";
  }, 2500);
}
