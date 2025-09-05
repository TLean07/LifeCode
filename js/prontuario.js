import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const prontuarios = userData.prontuarios || [];
            const listaContainer = document.getElementById('lista-prontuarios');
            listaContainer.innerHTML = '';

            if (prontuarios.length === 0) {
                listaContainer.innerHTML = '<p style="padding: 20px; text-align: center;">Nenhum prontuário encontrado.</p>';
                return;
            }
            
            // Ordena os prontuários do mais recente para o mais antigo
            prontuarios.sort((a, b) => new Date(b.data.split('/').reverse().join('-')) - new Date(a.data.split('/').reverse().join('-')));

            prontuarios.forEach(item => {
                const prontuarioCard = document.createElement('a');
                prontuarioCard.className = 'prontuario-card';
                prontuarioCard.href = `ProntData.html?id=${item.id}`;
                prontuarioCard.innerHTML = `
                    <h3>${item.especialidade}</h3>
                    <p><strong>Data:</strong> ${item.data}</p>
                    <p><strong>Médico:</strong> ${item.medico}</p>
                    <span>Ver Detalhes &rarr;</span>
                `;
                listaContainer.appendChild(prontuarioCard);
            });
        }
    }
});