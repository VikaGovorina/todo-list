
class TodoItem {
    constructor(id, title, description, dueDate, priority, notes) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.completed = false;
    }

    toggleCompleteness() {
        this.completed = !this.completed;
    }
};

class Project {
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.todoList = [];
        this.isSelected = true;
    }

    addTodoToList(title, description, dueDate, priority, notes) {
        const id = crypto.randomUUID();
        const todo = new TodoItem(id, title, description, dueDate, priority, notes);
        this.todoList.push(todo);
        return todo;
    }
};

export {TodoItem, Project};