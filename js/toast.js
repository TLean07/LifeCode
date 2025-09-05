import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from './firebase-config.js';
import { showToast } from './toast.js';

const resetForm = document.getElementById('resetPasswordForm');

resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const submitButton = resetForm.querySelector('button');

    if (!email) {
        showToast("Por favor, digite seu e-mail.", 'error');
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {
        await sendPasswordResetEmail(auth, email);
        showToast("Link enviado! Verifique sua caixa de entrada.", 'success');
        resetForm.reset(); 
    } catch (error) {
        console.error("Erro ao enviar e-mail de redefinição:", error);
        showToast("E-mail não encontrado ou erro no servidor.", 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar link de redefinição';
    }
});