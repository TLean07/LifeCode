import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

const completeProfileForm = document.getElementById('completeProfileForm');

completeProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("Você não está logado. Redirecionando para o login.");
        window.location.href = '../index.html';
        return;
    }

    const nome = document.getElementById('nome').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;

    const userDocRef = doc(db, "users", user.uid);
    const submitButton = completeProfileForm.querySelector('button');
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';

        await updateDoc(userDocRef, {
            nome: nome,
            dataNascimento: dataNascimento,
            telefone: telefone,
            email: email,
            profileComplete: true 
        });

        window.location.href = './Home.html';

    } catch (error) {
        console.error("Erro ao atualizar perfil: ", error);
        alert("Não foi possível salvar seus dados. Tente novamente.");
        submitButton.disabled = false;
        submitButton.textContent = 'Salvar e Continuar';
    }
});