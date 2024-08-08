const apiUrl = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorId = urlParams.get('authorId');

    if (authorId) {
        loadAuthor(authorId);
    }

    document.getElementById('author-form').addEventListener('submit', saveAuthor);
});

async function loadAuthor(id) {
    const response = await fetch(`${apiUrl}/authors/${id}`);
    const author = await response.json();

    document.getElementById('author-id').value = author.id;
    document.getElementById('author-name').value = author.name;
    document.getElementById('author-bio').value = author.bio;
}

async function saveAuthor(event) {
    event.preventDefault();
    const id = document.getElementById('author-id').value;
    const name = document.getElementById('author-name').value;
    const bio = document.getElementById('author-bio').value;

    const author = { name, bio };

    if (id) {
        await fetch(`${apiUrl}/authors/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(author)
        });
        alert('Author updated successfully!');
    }

    window.location.href = './';
}