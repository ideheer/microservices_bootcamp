const apiUrl = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  loadAuthors();
  loadBooks();

  document.getElementById("author-form").addEventListener("submit", saveAuthor);
  document.getElementById("book-form").addEventListener("submit", saveBook);
});

async function loadAuthors() {
  const response = await fetch(`${apiUrl}/authors`);
  const authors = await response.json();

  const authorList = document.getElementById("author-list");
  const bookAuthorSelect = document.getElementById("book-author");

  authorList.innerHTML = "";
  bookAuthorSelect.innerHTML = "";

  authors.forEach((author) => {
    const li = document.createElement("li");

    const authorLink = document.createElement("a");
    authorLink.href = `author.html?authorId=${author.id}`;
    authorLink.textContent = author.name;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteAuthor(author.id);

    li.appendChild(authorLink);
    li.appendChild(deleteButton);
    authorList.appendChild(li);

    const option = document.createElement("option");
    option.value = author.id;
    option.textContent = author.name;
    bookAuthorSelect.appendChild(option);
  });
}

async function loadBooks() {
  const response = await fetch(`${apiUrl}/books`);
  const books = await response.json();

  const bookList = document.getElementById("book-list");
  bookList.innerHTML = "";

  books.forEach((book) => {
    const li = document.createElement("li");
    li.textContent = `${book.title} - ${book.summary} (Author ID: ${book.authorId}, Published: ${book.datePublished})`;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => editBook(book);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteBook(book.id);

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    bookList.appendChild(li);
  });
}

async function saveAuthor(event) {
  event.preventDefault();
  const id = document.getElementById("author-id").value;
  const name = document.getElementById("author-name").value;
  const bio = document.getElementById("author-bio").value;

  const author = { name, bio };

  if (id) {
    await fetch(`${apiUrl}/authors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(author),
    });
  } else {
    await fetch(`${apiUrl}/authors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(author),
    });
  }

  document.getElementById("author-form").reset();
  loadAuthors();
}

async function saveBook(event) {
  event.preventDefault();
  const id = document.getElementById("book-id").value;
  const title = document.getElementById("book-title").value;
  const summary = document.getElementById("book-summary").value;
  const authorId = document.getElementById("book-author").value;
  const publisheddate = document.getElementById("book-datePublished").value;

  const book = { title, summary, authorId, publisheddate };

  if (id) {
    await fetch(`${apiUrl}/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
  } else {
    await fetch(`${apiUrl}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
  }

  document.getElementById("book-form").reset();
  loadBooks();
}

async function deleteAuthor(id) {
  await fetch(`${apiUrl}/authors/${id}`, { method: "DELETE" });
  loadAuthors();
}

async function editBook(book) {
  document.getElementById("book-id").value = book.id;
  document.getElementById("book-title").value = book.title;
  document.getElementById("book-summary").value = book.summary;
  document.getElementById("book-author").value = book.authorId;
  document.getElementById("book-datePublished").value = book.datePublished;
}

async function deleteBook(id) {
  await fetch(`${apiUrl}/books/${id}`, { method: "DELETE" });
  loadBooks();
}
