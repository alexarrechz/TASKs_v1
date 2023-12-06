let task_name = document.getElementById("task_name").value;
let task_deadline = document.getElementById("task_deadline").value;
let task_priority = document.getElementById("task_priority").value;
let new_task_btn = document.getElementById("new_task_btn");

// Botón para ageregar tareas
new_task_btn.addEventListener("click", function() {
    let alert_newtask = document.querySelector(".header-button");

    // Obtener los valores de los inputs
    let task_name = document.getElementById("task_name").value;
    let task_deadline = document.getElementById("task_deadline").value;
    let task_priority = document.getElementById("task_priority").value;

    // Verificar si los inputs están vacíos
    if (task_name !== "" && task_deadline !== "" && task_priority !== "") {
        // Agregar el evento de escucha al botón
        alert_newtask.classList.remove("alert");

        new_task(task_name, task_deadline, task_priority);
    } else {
        alert_newtask.classList.add("alert");
    }
});


let div1 = document.getElementById("child-content-1");
let div2 = document.getElementById("child-content-2");
let div3 = document.getElementById("child-content-3");
let div4 = document.getElementById("child-content-4");
let div5 = document.getElementById("child-content-5");

// nose
// Crear una tarea
let new_task = (task_name, task_deadline, task_priority) => {
    fetch(process.env.PORT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: task_name,
            deadline: task_deadline,
            priority: task_priority,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        refresh();
    })
    .catch(error => console.error('Error:', error));
}

// Terminar una tarea
let finish_task = (taskId) => {
    fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            completed: true,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        refresh();
    })
    .catch(error => console.error('Error:', error));
}

// Mostrar tareas por prioridad y no completadas
let show_priority_tasks = (priority, div_id) => {
    fetch(`http://localhost:8000/tasks/priority/${priority}`)
    .then(response => response.json())
    .then(data => {
        // Filtra las tareas que no están completadas
        const incompleteTasks = data.filter(task => !task.completed);

        // Limpia el contenido del div antes de agregar nuevos datos
        document.getElementById(div_id).innerHTML = '';

        // Comprueba si hay datos en la respuesta
        if (incompleteTasks.length > 0) {
            // Agrega la etiqueta de apertura de la tabla
            const tablona = document.getElementById(div_id);
            let table = `<table>`
            // Utiliza map para asegurarte de que 'task' está definido en este contexto
            incompleteTasks.forEach((task, index) => {
                // Formatea la fecha en el formato "dd/mm/yyyy"
                const formattedDate = new Date(task.deadline).toLocaleDateString('es-ES');
                console.log("AquI ALEX ↓ ")
                console.log(index, task);

                table += `
                    <tr>
                        <td>${task.title}</td>
                        <td>${formattedDate}</td>
                        <td><div class="state_checkbox checkbox" id="checkbox-${task._id}"></div></td>
                    </tr>
                `;
            });

            // Agrega la etiqueta de cierre de la tabla
            tablona.innerHTML += `${table} </table>`
        } else {
            // Si no hay datos, muestra un mensaje
            document.getElementById(div_id).innerHTML += '<p>No se encontraron tareas no completadas con la prioridad seleccionada</p>';
        }

        // Obtener todos los checkboxes con la clase "checkbox"
        let state_checkboxes = document.querySelectorAll(".state_checkbox");
        console.log(state_checkboxes);
        // Asignar el evento click a cada checkbox
        state_checkboxes.forEach(function(checkbox) {
            checkbox.addEventListener("click", handleCheckboxClick);
            console.log("click en state checkbox");
        });
    })
    .catch(error => console.error('Error:', error));
}


function handleCheckboxClick(event) {
    console.log("entró");
    let checkboxId = event.target.id;
    let taskId = checkboxId.replace("checkbox-", ""); // Eliminar "checkbox-"
    finish_task(taskId);
    refresh();
}


let refresh = () => {
    for (i = 1; i <= 5; i++) {
        show_priority_tasks(i, "child-content-" + i)
    }

}


refresh();

