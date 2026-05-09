/* ===== DOM ELEMENTS ===== */
const btnAllBooks = document.getElementById("btn-load");
const lista = document.getElementById("bookList");
const navList = document.getElementById("nav-list");
const sectionList = document.getElementById("section-list");
const btnNext = document.getElementById("next");
const btnPrev = document.getElementById("prev");
const navAdd = document.getElementById("nav-add");
const sectionAdd = document.getElementById("section-add");
const btnAddBook = document.getElementById("btn-add");
const inputBookTitle = document.getElementById("title");
const inputBookAuthor = document.getElementById("author");
const inputBookPages = document.getElementById("pages");
const selectBookStatus = document.getElementById("status");
const inputBookRating = document.getElementById("rating");

const navLogout = document.getElementById("nav-logout");

const btnShowLogin = document.getElementById("show-login");
const loginSection = document.getElementById("login-section");
const btnLogin = document.getElementById("btn-login");
const inputLoginEmail = document.getElementById("login-email");
const inputLoginPassword = document.getElementById("login-password");

const btnShowRegister = document.getElementById("show-register");
const registerSection = document.getElementById("register-section");
const btnRegister = document.getElementById("btn-register");
const inputRegisterEmail = document.getElementById("register-email");
const inputRegisterPassword = document.getElementById("register-password");
const inputRegisterName = document.getElementById("register-name");

const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");

const modalEdit = document.getElementById("modalEdit");
const btnModal = document.getElementById("modalButton");
const btnModalCancel = document.getElementById("modalButtonCancel");
const btnModalCancelAlt = document.getElementById("modalButtonCancelAlt");
const modalClose = document.querySelector(".modal-close");
const inputModalBookTitle = document.getElementById("modalTitle");
const inputModalBookAuthor = document.getElementById("modalAuthor");
const inputModalBookPages = document.getElementById("modalPages");
const selectModalBookStatus = document.getElementById("modalStatus");
const inputModalBookRating = document.getElementById("modalRating");

const filterInput = document.getElementById("filterInput");

/* ===== STATE ===== */
let currentPage = 1;
const limit = 8;
let totalPages = 1;
let allBooks = [];
let modalBookId = "";
let userId = "";
let debounceTimer;

/* ===== FUNCTIONS ===== */

async function carregarLivros() {
    if (!userId) {
        console.warn("userId não está definido");
        return;
    }

    try {
        const response = await fetch(`/users/${userId}/books?page=${currentPage}&limit=${limit}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        if (!response.ok) {
            if (response.status === 401) logout();
            showNotification("Erro ao carregar livros", "error");
            return;
        }

        const result = await response.json();
        allBooks = result.data;
        renderizarLivros(allBooks);

        document.getElementById("page-info").textContent = `Página ${result.page} de ${result.totalPages}`;
        totalPages = result.totalPages;
        btnPrev.disabled = currentPage === 1;
        btnNext.disabled = currentPage === totalPages;
    } catch (err) {
        showNotification("Erro de conexão", "error");
        console.error(err);
    }
}

function renderizarLivros(books) {
    lista.innerHTML = "";

    if (books.length === 0) {
        lista.innerHTML = "<li style='grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);'>Nenhum livro encontrado. 📚</li>";
        return;
    }

    books.forEach(book => {
        const item = document.createElement("li");
        const statusMap = { PLANNED: "Para ler", READING: "Lendo", COMPLETE: "Lido" };
        const statusLabel = statusMap[book.status] || book.status;

        item.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Autor:</strong> ${book.author}</p>
            <div class="book-info">
                <span class="book-tag">${book.pages} páginas</span>
                <span class="book-tag">${statusLabel}</span>
                ${book.rating ? `<span class="book-rating">⭐ ${book.rating}/5</span>` : ''}
            </div>
            <div class="book-actions">
                <button class="btn-edit" data-id="${book.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path>
                    </svg>
                    Editar
                </button>
                <button class="btn-delete" data-id="${book.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Deletar
                </button>
            </div>
        `;
        lista.appendChild(item);
    });
}

