import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from './firebase-config.js';

onAuthStateChanged(auth, user => {
    const publicPaths = ['/index.html', '/pags/Cadastro.html', '/public-prontuario.html'];
    const isPublic = publicPaths.some(path => window.location.pathname.endsWith(path));

    if (!user && !isPublic) {
        window.location.replace('../index.html');
    }
});

async function registerUser(cpf, password) {
    try {
        const email = `${cpf.replace(/\D/g, '')}@lifecode.com`;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            cpf: cpf,
            nome: "Novo Usuário",
            dataNascimento: "",
            tipoSanguineo: "Não informado",
            contatoEmergencia: { nome: "", telefone: "" },
            medicamentosUsoContinuo: [],
            medicamentosAlergicos: [],
            opme: [],
            prontuarios: []
        });
        window.location.href = "./Home.html";
    } catch (error) {
        console.error(error);
        alert(`Erro ao criar conta: ${error.message}`);
    }
}

async function loginUser(cpf, password) {
    try {
        const email = `${cpf.replace(/\D/g, '')}@lifecode.com`;
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "./pags/Home.html";
    } catch (error) {
        console.error(error);
        alert("CPF ou senha inválidos.");
    }
}

async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = "../index.html";
    } catch (error) {
        console.error(error);
    }
}

window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;