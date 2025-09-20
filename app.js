// Funciones de almacenamiento

function getStudents() {
    return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudent(student) {
    const students = getStudents();
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));
}

function saveStudents(students) {
    localStorage.setItem("students", JSON.stringify(students));
}

function deleteStudent(index) {
    const students = getStudents();
    students.splice(index, 1);
    saveStudents(students);
}

// Router

function router() {
    const path = location.hash.slice(1) || "/";
    const app = document.getElementById("app");
    app.innerHTML = "";

    let templateId;

    if (path === "/") {
        templateId = "form_Template";
    } else if (path === "/lista") {
        templateId = "list_Template";
    } else {
        templateId = "404-template";
    }

    const template = document.getElementById(templateId);
    app.appendChild(template.content.cloneNode(true));

    if (path === "/") {
        attachFormLogic();
    } else if (path === "/lista") {
        renderList();
    }
}

// Lógica del formulario

function attachFormLogic() {
    const form = document.getElementById("studentForm");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const n1 = parseFloat(document.getElementById("nota1").value);
        const n2 = parseFloat(document.getElementById("nota2").value);
        const n3 = parseFloat(document.getElementById("nota3").value);

        if (!name || isNaN(n1) || isNaN(n2) || isNaN(n3)) {
            document.getElementById("msg").textContent = "Por favor, complete todos los campos correctamente.";
            return;
        }

        const avg = ((n1 + n2 + n3) / 3).toFixed(2);
        saveStudent({ name, avg });

        document.getElementById("msg").textContent = "Estudiante guardado correctamente.";
        form.reset();
    });
}

// Lógica de la lista

function renderList() {
    const students = getStudents();
    const listContainer = document.getElementById("studentList");
    listContainer.innerHTML = "";

    if (students.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No hay estudiantes registrados.";
        listContainer.appendChild(msg);
        return;
    }

    const template = document.getElementById("student-item-template");

    students.forEach((student, index) => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".student-name").textContent = student.name;
        clone.querySelector(".student-average").textContent = student.avg;
        clone.querySelector(".delete-button").addEventListener("click", () => {
            deleteStudent(index);
            renderList();
        });
        listContainer.appendChild(clone);
    });
}

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        location.hash = this.id;
    });
});

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);