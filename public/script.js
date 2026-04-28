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
const btnAddBook = document.getElementById("btn-add");
const inputBookTitle = document.getElementById("title");
const inputBookAuthor = document.getElementById("author");
const inputBookPages = document.getElementById("pages");
const selectBookStatus = document.getElementById("status");
const inputBookRating = document.getElementById("rating");

//logout
const navLogout = document.getElementById("nav-logout")

// Seção de login 
const btnShowLogin = document.getElementById("show-login");
const loginSection = document.getElementById("login-section");
const btnLogin = document.getElementById("btn-login")
const inputLoginEmail = document.getElementById("login-email");
const inputLoginPassword = document.getElementById("login-password");

// Seção de register
const btnShowRegister = document.getElementById("show-register");
const registerSection = document.getElementById("register-section");
const btnRegister = document.getElementById("btn-register");
const inputRegisterEmail = document.getElementById("register-email");
const inputRegisterPassword = document.getElementById("register-password");
const inputRegisterName = document.getElementById("register-name");

// Páginas do HTML
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");

// -------------------  STATE ----------------------------
let currentPage = 1;
const limit = 5;
let totalPages = 1;

// -------------------  FUNCTIONS ----------------------------
async function carregarLivros() {
    const response = await fetch(`/books?page=${currentPage}&limit=${limit}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            logout(); // Token expirou
        }
        alert("Erro ao carregar livros");
        return;
    }

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
        carregarLivros();
    } else {
        appSection.classList.add("hidden");
        authSection.classList.remove("hidden");
    }
}


function logout() {
    localStorage.removeItem("token");
    tokenRefresh();

    lista.innerHTML = "";
    currentPage = 1

    inputLoginEmail.value = "";
    inputLoginPassword.value = "";

    inputRegisterEmail.value = ""
    inputRegisterPassword.value = ""
    inputRegisterName.value = ""

    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    btnShowRegister.classList.remove("active");
    btnShowLogin.classList.add("active");
}

function showNotification(message, type = "error") {
    const notif = document.createElement("div");
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => notif.remove(), 3000);
}

async function addBook() {

    const title = inputBookTitle.value;
    const author = inputBookAuthor.value;
    const pages = Number(inputBookPages.value);
    const status = selectBookStatus.value;
    const rating = inputBookRating.value ? Number(inputBookRating) : null;

    if (!title || !author || !pages || !status) {
        showNotification("Preencha todos os campos", "error");
        return;
    }

    try {
        const response = await fetch("/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                title: title, author: author, pages: pages, status: status, rating: rating
            })
        })

        console.log(response.status)

        if (!response.ok) {
            if (response.status === 401) /*token expirour*/ {
                logout()
            }
            console.log(response.status)
            showNotification("Error ao adicionar livro", "error")
            return
        }

        inputBookTitle.value = "";
        inputBookAuthor.value = "";
        inputBookPages.value = "";
        selectBookStatus.value = "";
        inputBookRating.value = "";

        carregarLivros()
        showNotification("Livro adicionado com sucesso", "success")

    } catch (err) {
        showNotification("Erro de conexão!", "error")
    }
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

btnAddBook.addEventListener("click", addBook);


btnShowLogin.addEventListener("click", () => {
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    btnShowRegister.classList.remove("active");
    btnShowLogin.classList.add("active");
})

btnShowRegister.addEventListener("click", () => {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");

    btnShowLogin.classList.remove("active");
    btnShowRegister.classList.add("active");
})


btnLogin.addEventListener("click", async () => {
    const email = inputLoginEmail.value;
    const password = inputLoginPassword.value;

    if (!email || !password) {
        showNotification("Preencha todos os campos", "error");
        return
    }

    try {
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

            showNotification("Login realizado com sucesso!", "success");

            inputLoginEmail.value = "";
            inputLoginPassword.value = "";

            tokenRefresh()

        } else {
            const erro = await response.json();
            console.log("Erro:", erro);
            showNotification("Email ou senha incorretos", "error");
        }
    } catch (err) {
        showNotification("Erro de conexão. Tente novamente.", "error");
    }
})

btnRegister.addEventListener("click", async () => {
    const email = inputRegisterEmail.value;
    const password = inputRegisterPassword.value;
    const name = inputRegisterName.value;

    if (!email || !password) {
        showNotification("Preencha o campo do Email e Senha", "error");
        return
    }

    try {
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password: password, name: name, })
        });

        if (response.ok) {
            const result = await response.json();
            const token = result.token;
            localStorage.setItem("token", token);

            inputRegisterEmail.value = ""
            inputRegisterPassword.value = ""
            inputRegisterName.value = ""

            tokenRefresh()
        } else {
            const erro = await response.json();
            console.log("Erro:", erro);
            showNotification("Email ou senha inválidos", "error");
        }
    } catch (err) {
        showNotification("Erro de conexão. Tente novamente.", "error");
    }

})

navLogout.addEventListener("click", logout);


// ------------------- INIT ----------------------------



