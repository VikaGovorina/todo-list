
import {TodoItem, Project} from './todo.js'
import {saveData, loadData} from './storage.js';


class SideBar {
    constructor(onProjectSelected) {
        this.projectList = [];
        this.selectedProject = null;
        this.onProjectSelected = onProjectSelected;
        this.init();
    }

    init() {
        console.log(`init`);
        console.log(loadData());
        const savedProjects = loadData();
        if (savedProjects.length > 0) {
            this.projectList = savedProjects.map(project => {
                const p = new Project(project.id, project.title);
                p.isSelected = project.isSelected;
                p.todoList = project.todoList.map(todo => Object.assign(new TodoItem(), todo));
                return p;
            });
            this.selectedProject = this.projectList.find(a => a.isSelected) || this.projectList[0];
        } else {
            this.addProject("My project");
            saveData(this.projectList);
        }

        this.displayProjects();
        this.setUpListeners();
    }

    setUpListeners() {
        const newProjectBtn = document.getElementById('new-project-btn');
        const dialogs = document.querySelectorAll('.dialog');
        const newProjectDialog = dialogs[0];
        const cancelBtns = document.querySelectorAll('.cancel-btn');
        const cancelBtn = cancelBtns[0];
        const submitBtns = document.querySelectorAll('.submit-btn');
        const submitBtn = submitBtns[0];
        const forms = document.querySelectorAll('.dialog form');
        const projectForm = forms[0];

        newProjectBtn.addEventListener('click', () => {
            newProjectDialog.showModal();
        });
        cancelBtn.addEventListener('click', () => {
            newProjectDialog.close();
        });

        submitBtn.addEventListener('click', (event) => {
            event.preventDefault();

            const title = document.getElementById('project-title').value;
            this.addProject(title);

            newProjectDialog.close();
            projectForm.reset();

            this.displayProjects();
            console.log("submit");
            console.log(loadData());
        });
    }

    displayProjects() {
        const projectContainer = document.querySelector('.project-field');
        projectContainer.innerHTML = "";

        this.projectList.forEach(project => {
            const projectBtn = this.createProjectBtn(project);
            projectContainer.append(projectBtn);
        });
        saveData(this.projectList);
    }

    createProjectBtn(project) {
        const projectBtn = document.createElement('div');
        projectBtn.dataset.projectId = project.id;
        projectBtn.className = "project-btn";

        const projectTitle = document.createElement('span');
        projectTitle.textContent = project.title;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-project-btn";
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const confirmed = confirm(`Delete project "${project.title}"?`);
            if (confirmed) {
                this.deleteProject(project.id);
            }
        });

        if (project.isSelected) {
            projectBtn.classList.add('selected');
        }

        projectBtn.addEventListener('click', () => {
            this.selectProject(project);
        });

        projectBtn.append(projectTitle, deleteBtn);

        return projectBtn;
    }

    updateProjectUi() {
        this.projectList.forEach(project => {
            const btn = document.querySelector(`[data-project-id="${project.id}"]`);
            if (btn) {
                btn.classList.toggle('selected', project.isSelected);
            }
        });
    }

    deleteProject(projectId) {
        this.projectList = this.projectList.filter(pr => pr.id !== projectId);

        if (this.selectedProject && this.selectedProject.id === projectId) {
            this.selectedProject = this.projectList[0] || null;
            if (this.selectedProject) {
                this.selectProject(this.selectedProject);
            }
        }
        this.displayProjects();
    }

    selectProject(project) {
        this.projectList.forEach(proj => {
            proj.isSelected = (proj.id === project.id);
        });

        this.selectedProject = project;

        this.updateProjectUi();

        if (this.onProjectSelected) {
            this.onProjectSelected(project);
        }
    }

    addProject(title) {
        const id = crypto.randomUUID();
        const project = new Project(id, title);
        this.addProjectToList(project);
        return project;
    }

    addProjectToList(project) {
        this.projectList.push(project);
        this.selectProject(project);
    }
};

export {SideBar};