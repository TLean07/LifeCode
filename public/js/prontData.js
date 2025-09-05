import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

function getProntuarioIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

onAuthStateChanged(auth, async (user) => {
    const prontuarioId = getProntuarioIdFromUrl();
    const container = document.getElementById('detalhes-container');

    if (!user) {
        container.innerHTML = "<p>Usuário não autenticado.</p>";
        return;
    }
    if (!prontuarioId) {
        container.innerHTML = "<p>ID do prontuário não encontrado.</p>";
        return;
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const userData = docSnap.data();
        const prontuarios = userData.prontuarios || [];
        const item = prontuarios.find(p => p.id === prontuarioId);

        if (item) {
            document.getElementById('header-data').textContent = `Prontuário de ${item.data}`;
            container.innerHTML = `
                <div class="info-card">
                    <div class="info-item">
                        <label>Data da Consulta</label>
                        <p>${item.data}</p>
                    </div>
                    <div class="info-item">
                        <label>Médico Responsável</label>
                        <p>${item.medico}</p>
                    </div>
                    <div class="info-item">
                        <label>Especialidade</label>
                        <p>${item.especialidade}</p>
                    </div>
                    <div class="info-item">
                        <label>Resumo e Observações</label>
                        <p>${item.resumo}</p>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = "<p>Detalhes do prontuário não encontrados.</p>";
        }
    }
});