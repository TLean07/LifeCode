import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            document.getElementById('userName').textContent = userData.nome || 'Nome não definido';
            document.getElementById('bloodType').textContent = userData.tipoSanguineo || 'N/A';
            document.getElementById('heartRate').textContent = userData.batimentosCardiacos || 'N/A'; // Adicionado
            generateQRCode(user.uid);
        } else {
            console.log("Documento do usuário não encontrado!");
        }
    }
});

function generateQRCode(userId) {
    const qrCodeContainer = document.getElementById('qrcode');
    if (!qrCodeContainer) return;
    qrCodeContainer.innerHTML = "";
    
    const url = new URL('public-prontuario.html', window.location.href.replace('/pags/', '/'));
    url.searchParams.set('id', userId);

    new QRCode(qrCodeContainer, {
        text: url.href,
        width: 128,
        height: 128,
    });
}

document.getElementById('logoutButton')?.addEventListener('click', () => {
    window.logoutUser();
});