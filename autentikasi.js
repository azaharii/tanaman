// firewall sederhana untuk mencegah akses aplikasi// tanpa login terlebih dahulu 
const isLogin = localStorage.getItem("isLogin")

if (!isLogin) {
  window.location.href = "login.html"
}