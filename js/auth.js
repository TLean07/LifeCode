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

            let userData;

            if (cpf === '12345678') {
                userData = {
                    cpf: "12345678",
                    nome: "João Silva",
                    dataNascimento: "1980-05-15",
                    tipoSanguineo: "O+",
                    batimentosCardiacos: "72 bpm", // Adicionado
                    contatoEmergencia: { nome: "Maria Silva", telefone: "11987654321" },
                    medicamentosUsoContinuo: [
                        { nome: "Losartana", dosagem: "50mg", obs: "Tomar 1x ao dia" },
                        { nome: "Metformina", dosagem: "850mg", obs: "Após o café da manhã" },
                        { nome: "Sinvastatina", dosagem: "20mg", obs: "Antes de dormir" }
                    ],
                    medicamentosAlergicos: [
                        { nome: "Amoxicilina", reacao: "Erupções na pele", obs: "Evitar uso em qualquer dose" },
                        { nome: "Aspirina", reacao: "Falta de ar", obs: "Contraindicado para uso" },
                        { nome: "Dipirona", reacao: "Inchaço no rosto", obs: "Suspender imediatamente" }
                    ],
                    opme: [
                        { nome: "Prótese de quadril", data: "12/05/2023", obs: "Cirurgia realizada no Hospital Central" },
                        { nome: "Stent cardíaco", data: "20/08/2022", obs: "Implante bem-sucedido" },
                        { nome: "Placa de titânio", data: "03/11/2021", obs: "Utilizada em cirurgia de fratura no braço" }
                    ],
                    prontuarios: []
                };
            } else {
                userData = {
                    cpf: cpf,
                    nome: "Novo Usuário",
                    dataNascimento: "",
                    tipoSanguineo: "Não informado",
                    batimentosCardiacos: "N/A", // Adicionado
                    contatoEmergencia: { nome: "", telefone: "" },
                    medicamentosUsoContinuo: [],
                    medicamentosAlergicos: [],
                    opme: [],
                    prontuarios: []
                };
            }
            
            await setDoc(doc(db, "users", user.uid), userData);
            window.location.href = "./Home.html";

        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                alert('Erro: Este CPF já foi cadastrado.');
            } else {
                alert(`Erro ao criar conta: ${error.message}`);
            }
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