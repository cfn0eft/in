function authenticate() {
  const input = document.getElementById("adminPass").value.trim();
  const authMsg = document.getElementById("authMessage");

  if (input === "admin123") {
    document.getElementById("authArea").style.display = "none";
    document.getElementById("logArea").style.display = "block";
    fetchLogs();
  } else {
    authMsg.textContent = "パスワードが間違っています";
    authMsg.style.color = "red";
  }
}

function fetchLogs() {
  const logs = JSON.parse(localStorage.getItem("lottery-log") || "[]");
  const tbody = document.getElementById("logTableBody");
  tbody.innerHTML = "";

  logs.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${entry.id}</td><td>${entry.result}</td><td>${entry.time}</td>`;
    tbody.appendChild(row);
  });

  if (logs.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="3">ログはありません</td>`;
    tbody.appendChild(row);
  }
}

function clearLog() {
  if (confirm("本当にログをすべて削除しますか？")) {
    localStorage.removeItem("lottery-log");
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("win-")) {
        localStorage.removeItem(key);
      }
    });
    fetchLogs();
  }
}
