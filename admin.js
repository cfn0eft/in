const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQ8T6o3tZqNsD2Y43kkSyu7GRQKw6uux87-6PUDlctn_72AqIeBb6PLkbvVcWjnztL/exec";
const ADMIN_PASSWORD = "admin123"; // 必要に応じて変更

function authenticate() {
  const input = document.getElementById("adminPass").value.trim();
  const authMsg = document.getElementById("authMessage");

  if (input === ADMIN_PASSWORD) {
    document.getElementById("authArea").style.display = "none";
    document.getElementById("logArea").style.display = "block";
    fetchLogs();
  } else {
    authMsg.textContent = "パスワードが間違っています";
    authMsg.style.color = "red";
  }
}

async function fetchLogs() {
  try {
    const res = await fetch(SCRIPT_URL + "?mode=all");
    const logs = await res.json();

    const tbody = document.getElementById("logTableBody");
    tbody.innerHTML = "";

    logs.forEach(log => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${log.employee_id}</td><td>${log.result}</td><td>${log.time}</td>`;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("ログ表示エラー:", err);
    alert("ログの表示に失敗しました");
  }
}

// async function fetchLogs() {
//   try {
//     const res = await fetch(SCRIPT_URL + "?mode=all");
//     const logs = await res.json();

//     console.log("取得ログ件数:", logs.length); // ←追加
//     console.log("ログ内容:", logs);          // ←追加

//     const tbody = document.getElementById("logTableBody");
//     tbody.innerHTML = "";

//     logs.forEach(log => {
//       const row = document.createElement("tr");
//       row.innerHTML = `<td>${log.employee_id}</td><td>${log.result}</td><td>${log.time}</td>`;
//       tbody.appendChild(row);
//     });
//   } catch (err) {
//     console.error("ログ取得エラー:", err);
//     alert("ログの取得に失敗しました");
//   }

  
// }


function clearLog() {
  if (confirm("本当にログをすべて削除しますか？")) {
    localStorage.removeItem("lottery-log");
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("win-")) {
        localStorage.removeItem(key);
      }
    });
    document.getElementById("logOutput").textContent = "（ログが削除されました）";
  }
}