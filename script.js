const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = JSON.parse(localStorage.getItem("quickNotes")) || [];

function saveNotes() {
  localStorage.setItem("quickNotes", JSON.stringify(notes));
}

function renderNotes(notesToDisplay = notes) {
  notesList.innerHTML = "";

  if (notesToDisplay.length === 0) {
    if (notes.length > 0 && searchInput.value.trim() !== "") {
      const noResults = document.createElement("li");
      noResults.textContent = "No notes match your search.";
      notesList.appendChild(noResults);
    }

    updateNoteCount();
    return;
  }

  notesToDisplay.forEach(function (note) {
    const listItem = document.createElement("li");
    listItem.classList.add("note");
    listItem.classList.add(`category-${note.category}`);

    const content = document.createElement("div");
    content.classList.add("note-content");

    const noteText = document.createElement("span");
    noteText.textContent = note.text;

    const categoryLabel = document.createElement("small");
    categoryLabel.classList.add("note-category");
    categoryLabel.textContent =
      note.category.charAt(0).toUpperCase() + note.category.slice(1);

    const dateLabel = document.createElement("small");
    dateLabel.classList.add("note-date");
    dateLabel.textContent = note.createdAt;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    deleteButton.addEventListener("click", function () {
      deleteNote(note.id);
    });

    content.appendChild(noteText);
    content.appendChild(categoryLabel);
    content.appendChild(dateLabel);

    listItem.appendChild(content);
    listItem.appendChild(deleteButton);

    notesList.appendChild(listItem);
  });

  updateNoteCount();
}

function updateNoteCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

function addNote(text, category) {
  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(newNote);
  saveNotes();
  renderNotes();
}

function deleteNote(id) {
  notes = notes.filter(function (note) {
    return note.id !== id;
  });

  saveNotes();
  renderNotes();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  errorMessage.textContent = "";

  if (text === "") {
    errorMessage.textContent = "Please enter a note.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Note must be 200 characters or less.";
    return;
  }

  addNote(text, category);

  noteInput.value = "";
  errorMessage.textContent = "";
  noteInput.focus();
});

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter(function (note) {
    return note.text.toLowerCase().includes(searchTerm);
  });

  renderNotes(filteredNotes);
});

renderNotes();
