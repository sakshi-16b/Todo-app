const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");

window.onload = loadTasks;

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const task = {
            text: taskText,
            completed: false,
            timestamp: new Date().toLocaleString()
        };
        renderTask(task);
        saveTask(task);
        taskInput.value = "";
    }
}

function renderTask(task) {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `${task.text} <small>${task.timestamp}</small>
        <div class="task-buttons">
            <button class="edit" onclick="editTask(this)">✏️</button>
            <button class="delete" onclick="deleteTask(this)">🗑️</button>
        </div>`;
    li.onclick = function (e) {
        if (e.target.tagName !== "BUTTON") {
            li.classList.toggle("completed");
            updateLocalStorage();
        }
    };
    taskList.appendChild(li);
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskList.innerHTML = "";
    tasks.forEach(renderTask);
}

function updateLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.childNodes[0].textContent.trim(),
            completed: li.classList.contains("completed"),
            timestamp: li.querySelector("small").textContent
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function editTask(button) {
    const li = button.closest("li");
    const newText = prompt("Edit your task:", li.childNodes[0].textContent.trim());
    if (newText) {
        li.childNodes[0].textContent = newText + " ";
        updateLocalStorage();
    }
}

function deleteTask(button) {
    const li = button.closest("li");
    li.remove();
    updateLocalStorage();
}

function filterTasks(filter) {
    const tasks = taskList.querySelectorAll("li");
    tasks.forEach(li => {
        switch (filter) {
            case "all":
                li.style.display = "flex";
                break;
            case "active":
                li.style.display = li.classList.contains("completed") ? "none" : "flex";
                break;
            case "completed":
                li.style.display = li.classList.contains("completed") ? "flex" : "none";
                break;
        }
    });
}

function clearCompleted() {
    const tasks = taskList.querySelectorAll("li.completed");
    tasks.forEach(task => task.remove());
    updateLocalStorage();
}

function searchTasks() {
    const query = document.getElementById("search").value.toLowerCase();
    const tasks = taskList.querySelectorAll("li");
    tasks.forEach(li => {
        const text = li.childNodes[0].textContent.toLowerCase();
        li.style.display = text.includes(query) ? "flex" : "none";
    });
}
