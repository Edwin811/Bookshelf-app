
const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

function loadBooks() {
  const data = localStorage.getItem(STORAGE_KEY);
  books = data ? JSON.parse(data) : [];
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function generateId() {
  return +new Date();
}

function createBookElement(book) {
  const bookDiv = document.createElement('div');
  bookDiv.setAttribute('data-bookid', book.id);
  bookDiv.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.textContent = `Penulis: ${book.author}`;

  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.textContent = `Tahun: ${book.year}`;

  const actionDiv = document.createElement('div');

  const isCompleteBtn = document.createElement('button');
  isCompleteBtn.setAttribute('data-testid', 'bookItemIsCompleteButton');
  isCompleteBtn.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  isCompleteBtn.addEventListener('click', () => toggleBookComplete(book.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteBtn.textContent = 'Hapus Buku';
  deleteBtn.addEventListener('click', () => deleteBook(book.id));

  const editBtn = document.createElement('button');
  editBtn.setAttribute('data-testid', 'bookItemEditButton');
  editBtn.textContent = 'Edit Buku';
  editBtn.addEventListener('click', () => editBook(book.id));

  actionDiv.appendChild(isCompleteBtn);
  actionDiv.appendChild(deleteBtn);
  actionDiv.appendChild(editBtn);

  bookDiv.appendChild(title);
  bookDiv.appendChild(author);
  bookDiv.appendChild(year);
  bookDiv.appendChild(actionDiv);

  return bookDiv;
}

function renderBooks(filter = '') {
  const incompleteSection = document.querySelector('section:nth-of-type(3)');
  const completeSection = document.querySelector('section:nth-of-type(4)');
  const incompleteList = document.getElementById('incompleteBookList');
  const completeList = document.getElementById('completeBookList');
  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  let incompleteCount = 0;
  let completeCount = 0;

  books
    .filter(book => book.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(book => {
      const bookElem = createBookElement(book);
      bookElem.classList.add('book-item');
      if (book.isComplete) {
        completeList.appendChild(bookElem);
        completeCount++;
      } else {
        incompleteList.appendChild(bookElem);
        incompleteCount++;
      }
    });

  if (incompleteTitle) {
    if (incompleteCount === 0) {
      incompleteTitle.classList.add('hidden');
    } else {
      incompleteTitle.classList.remove('hidden');
    }
  }
  if (completeTitle) {
    if (completeCount === 0) {
      completeTitle.classList.add('hidden');
    } else {
      completeTitle.classList.remove('hidden');
    }
  }

  if (incompleteSection) {
    if (incompleteCount === 0) {
      incompleteSection.classList.add('hidden');
    } else {
      incompleteSection.classList.remove('hidden');
    }
  }
  if (completeSection) {
    if (completeCount === 0) {
      completeSection.classList.add('hidden');
    } else {
      completeSection.classList.remove('hidden');
    }
  }

  const main = document.querySelector('main');
  if (filter && incompleteSection && completeSection && main) {
    if (incompleteCount > 0 && completeCount > 0) {
      main.insertBefore(incompleteSection, completeSection);
    } else if (incompleteCount > 0) {
      main.insertBefore(incompleteSection, completeSection.nextSibling);
    } else if (completeCount > 0) {
      main.insertBefore(completeSection, incompleteSection.nextSibling);
    }
  }
}

function handleAddBook(e) {
  e.preventDefault();
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = Number(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  if (year < 0) {
    alert('Tahun tidak boleh minus!');
    return;
  }

  if (editingBookId) {
    const book = books.find(b => b.id == editingBookId);
    if (book) {
      book.title = title;
      book.author = author;
      book.year = year;
      book.isComplete = isComplete;
    }
    editingBookId = null;
    document.getElementById('bookFormSubmit').textContent = 'Masukkan Buku ke rak ' + (isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca');
  } else {
    const newBook = {
      id: generateId(),
      title,
      author,
      year,
      isComplete
    };
    books.push(newBook);
  }
  saveBooks();
  renderBooks();
  document.getElementById('bookForm').reset();
}

function editBook(id) {
  const book = books.find(b => b.id == id);
  if (book) {
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;
    editingBookId = id;
    document.getElementById('bookFormSubmit').textContent = 'Simpan Perubahan';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function toggleBookComplete(id) {
  const book = books.find(b => b.id == id);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks();
  }
}

function deleteBook(id) {
  books = books.filter(b => b.id != id);
  saveBooks();
  renderBooks();
}

function handleSearchBook(e) {
  e.preventDefault();
  const searchValue = document.getElementById('searchBookTitle').value;
  renderBooks(searchValue);
}

function resetFormIfNotEditing() {
  if (!editingBookId) {
    document.getElementById('bookForm').reset();
    document.getElementById('bookFormSubmit').textContent = 'Masukkan Buku ke rak Belum selesai dibaca';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadBooks();
  renderBooks();
  document.getElementById('bookForm').addEventListener('submit', handleAddBook);
  document.getElementById('searchBook').addEventListener('submit', handleSearchBook);
  document.getElementById('bookForm').addEventListener('reset', resetFormIfNotEditing);
  document.getElementById('incompleteBookList').classList.add('book-list');
  document.getElementById('completeBookList').classList.add('book-list');
});
