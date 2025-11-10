
import './styles.css';
import { SideBar } from './modules/sidebar.js';
import { ProjectUI } from './modules/projectUI.js';


class App {
    constructor() {
        this.sideBar = null;
        this.projectUi = null;
        this.init();
    }

    init() {
        this.sideBar = new SideBar(null);
        const firstProject = this.sideBar.selectedProject;
        this.projectUI = new ProjectUI(firstProject, this.sideBar.projectList);

        this.sideBar.onProjectSelected = (project) => {
            this.projectUI.updateProjectContent(project);
        };
    }

}

const app = new App();