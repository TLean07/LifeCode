import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from './firebase-config.js';

function getUserIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function loadPublicData() {
    const userId = getUserIdFromUrl();
    const container = document.getElementById('prontuario-container');

    if (!userId) {
        container.innerHTML = "<p>ID do usuário não encontrado na URL.</p>";
        return;
    }

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const userData = docSnap.data();
        document.getElementById('userName').textContent = userData.nome || 'Informação Indisponível';
        
        container.innerHTML = `
            <div class="info-item"><strong>Tipo Sanguíneo:</strong> ${userData.tipoSanguineo || 'Não informado'}</div>
            <div class="info-item"><strong>Contato de Emergência:</strong> ${userData.contatoEmergencia?.nome || ''} - ${userData.contatoEmergencia?.telefone || 'Não informado'}</div>
            
            <h3>Medicamentos Alérgicos</h3>
            <div class="info-item" id="alergias-list"></div>

            <h3>OPME (Órteses, Próteses e Materiais Especiais)</h3>
            <div class="info-item" id="opme-list"></div>

            <h3>Medicamentos de Uso Contínuo</h3>
            <div class="info-item" id="continuo-list"></div>
        `;
        
        const renderList = (elementId, dataList, formatter) => {
            const listElement = document.getElementById(elementId);
            if (dataList && dataList.length > 0) {
                listElement.innerHTML = dataList.map(formatter).join('');
            } else {
                listElement.innerHTML = '<p>Nenhum item cadastrado.</p>';
            }
        };

        renderList('alergias-list', userData.medicamentosAlergicos, item => `<p>- <strong>${item.nome}:</strong> ${item.reacao}</p>`);
        renderList('opme-list', userData.opme, item => `<p>- <strong>${item.nome}</strong> (Data: ${item.data})</p>`);
        renderList('continuo-list', userData.medicamentosUsoContinuo, item => `<p>- <strong>${item.nome}</strong> (${item.dosagem})</p>`);

    } else {
        document.getElementById('userName').textContent = "Erro";
        container.innerHTML = "<p>Usuário não encontrado ou prontuário inexistente.</p>";
    }
}

loadPublicData();