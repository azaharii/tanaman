// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js"
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js"

// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBMSsNz6Dgss5vr8vlPbDdKgwOIn3dMBik",
  authDomain: "insancemerlang2025.firebaseapp.com",
  projectId: "insancemerlang2025",
  storageBucket: "insancemerlang2025.firebasestorage.app",
  messagingSenderId: "900746896855",
  appId: "1:900746896855:web:20cfd37822398ef034d792"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const tanamanCollection = collection(db, "tanaman")

// fungsi untuk login
export async function login() {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  
  const q = query(
    collection(db, "users"),
    where("username", "==", username),
    where("password", "==", password)
  )
  
  const querySnapshot = await getDocs(collection(db, "users"))
  
  let ketemu = false
  
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    
    if (data.username === username && data.password === password) {
      ketemu = true
    }
  })
  
  if (ketemu) {
    // simpan status login di localStorage
    localStorage.setItem("isLogin", "true")
    
    document.getElementById("status").innerText = "Login berhasil"
    // redirect
    window.location.href = "index.html"
  } else {
    document.getElementById("status").innerText = "Username atau password salah"
  }
}



//  fungsi untuk logout 
export function logout() {
  // hapus status login dari localstorage
  localStorage.removeItem("isLogin")
  
  // redirect ke halaman login
  window.location.href = "login.html"
}

// ============ DAFTAR Tanaman =============
export async function daftarTanaman() {
  
  const snapshot = await getDocs(tanamanCollection)
  const tabel = document.getElementById('tabelData')
  
  tabel.innerHTML = ""
  
  snapshot.forEach((item) => {
    
    const data = item.data()
    const id = item.id
    
    const baris = document.createElement("tr")
    
    const noUrut = document.createElement("td")
    noUrut.textContent = tabel.rows.length + 1
    
    const namaTanaman = document.createElement("td")
    namaTanaman.textContent = data.namaTanaman
    
    const warna = document.createElement("td")
    warna.textContent = data.warna
    
    const jenis = document.createElement("td")
    jenis.textContent = data.jenis
    
    const kolomAksi = document.createElement('td')
    
    const tombolEdit = document.createElement('a')
    tombolEdit.textContent = 'Edit'
    tombolEdit.href = 'edit.html?id=' + id
    tombolEdit.className = 'button edit'
    
    const tombolHapus = document.createElement('button')
    tombolHapus.textContent = 'Hapus'
    tombolHapus.className = 'button delete'
    tombolHapus.onclick = async () => {
      await hapusTanaman(id)
    }
    
    kolomAksi.appendChild(tombolEdit)
    kolomAksi.appendChild(tombolHapus)
    
    // 
    baris.appendChild(noUrut)
    baris.appendChild(namaTanaman)
    baris.appendChild(warna)
    baris.appendChild(jenis)
    baris.appendChild(kolomAksi)
    
    tabel.appendChild(baris)
  })
}

// ========= TAMBAH Tanaman ===========
export async function tambahTanaman() {
  const namaTanaman = document.getElementById('namaTanaman').value
  const warna = document.getElementById('warna').value
  const jenis = document.getElementById('jenis').value
  
  await addDoc(tanamanCollection, {
    namaTanaman: namaTanaman,
    warna: warna,
    jenis: jenis,
  })
  
  window.location.href = 'daftar.html'
}

//fungsi untuk mengambil data Tanaman bedasarkan id
//agar data ditampilkan di form ubah
export async function ambildataTanaman(id) {
  const docRef = doc(db, "tanaman", id)
  const docSnap = await getDoc(docRef)
  
  return await docSnap.data()
}

//fungsi untuk mengubah data Tanaman
export async function ubahdataTanaman(id, namaTanaman, warna, jenis) {
  // mengubah data di firestore
  await updateDoc(doc(db, "tanaman", id), {
    namaTanaman: namaTanaman,
    warna: warna,
    jenis: jenis,
  })
  //alihkan ke halaman daftar Tanaman
  window.location.href = 'daftar.html'
}

// ========= HAPUS BARANG ==========
export async function hapusTanaman(id) {
  await deleteDoc(doc(db, "tanaman", id))
  alert("yakin ingin menghapus data ini?")
  daftarTanaman()
}

