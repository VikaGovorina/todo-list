
import {saveData} from './storage.js';


class ProjectUI {
    constructor(project, allProjects) {
        this.project = project;
        this.allProjects = allProjects;
        this.editingTodo = null;
        this.init();
    }

    init() {
        this.updateProjectContent(this.project);
        this.setUpListeners();
    }

    updateProjectContent(project) {
        this.project = project;
        this.updateProjectName();
        this.displayTodos();
    }

    updateProjectName() {
        const projectName = document.getElementById('project-name');
        projectName.textContent = this.project.title;
    }

    setUpListeners() {
        const newTodoBtn = document.getElementById('add-todo-btn');

        const dialogs = document.querySelectorAll('.dialog');
        const todoItemDialog = dialogs[1];

        const cancelBtns = document.querySelectorAll('.cancel-btn');
        const cancelBtn = cancelBtns[1];
        const submitBtns = document.querySelectorAll('.submit-btn');
        const submitBtn = submitBtns[1];

        const todoForms = document.querySelectorAll('.dialog form');
        const todoForm = todoForms[1];

        newTodoBtn.addEventListener('click', () => {
            this.editingTodo = null;
            todoItemDialog.showModal();
        });

        cancelBtn.addEventListener('click', () => {
            todoItemDialog.close();
        });

        submitBtn.addEventListener('click', (event) => {
            event.preventDefault();

            const title = document.getElementById('todo-title').value;
            const description = document.getElementById('description').value;

            const dueDate = document.getElementById('due').value;
            const priority = document.getElementById('priority').selectedOptions[0].text;
            const notes = document.getElementById('notes').value;

            if (!this.editingTodo) {
                this.project.addTodoToList(title, description, dueDate, priority, notes);
            } else {
                Object.assign(this.editingTodo, {title, description, dueDate, priority, notes});
                this.editingTodo = null;
            }

            todoItemDialog.close();
            todoForm.reset();

            this.displayTodos();
        });
    }

    formatData(dueDate) {
        if (dueDate) {
            return new Date(dueDate).toDateString();
        }
        return "No Date";
    }

    displayTodos() {
        const todoContainer = document.querySelector('.todo-field');
        todoContainer.innerHTML = '';

        this.project.todoList.forEach(todoItem => {
            const card = this.createTodoCard(todoItem);
            todoContainer.append(card);
        });

        saveData(this.allProjects);
    }

    createTodoCard(todoItem) {
        const card = document.createElement('div');
        card.className = 'todo-card';
        card.dataset.todoId = todoItem.id;
        if (todoItem.completed) {
            card.classList.add('completed');
        }

        const header = this.createTodoCardHeader(todoItem);
        const meta = this.createTodoCardMeta(todoItem);
        
        const description = document.createElement('p');
        description.textContent = todoItem.description;

        card.append(header, meta, description);

        card.classList.toggle('medium', todoItem.priority === "Medium");
        card.classList.toggle('hard', todoItem.priority === "Hard");

        return card;
    }

    createTodoCardHeader(todoItem) {
        const card = document.createElement('div');
        card.className = 'todo-card-header';

        const title = document.createElement('h3');
        title.textContent = todoItem.title;

        const cardBtns = this.createTodoCardBtns(todoItem);

        card.append(title, cardBtns);
        return card;
    }

    createTodoCardMeta(todoItem) {
        const card = document.createElement('div');
        card.className = 'todo-card-meta';

        const due = document.createElement('span');
        due.textContent = "🗓️ " + this.formatData(todoItem.dueDate);


        const priority = document.createElement('span');
        priority.textContent = todoItem.priority.toUpperCase();

        card.append(due, priority);
        return card;
    }

    deleteTodo(todoId) {
        this.project.todoList = this.project.todoList.filter(td => td.id !== todoId);
        this.displayTodos();
    }

    createTodoCardBtns(todoItem) {
        const card = document.createElement('div');
        card.className = 'todo-card-btns';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-todo";
        deleteBtn.addEventListener('click', () => {
            const confirmed = confirm(`Delete todo "${todoItem.title}"?`);
            if (confirmed) {
                this.deleteTodo(todoItem.id);
            }
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = "Edit";
        editBtn.className = "edit-todo";
        editBtn.addEventListener('click', () => {
            this.editTodo(todoItem);
        });

        const completeBtn = document.createElement('button');
        completeBtn.textContent = "Complete";
        completeBtn.className = "complete-todo";
        completeBtn.addEventListener('click', () => {
            todoItem.toggleCompleteness();
            this.updateTodoCardStyle(todoItem.id, todoItem.completed);
            saveData(this.allProjects);
        });

        card.append(completeBtn, editBtn, deleteBtn);
        return card;
    }

    editTodo(todoItem) {
        const dialogs = document.querySelectorAll('.dialog');
        const todoItemDialog = dialogs[1];

        document.getElementById('todo-title').value = todoItem.title;
        document.getElementById('description').value = todoItem.description;
        document.getElementById('due').value = todoItem.dueDate;
        document.getElementById('priority').value = todoItem.priority === "Low" ? "default" : todoItem.priority.toLowerCase();
        document.getElementById('notes').value = todoItem.notes;

        this.editingTodo = todoItem;
        todoItemDialog.showModal(); 
    }

    updateTodoCardStyle(todoId, completed) {
        const card = document.querySelector(`[data-todo-id="${todoId}"]`);
        card.classList.toggle('completed', completed);
    }
}

export {ProjectUI};