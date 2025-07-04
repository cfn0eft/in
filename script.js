// ===== script.js =====

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQ8T6o3tZqNsD2Y43kkSyu7GRQKw6uux87-6PUDlctn_72AqIeBb6PLkbvVcWjnztL/exec";

let lotteryResults = {};

// 外部 JSON から抽選結果読み込み（data.json）
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    lotteryResults = data;
  })
  .catch(error => {
    console.error("JSON読み込み失敗:", error);
  });

async function drawLottery() {
  const id = document.getElementById('idInput').value.trim().toUpperCase();
  const gif = document.getElementById('resultGif');
  const resultText = document.getElementById('resultText');

  // 初期化
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

  // 二重当選防止（ローカルチェック）
  const alreadyWon = localStorage.getItem(`win-${id}`);
  if (result === "win" && alreadyWon) {
    resultText.textContent = "⚠️ このIDはすでに当たり判定済みです。";
    resultText.style.display = "block";
    return;
  }

  const now = new Date().toISOString();

  // Google Sheets へ送信
  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        employee_id: id,
        result: result,
        time: now
      })
    });

    if (!response.ok) throw new Error("送信失敗");
    const resText = await response.text();
    console.log("スプレッドシート保存成功:", resText);
  } catch (err) {
    alert("⚠️ ログの送信に失敗しました");
    console.error(err);
    return;
  }

  // ローカルにも保存
  const log = JSON.parse(localStorage.getItem("lottery-log") || "[]");
  log.push({ id, result, time: now });
  localStorage.setItem("lottery-log", JSON.stringify(log));

  if (result === "win") {
    localStorage.setItem(`win-${id}`, "true");
  }

  // GIF 表示
  gif.src = (result === "win" ? "Red.gif" : "White.gif") + "?t=" + new Date().getTime();
  gif.style.display = "block";

  setTimeout(() => {
    resultText.textContent = result === "win"
      ? "🎉 当たりです！おめでとうございます！"
      : "😢 はずれでした…";
    resultText.style.display = "block";
  }, 2500);
}

// GIFテスト用関数
function testGif() {
  const gif = document.getElementById("resultGif");
  gif.src = "Red.gif?t=" + Date.now(); // キャッシュ回避
  gif.style.display = "block";
}

// 関数をグローバルに公開
window.drawLottery = drawLottery;
window.testGif = testGif;
