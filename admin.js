const adminPassword = "admin";
function verifyAdmin() {
  const input = document.getElementById("adminPass").value;
  if (input === adminPassword) {
    document.querySelector(".admin-auth").style.display = "none";
    document.getElementById("logContainer").style.display = "block";
    loadLog();
  } else {
    alert("パスワードが違います");
  }
}
function goBack() {
  window.location.href = "index.html";
}
function loadLog() {
  const table = document.getElementById("logTable");
  const logs = JSON.parse(localStorage.getItem("lottery-log") || "[]");
  table.innerHTML =
    "<tr><th>ID</th><th>結果</th><th>時刻</th></tr>" +
    logs.map((row) => `<tr><td>${row.id}</td><td>${row.result}</td><td>${row.time}</td></tr>`).join("");
}

function clearLog() {
  if (confirm("本当にログをすべて削除しますか？")) {
    localStorage.removeItem("lottery-log");
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("win-")) {
        localStorage.removeItem(key);
      }
    });
    loadLog();
  }
}

window.verifyAdmin = verifyAdmin;
window.goBack = goBack;
