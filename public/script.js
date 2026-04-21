// -------------------  DOM ----------------------------
const btnAllBooks = document.getElementById("btn-load");
const lista = document.getElementById("bookList");

// Listagem
const navList = document.getElementById("nav-list");
const sectionList = document.getElementById("section-list");
const btnNext = document.getElementById("next")
const btnPrev = document.getElementById("prev")


// Adicionar
const navAdd = document.getElementById("nav-add")
const sectionAdd = document.getElementById("section-add")

// -------------------  STATE ----------------------------
let currentPage = 1;
const limit = 5;
let totalPages = 1;

// -------------------  FUNCTIONS ----------------------------
async function  carregarLivros(){
    const response = await fetch(`/books?page=${currentPage}&limit=${limit}`);
    const result = await response.json();

    lista.innerHTML = "";

    if(result.data.length === 0){
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

// ------------------- EVENTS ----------------------------

btnAllBooks.addEventListener("click", () => {
    currentPage = 1;
    carregarLivros()
})

//Próxima pagina
btnNext.addEventListener("click", () => {
    if(currentPage < totalPages){
        currentPage++;
        atualizarLista()
    }
})

//voltar pagina
btnPrev.addEventListener("click", () => {
    if(currentPage > 1){
        currentPage --;
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


// ------------------- INIT ----------------------------

carregarLivros()


