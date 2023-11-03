const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findIndexBook(bookId) {
  for (const indexBook in books) {
    if (books[indexBook].id === bookId) {
      return indexBook;
    }
  }
  return -1;
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget === null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTaskToCompleted(bookId) {
  const bookTarget = findIndexBook(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

  const generateID = generateId();
  const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, bookIsComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = bookObject.year;

  const containerButton = document.createElement('div');
  containerButton.classList.add('action');

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(textTitle, textAuthor, textYear, containerButton);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const completeButton = document.createElement('button');
    completeButton.classList.add('green');
    completeButton.innerText = 'Belum selesai di Baca';

    completeButton.addEventListener('click', () => {
      undoTaskToCompleted(bookObject.id);
      searchBookDisplay();
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus buku';

    deleteButton.addEventListener('click', () => {
      removeTaskToCompleted(bookObject.id);
      searchBookDisplay();
    });

    containerButton.append(completeButton, deleteButton);
  } else {
    const unCompleteButton = document.createElement('button');
    unCompleteButton.classList.add('green');
    unCompleteButton.innerText = 'Selesai di Baca';

    unCompleteButton.addEventListener('click', () => {
      addTaskToCompleted(bookObject.id);
      searchBookDisplay();
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus Buku';

    deleteButton.addEventListener('click', () => {
      removeTaskToCompleted(bookObject.id);
      searchBookDisplay();
    });

    containerButton.append(unCompleteButton, deleteButton);
  }
  return container;
}

function searchBookDisplay() {
  const inputSearch = document.getElementById('searchBookTitle');
  const textSearch = inputSearch.value.toLowerCase();

  const inCompletedBook = document.getElementById('incompleteBookshelfList');
  inCompletedBook.innerHTML = '';

  const completedBook = document.getElementById('completeBookshelfList');
  completedBook.innerHTML = '';

  for (const bookItem of books) {
    const title = bookItem.title.toLowerCase();

    if (title.includes(textSearch)) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isCompleted) {
        inCompletedBook.append(bookElement);
      } else {
        completedBook.append(bookElement);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('inputBook');
  const inputSearch = document.getElementById('searchBook');

  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });

  inputSearch.addEventListener('input', () => {
    searchBookDisplay();
  });
});

document.addEventListener(RENDER_EVENT, () => {
  console.log(books);
  const inCompletedBook = document.getElementById('incompleteBookshelfList');
  inCompletedBook.innerHTML = '';

  const completedBook = document.getElementById('completeBookshelfList');
  completedBook.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      inCompletedBook.append(bookElement);
    } else {
      completedBook.append(bookElement);
    }
  }
});
