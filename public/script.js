// -------------------  DOM ----------------------------
const btnAllBooks = document.getElementById("btn-load");
const lista = document.getElementById("bookList");

// Listagem
const navList = document.getElementById("nav-list");
const sectionList = document.getElementById("section-list");
const btnNext = document.getElementById("next");
const btnPrev = document.getElementById("prev");


// Adicionar
const navAdd = document.getElementById("nav-add");
const sectionAdd = document.getElementById("section-add");

//logout
const navLogout = document.getElementById("nav-logout")

// Seção de login 
const btnShowLogin = document.getElementById("show-login");
const loginSection = document.getElementById("login-section");
const btnLogin = document.getElementById("btn-login")
const inputEmail = document.getElementById("login-email");
const inputPassword = document.getElementById("login-password");

// Seção de register

const btnRegister = document.getElementById("show-register");
const registerSection = document.getElementById("register-section");

// Páginas do HTML

const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");

// -------------------  STATE ----------------------------
let currentPage = 1;
const limit = 5;
let totalPages = 1;

// -------------------  FUNCTIONS ----------------------------
async function carregarLivros() {
    const response = await fetch(`/books?page=${currentPage}&limit=${limit}`);
    const result = await response.json();

    lista.innerHTML = "";

    if (result.data.length === 0) {
        lista.innerHTML = "<p>Nenhum livro encontrado.</p>";
        return
    }

    result.data.forEach(book => {
        const item = document.createElement("li");
        item.innerHTML = `
          <div>
            <h3>${book.title}</h3>
            <p>Autor: ${book.author}</p>
            <p>Páginas: ${book.pages}</p>
            <p>Status: ${book.status}</p>
            <p>Nota: ${book.rating ?? "Sem nota"}</p>
        </div>
        `;
        lista.appendChild(item);


    });

    document.getElementById("page-info").textContent =
        `Página ${result.page} de ${result.totalPages}`

    totalPages = result.totalPages;

    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage === totalPages;
};


function atualizarLista() {
    carregarLivros();
}

function tokenRefresh() {
    const token = localStorage.getItem("token");

    if (token) {
        appSection.classList.remove("hidden");
        authSection.classList.add("hidden");
    } else {
        appSection.classList.add("hidden");
        authSection.classList.remove("hidden");
    }
}


function logout() {
    localStorage.removeItem("token");
    tokenRefresh();
}

// ------------------- EVENTS ----------------------------

document.addEventListener("DOMContentLoaded", tokenRefresh);

btnAllBooks.addEventListener("click", () => {
    currentPage = 1;
    carregarLivros()
})

//Próxima pagina
btnNext.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        atualizarLista()
    }
})

//voltar pagina
btnPrev.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        atualizarLista()
    }
})

// navegar para seção Listar Livros
navList.addEventListener("click", () => {
    currentPage = 1
    sectionList.classList.remove("hidden");
    sectionAdd.classList.add("hidden");
    carregarLivros()
})

//navegar para a seção Adicionar Livro
navAdd.addEventListener("click", () => {
    sectionAdd.classList.remove("hidden");
    sectionList.classList.add("hidden");
    currentPage = 1
})


btnShowLogin.addEventListener("click", () => {
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    btnRegister.classList.remove("active");
    btnShowLogin.classList.add("active");
})

btnRegister.addEventListener("click", () => {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");

    btnShowLogin.classList.remove("active");
    btnRegister.classList.add("active");
})


btnLogin.addEventListener("click", async () => {
    const email = inputEmail.value;
    const password = inputPassword.value;

    const response = await fetch("/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password: password })
        });

    if (response.ok) {
        const result = await response.json();
        const token = result.token
        localStorage.setItem("token", token)

        appSection.classList.remove("hidden");
        authSection.classList.add("hidden");

    }
})

navLogout.addEventListener("click", logout);


// ------------------- INIT ----------------------------

carregarLivros()