function tokenRefresh() {
    const token = localStorage.getItem("token");

    if (token) {
        userId = getUserIdFromToken(token);
        appSection.classList.remove("hidden");
        authSection.classList.add("hidden");
        navList.click();
    } else {
        appSection.classList.add("hidden");
        authSection.classList.remove("hidden");
    }
}

function logout() {
    localStorage.removeItem("token");
    userId = "";
    currentPage = 1;
    lista.innerHTML = "";

    inputLoginEmail.value = "";
    inputLoginPassword.value = "";
    inputRegisterEmail.value = "";
    inputRegisterPassword.value = "";
    inputRegisterName.value = "";

    registerSection.classList.remove("active");
    loginSection.classList.add("active");
    btnShowRegister.classList.remove("active");
    btnShowLogin.classList.add("active");

    tokenRefresh();
}

function showNotification(message, type = "error") {
    const notif = document.createElement("div");
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

async function addBook() {
    const title = inputBookTitle.value.trim();
    const author = inputBookAuthor.value.trim();
    const pages = Number(inputBookPages.value);
    const status = selectBookStatus.value;
    const rating = inputBookRating.value ? parseFloat(inputBookRating.value) : null;

    if (!title || !author || !pages || !status) {
        showNotification("Preencha todos os campos obrigatórios", "error");
        return;
    }

    try {
        const response = await fetch("/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ title, author, pages, status, rating })
        });

        if (!response.ok) {
            if (response.status === 401) logout();
            showNotification("Erro ao adicionar livro", "error");
            return;
        }

        inputBookTitle.value = "";
        inputBookAuthor.value = "";
        inputBookPages.value = "";
        selectBookStatus.value = "PLANNED";
        inputBookRating.value = "";

        showNotification("Livro adicionado com sucesso", "success");
        currentPage = 1;
        carregarLivros();
        navList.click();
    } catch (err) {
        showNotification("Erro de conexão", "error");
        console.error(err);
    }
}

async function deleteBook(id) {
    try {
        const response = await fetch(`/book/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) logout();
            showNotification("Erro ao deletar livro", "error");
            return;
        }

        showNotification("Livro deletado com sucesso", "success");
        carregarLivros();
    } catch (err) {
        showNotification("Erro de conexão", "error");
        console.error(err);
    }
}

async function editBook(bookId) {
    const title = inputModalBookTitle.value.trim();
    const author = inputModalBookAuthor.value.trim();
    const pages = Number(inputModalBookPages.value);
    const status = selectModalBookStatus.value;
    const rating = inputModalBookRating.value ? parseFloat(inputModalBookRating.value) : null;

    if (!title || !author || !pages || !status) {
        showNotification("Preencha todos os campos obrigatórios", "error");
        return;
    }

    try {
        const response = await fetch(`/book/${bookId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ title, author, pages, status, rating })
        });

        if (!response.ok) {
            if (response.status === 401) logout();
            showNotification("Erro ao editar livro", "error");
            return;
        }

        showNotification("Livro atualizado com sucesso", "success");
        closeModal();
        carregarLivros();
    } catch (err) {
        showNotification("Erro de conexão", "error");
        console.error(err);
    }
}

function closeModal() {
    modalEdit.classList.add("hidden");
}

function getUserIdFromToken(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    return decoded.id;
}

/* ===== EVENT LISTENERS ===== */

document.addEventListener("DOMContentLoaded", tokenRefresh);

// Navigation
navList.addEventListener("click", () => {
    currentPage = 1;
    sectionList.classList.add("active");
    sectionAdd.classList.remove("active");
    sectionAdd.classList.add("hidden");
    navList.classList.add("active");
    navAdd.classList.remove("active");
    carregarLivros();
});

navAdd.addEventListener("click", () => {
    sectionAdd.classList.remove("hidden");
    sectionAdd.classList.add("active");
    sectionList.classList.remove("active");
    navAdd.classList.add("active");
    navList.classList.remove("active");
});

