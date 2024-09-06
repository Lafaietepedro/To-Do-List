// SELEÇÃO DE ELEMENTOS
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

const backgroundImages = [
    
]

//FUNÇÕES
// saveTodo(): Adiciona uma nova tarefa à lista e a salva no LocalStorage.
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done });
  }

  todoList.appendChild(todo);

  todoInput.value = "";

  todoInput.focus();
};

// toggleForms(): Alterna entre o formulário de adição e o de edição de tarefas.
const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

// updateTodo(): Atualiza uma tarefa existente tanto na interface quanto no LocalStorage.
const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

// getSearchTodos(): Filtra as tarefas com base no texto inserido no campo de pesquisa.
const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    const normalizedSearch = search.toLowerCase();

    todo.style.display = "flex";

    if (!todoTitle.includes(normalizedSearch)) {
      todo.style.display = "none";
    }
  });
};

// filterTodos(): Filtra as tarefas por status (concluídas ou pendentes).
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};

//EVENTOS
// submit no todoForm: Quando o formulário é submetido, a função saveTodo() é chamada.
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

// click nos botões de cada tarefa: Lida com marcar como concluída, remover ou editar uma tarefa.
document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();

  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

// keyup no searchInput: Filtra as tarefas conforme o usuário digita no campo de busca.
searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

// change no filterBtn: Aplica o filtro selecionado para exibir todas as tarefas, feitas ou pendentes.
filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// LOCAL STORAGE //
// getTodosLocalStorage(): Recupera a lista de tarefas do LocalStorage.
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

// loadTodos(): Carrega as tarefas do LocalStorage ao iniciar a aplicação.
const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

// saveTodoLocalStorage(): Salva uma nova tarefa no LocalStorage.
const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

// removeTodoLocalStorage(): Remove uma tarefa do LocalStorage.
const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text !== todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

// updateTodoStatusLocalStorage(): Atualiza o status de uma tarefa (concluída ou pendente) no LocalStorage.
const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

// updateTodoLocalStorage(): Atualiza o texto de uma tarefa no LocalStorage.
const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();