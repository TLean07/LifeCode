import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const medicamentos = userData.medicamentosAlergicos || [];
            const listaContainer = document.getElementById('lista-medicamentos');
            listaContainer.innerHTML = '';

            if (medicamentos.length === 0) {
                listaContainer.innerHTML = '<p style="padding: 20px; text-align: center;">Nenhuma alergia cadastrada.</p>';
                return;
            }

            medicamentos.forEach(med => {
                const medCard = document.createElement('div');
                medCard.className = 'med-card';
                medCard.innerHTML = `
                    <h3>${med.nome || ''}</h3>
                    <p><strong>Reação:</strong> ${med.reacao || ''}</p>
                    <p><strong>Observações:</strong> ${med.obs || ''}</p>
                `;
                listaContainer.appendChild(medCard);
            });
        }
    }
});