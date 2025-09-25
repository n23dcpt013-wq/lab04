// Helpers
const $ = (sel) => document.querySelector(sel);
const setErr = (el, msg) => {
  el.textContent = msg || "";
};

// Simple rules
const usernameRe = /^[a-zA-Z0-9._]{3,30}$/;

const form = $("#loginForm");
const uInput = $("#username");
const pInput = $("#password");
const remember = $("#remember");
const uErr = $("#uErr");
const pErr = $("#pErr");
const formMsg = $("#formMsg");
const togglePw = $("#togglePw");
const btnCancel = $("#btnCancel");

// Prefill username if remembered
(function restore() {
  const saved = localStorage.getItem("demo.username");
  if (saved) {
    uInput.value = saved;
    remember.checked = true;
  }
})();

togglePw.addEventListener("click", () => {
  const shown = pInput.type === "text";
  pInput.type = shown ? "password" : "text";
  togglePw.setAttribute("aria-pressed", String(!shown));
});

// Live validation
uInput.addEventListener("input", () => {
  if (!uInput.value.trim()) return setErr(uErr, "Vui lòng nhập username.");
  if (!usernameRe.test(uInput.value)) return setErr(uErr, "Username 3–30 ký tự: chữ/số/._");
  setErr(uErr, "");
});

pInput.addEventListener("input", () => {
  if (!pInput.value) return setErr(pErr, "Vui lòng nhập password.");
  if (pInput.value.length < 6) return setErr(pErr, "Password tối thiểu 6 ký tự.");
  setErr(pErr, "");
});

btnCancel.addEventListener("click", () => {
  form.reset();
  setErr(uErr, ""); setErr(pErr, "");
  formMsg.textContent = "";
});

// Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;

  if (!uInput.value.trim()) { setErr(uErr, "Vui lòng nhập username."); ok = false; }
  else if (!usernameRe.test(uInput.value)) { setErr(uErr, "Username 3–30 ký tự: chữ/số/._"); ok = false; }
  else setErr(uErr, "");

  if (!pInput.value) { setErr(pErr, "Vui lòng nhập password."); ok = false; }
  else if (pInput.value.length < 6) { setErr(pErr, "Password tối thiểu 6 ký tự."); ok = false; }
  else setErr(pErr, "");

  if (!ok) {
    formMsg.className = "form-msg err";
    formMsg.textContent = "Vui lòng sửa lỗi được tô đỏ.";
    return;
  }

  // Remember me (demo)
  if (remember.checked) localStorage.setItem("demo.username", uInput.value);
  else localStorage.removeItem("demo.username");

  // Demo: coi như đăng nhập thành công (KHÔNG xác thực thật)
  formMsg.className = "form-msg ok";
  formMsg.textContent = "Đăng nhập thành công (demo).";
  // Thực tế: fetch('/api/login', {method:'POST', body:FormData...})
});
