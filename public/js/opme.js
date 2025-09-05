import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const opmes = userData.opme || [];
            const listaContainer = document.getElementById('lista-opme');
            listaContainer.innerHTML = '';

            if (opmes.length === 0) {
                listaContainer.innerHTML = '<p style="padding: 20px; text-align: center;">Nenhum OPME cadastrado.</p>';
                return;
            }

            opmes.forEach(item => {
                const opmeCard = document.createElement('div');
                opmeCard.className = 'opme-card';
                opmeCard.innerHTML = `
                    <h3>${item.nome || ''}</h3>
                    <p><strong>Data:</strong> ${item.data || ''}</p>
                    <p><strong>Observações:</strong> ${item.obs || ''}</p>
                `;
                listaContainer.appendChild(opmeCard);
            });
        }
    }
});