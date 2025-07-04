const ADMIN_PASSWORD = "admin123";

function authenticate() {
  const input = document.getElementById("adminPass").value.trim();
  const authMsg = document.getElementById("authMessage");

  if (input === ADMIN_PASSWORD) {
    document.getElementById("authArea").style.display = "none";
    document.getElementById("logArea").style.display = "block";
    loadLog();
  } else {
    authMsg.textContent = "パスワードが間違っています";
    authMsg.style.color = "red";
  }
}

function loadLog() {
  const logs = JSON.parse(localStorage.getItem("lottery-log") || "[]");
  const tbody = document.getElementById("logTableBody");
  tbody.innerHTML = "";

  logs.forEach(log => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${log.id}</td><td>${log.result}</td><td>${log.time}</td>`;
    tbody.appendChild(row);
  });
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