navLogout.addEventListener("click", logout);

// Pagination
btnNext.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        carregarLivros();
    }
});

btnPrev.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        carregarLivros();
    }
});

btnAllBooks.addEventListener("click", () => {
    currentPage = 1;
    carregarLivros();
});

// Add Book
btnAddBook.addEventListener("click", addBook);

// Books List
lista.addEventListener("click", (e) => {
    if (e.target.closest(".btn-delete")) {
        const bookId = e.target.closest(".btn-delete").getAttribute("data-id");
        deleteBook(bookId);
    }

    if (e.target.closest(".btn-edit")) {
        const bookId = e.target.closest(".btn-edit").getAttribute("data-id");
        const book = allBooks.find(b => b.id === bookId);
        
        if (book) {
            modalEdit.classList.remove("hidden");
            modalBookId = book.id;
            inputModalBookTitle.value = book.title;
            inputModalBookAuthor.value = book.author;
            inputModalBookPages.value = book.pages;
            selectModalBookStatus.value = book.status;
            inputModalBookRating.value = book.rating || "";
        }
    }
});

// Modal
btnModal.addEventListener("click", () => editBook(modalBookId));
btnModalCancel.addEventListener("click", closeModal);
btnModalCancelAlt.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);

modalEdit.addEventListener("click", (e) => {
    if (e.target === modalEdit) closeModal();
});

// Filter
filterInput.addEventListener("input", (e) => {
    const search = filterInput.value.trim();
    clearTimeout(debounceTimer);

    if (search === "") {
        carregarLivros();
        return;
    }

    debounceTimer = setTimeout(async () => {
        try {
            const response = await fetch(`/book/filter?search=${encodeURIComponent(search)}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });

            if (!response.ok) {
                showNotification("Erro ao filtrar", "error");
                return;
            }

            const books = await response.json();
            renderizarLivros(books);
        } catch (err) {
            showNotification("Erro na busca", "error");
            console.error(err);
        }
    }, 500);
});

// Auth - Login
btnShowLogin.addEventListener("click", () => {
    loginSection.classList.add("active");
    registerSection.classList.remove("active");
    btnShowLogin.classList.add("active");
    btnShowRegister.classList.remove("active");
});

btnLogin.addEventListener("click", async () => {
    const email = inputLoginEmail.value.trim();
    const password = inputLoginPassword.value;

    if (!email || !password) {
        showNotification("Preencha email e senha", "error");
        return;
    }

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            showNotification(error.message || "Email ou senha incorretos", "error");
            return;
        }

        const result = await response.json();
        const token = result.token;
        userId = getUserIdFromToken(token);

        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        inputLoginEmail.value = "";
        inputLoginPassword.value = "";

        showNotification("Login realizado com sucesso", "success");
        tokenRefresh();
    } catch (err) {
        showNotification("Erro de conexão", "error");
        console.error(err);
    }
});

// Auth - Register
btnShowRegister.addEventListener("click", () => {
    registerSection.classList.add("active");
    loginSection.classList.remove("active");
    btnShowRegister.classList.add("active");
    btnShowLogin.classList.remove("active");
});

btnRegister.addEventListener("click", async () => {
    const email = inputRegisterEmail.value.trim();
    const password = inputRegisterPassword.value;
    const name = inputRegisterName.value.trim();

    if (!email || !password) {
        showNotification("Preencha email e senha", "error");
        return;
    }

    try {
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name })
        });

        if (!response.ok) {
            const error = await response.json();
            showNotification(error.message || "Erro ao cadastrar", "error");
            return;
        }

        const result = await response.json();
        const token = result.token;
        userId = getUserIdFromToken(token);

        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        inputRegisterEmail.value = "";
        inputRegisterPassword.value = "";
        inputRegisterName.value = "";

        showNotification("Cadastro realizado com sucesso", "success");
        tokenRefresh();
    } catch (err) {
        showNotification("Erro de conexão", "error");
        console.error(err);
    }
});
