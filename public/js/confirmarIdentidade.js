import { EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from './firebase-config.js';

const confirmForm = document.getElementById('confirmForm');
const passwordInput = document.getElementById('senha');
const submitButton = confirmForm.querySelector('button');

function showToast(message) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

confirmForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = passwordInput.value;
    const user = auth.currentUser;

    if (!user) {
        showToast("Nenhum usuário logado. Redirecionando...");
        setTimeout(() => window.location.href = '../index.html', 2000);
        return;
    }

    if (!password) {
        showToast("Por favor, digite sua senha.");
        return;
    }
    
    submitButton.disabled = true;
    submitButton.textContent = 'Verificando...';

    const credential = EmailAuthProvider.credential(user.email, password);

    try {
        await reauthenticateWithCredential(user, credential);
        window.location.href = './Prontuario.html';
    } catch (error) {
        console.error("Erro na reautenticação:", error.code);
        
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            showToast('Senha incorreta. Por favor, tente novamente.');
        } else {
            showToast('Ocorreu um erro. Tente novamente mais tarde.');
        }
        
        submitButton.disabled = false;
        submitButton.textContent = 'Acessar Prontuários';
    }
});