

function saveData(projects) {
    localStorage.setItem("todoData", JSON.stringify(projects));
}

function loadData() {
    const data = localStorage.getItem("todoData");
    return data ? JSON.parse(data) : [];
}

export {saveData, loadData};