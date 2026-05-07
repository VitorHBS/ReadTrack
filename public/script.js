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

//Modal 
const modalEdit = document.getElementById("modalEdit");
const btnModal = document.getElementById("modalButton");
const btnModalCancel = document.getElementById("modalButtonCancel");
const inputModalBookTitle = document.getElementById("modalTitle");
const inputModalBookAuthor = document.getElementById("modalAuthor");
const inputModalBookPages = document.getElementById("modalPages");
const selectModalBookStatus = document.getElementById("modalStatus");
const inputModalBookRating = document.getElementById("modalRating");

// Input do Filtro
const filterInput = document.getElementById("filterInput");

let allBooks = [];
let modalBookId = "";
let userId = "";

// -------------------  STATE ----------------------------
let currentPage = 1;
const limit = 5;
let totalPages = 1;

// -------------------  FUNCTIONS ----------------------------
async function carregarLivros() {

    if (!userId) {
        console.warn("userId não está definido");
        return;
    }

    const response = await fetch(`/users/${userId}/books?page=${currentPage}&limit=${limit}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    console.log("Carregando livros para userId:", userId);

    if (!response.ok) {
        if (response.status === 401) {
            logout(); // Token expirou
        }
        alert("Erro ao carregar livros");
        return;
    }

    const result = await response.json();
    allBooks = result.data

    lista.innerHTML = "";

    if (result.data.length === 0) {
        lista.innerHTML = "<p>Nenhum livro encontrado.</p>";
        return
    }

    result.data.forEach(book => {
        const item = document.createElement("li");
        item.innerHTML = `
          <div id="divBook" class="book-item">
            <div>
                <h3>${book.title}</h3>
                <p>Autor: ${book.author}</p>
                <p>Páginas: ${book.pages}</p>
                <p>Status: ${book.status}</p>
                <p>Nota: ${book.rating ?? "Sem nota"}</p>
            </div>
            <div class="book-actions">
                <button class="btn-edit" data-id="${book.id}">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/>
                    </svg>
                    Editar
                </button>
                <button class="btn-delete" data-id="${book.id}">
                    <svg class="icon "xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Deletar
                </button>
            </div>
         </div>`;
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
        userId = getUserIdFromToken(token);

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
    userId = "";
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
    const rating = inputBookRating.value ? parseFloat(inputBookRating.value) : null;

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

async function deleteBook(id) {

    try {
        const response = await fetch(`/book/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })

        if (!response.ok) {
            if (response.status === 401) {
                logout()
            }
            console.log(response.status)
            showNotification("Error ao deletar livro", "error")
            return
        }

        carregarLivros()
        showNotification("Livro deletado com sucesso", "success")

    } catch (err) {
        showNotification("Erro de conexão!", "error")
    }
}


async function editBook(modalBookId) {

    const title = inputModalBookTitle.value;
    const author = inputModalBookAuthor.value;
    const pages = Number(inputModalBookPages.value);
    const status = selectModalBookStatus.value;
    const rating = inputModalBookRating.value ? parseFloat(inputModalBookRating.value) : null;

    if (!title || !author || !pages || !status) {
        showNotification("Preencha todos os campos", "error");
        return;
    }

    try {
        const response = await fetch(`/book/${modalBookId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ title: title, author: author, pages: pages, status: status, rating: rating })
        })

        if (!response.ok) {
            if (response.status === 401) {
                showNotification("Sessão expirada");
                logout()
            }
            console.log(response.status)
            showNotification("Erro ao editar livro", "error");
            return
        }

        showNotification("Livro atualizado", "success")
        modalEdit.classList.add("hidden");

        carregarLivros()

    } catch (err) {

    }

}

function getUserIdFromToken(token) {
    const base64Url = token.split(".")[1];

    // converte base64url -> base64
    const base64 = base64Url
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, "=");

    const decoded = JSON.parse(atob(base64));

    return decoded.id;
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

            const token = result.token;
            const decodedUserId = getUserIdFromToken(token);

            userId = decodedUserId

            localStorage.setItem("token", token)
            localStorage.setItem("userId", decodedUserId);

            console.log(result)

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
        console.log(err)
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

            showNotification("Cadastrado com sucesso", "success")

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


//botão de deletar livro
lista.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
        const bookId = e.target.getAttribute("data-id");
        deleteBook(bookId)
    }
})

//botao de editar livro
lista.addEventListener("click", (e) => {

    const button = e.target.closest(".btn-edit");

    if (button) {

        const bookId = button.getAttribute("data-id");

        for (let i = 0; i < allBooks.length; i++) {
            if (allBooks[i].id === bookId) {
                const result = allBooks[i]
                modalEdit.classList.remove("hidden")
                modalBookId = allBooks[i].id
                inputModalBookTitle.value = result.title;
                inputModalBookAuthor.value = result.author;
                inputModalBookPages.value = result.pages;
                selectModalBookStatus.value = result.status
                inputModalBookRating.value = result.rating
            }
            break
        }
    }
})

btnModal.addEventListener("click", () => editBook(modalBookId));


btnModalCancel.addEventListener("click", () => {
    modalEdit.classList.add("hidden");
})


filterInput.addEventListener("input", (e) => {
    const divBook = document.getElementById("divBook");

    if(filterInput.value !== "") {
        divBook.classList.add("hidden");
    } else {
        carregarLivros()
    }

    while (filterInput.value !== "") {
        
    }
})

// ------------------- INIT ----------------------------



