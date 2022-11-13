const dom = {
    input: document.getElementById('input'),
    tasks: document.getElementById('tasks'),
    todoFooter: document.getElementById('todoFooter'),
    block1: document.getElementById('block1'),
    block2: document.getElementById('block2'),
    completeAllTasks: document.getElementById('completeAllTasks'),
    clearCompleted: document.getElementById('clearCompleted'),
    itemsLeft: document.getElementById('itemsLeft'),
    ALL: document.getElementById('ALL'),
    ACTIVE: document.getElementById('ACTIVE'),
    COMPLETED: document.getElementById('COMPLETED'),
}

const FILTERS = {
    ALL: 'ALL',
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
}

// Массив с задачами
let arrayTasks = []
let filter = FILTERS.ALL

const changeFilter = id => {
    filter = id;
    tasksRender(arrayTasks)

}


// Отслеживание события по клику на клавиатуре
dom.input.addEventListener('keydown', function (event) {
    if (event.code == 'Enter' || event.code == 'NumpadEnter') {
        const newTaskText = dom.input.value;
        dom.input.value = '';
        tasksRender(arrayTasks)
        addTask(newTaskText, arrayTasks)

    }
})




// Функция добавления задач в массив

function addTask(text, list) {

    const timestamp = Date.now()
    const task = {
        id: timestamp,
        text,
        isComplete: false,
    }
    if (text == '') { return }
    arrayTasks.push(task)

    tasksRender(list)

}

//  Функция вывода задач на экран

function tasksRender(list) {
    dom.tasks.innerHTML = "";
    let htmlList = '';
    let FilteredArrayTasks;
    switch (filter) {
        case FILTERS.ALL:
            FilteredArrayTasks = list;
            dom.ALL.classList.remove('active');
            dom.ACTIVE.classList.remove('active');
            dom.COMPLETED.classList.remove('active');
            dom.ALL.classList.add('active');
            break;
        case FILTERS.ACTIVE:
            FilteredArrayTasks = list.filter(task => !task.isComplete);
            dom.ALL.classList.remove('active');
            dom.ACTIVE.classList.remove('active');
            dom.COMPLETED.classList.remove('active');
            dom.ACTIVE.classList.add('active');
            break;
        case FILTERS.COMPLETED:
            FilteredArrayTasks = list.filter(task => task.isComplete);
            dom.ALL.classList.remove('active');
            dom.ACTIVE.classList.remove('active');
            dom.COMPLETED.classList.remove('active');
            dom.COMPLETED.classList.add('active');
            break;
        default:
            FilteredArrayTasks = [];
            break;
    }

    FilteredArrayTasks.forEach(task => {
        const classTask = task.isComplete
            ? 'todo__task todo__task_complete'
            : 'todo__task'
        const checked = task.isComplete ? 'checked' : ''

        const htmlTask = `
        <li id="${task.id}" class="${classTask}">
        <label class="todo_checkbox">
            <input type="checkbox" ${checked}>
            <div class="todo_checkbox-div"></div>
        </label>
        <div  class="todo__task-text">${task.text}</div>
        <div class="todo__task-del ">&#215;</div>
    </li>
        `

        htmlList = htmlList + htmlTask;
        dom.tasks.innerHTML = htmlList;


    }
    )
    addElemClearCompleted(list)
    addAndDeleteElemInterface(list)
    countsActiveTasks(list)
    changeStyleButtonSelectAll(list)
}

// Отслеживание по клику статуса задачи или удаления
dom.tasks.onclick = function (event) {
    const target = event.target

    const isCheckboxClicked = target.classList.contains('todo_checkbox-div')
    const isDeleteClickedButtonDel = target.classList.contains('todo__task-del')

    if (isCheckboxClicked) {
        const task = target.parentElement.parentElement
        const taskId = task.getAttribute("id")
        changeStatusTask(taskId, arrayTasks)

    }
    if (isDeleteClickedButtonDel) {
        const parentElementButtonDel = target.parentElement;
        const ButtonDeleteId = parentElementButtonDel.getAttribute("id")
        deleteTask(ButtonDeleteId, arrayTasks)
        tasksRender(arrayTasks)
        changeStatusTask(ButtonDeleteId, arrayTasks)

    }
    tasksRender(arrayTasks)

}
// Функция изменения состояния задачи

function changeStatusTask(id, list) {
    list.forEach((task) => {
        if (task.id == id) {
            task.isComplete = !task.isComplete
        }
    })
}



// Функция счета количества задач

let counter = 0
let countsActiveTasks = (list) => {

    const arrayTaskCompleted = list.filter(task => !task.isComplete)
    counter = arrayTaskCompleted.length
    dom.itemsLeft.innerHTML = counter
}


// Функция добавления и удаления элементов интерфейса

function addAndDeleteElemInterface(list) {
    const arrayCheck = list.length !== 0;

    dom.todoFooter.style = `display:${arrayCheck ? 'flex' : 'none'} `;
    dom.block1.style = `display:${arrayCheck ? 'flex' : 'none'} `;
    dom.block2.style = `display:${arrayCheck ? 'flex' : 'none'} `;
    dom.tasks.style = `display:${arrayCheck ? '' : 'none'} `;
    dom.completeAllTasks.style = `visibility:${arrayCheck ? 'visible' : 'hidden'} `;

}

//Функция удаления задачи из массива

function deleteTask(id, list) {
    list.forEach((task, idx) => {
        if (task.id == id) {
            list.splice(idx, 1);

        }

    })

}

// Функция добавление элемента ClearCompleted

const addElemClearCompleted = (list) => {
    const isCompletedExist = list.find(task => task.isComplete);
    dom.clearCompleted.style = `visibility:${isCompletedExist ? 'visible' : 'hidden'}`;
}

// Отслеживание события по клику на элемент ClearCompleted

dom.clearCompleted.onclick = () => {
    arrayTasks = arrayTasks.filter(task => !task.isComplete)
    tasksRender(arrayTasks)

}

//Отслеживание события по клику на элемент completeAllTasks

const buttonSelectAll = dom.completeAllTasks.onclick = () => {
    const сompletedTasks = arrayTasks.filter(task => !task.isComplete)
    const cancelCompletedTasks = (сompletedTasks == 0)
        ? returnsInitialStateTasks(arrayTasks)
        : completeAllTasks(arrayTasks)
    tasksRender(arrayTasks)
}

// Функция. Выполняет все задачи

function completeAllTasks(list) {
    list.forEach((task) => {
        if (task.isComplete == false) {
            task.isComplete = !task.isComplete
        }
    })
}

// Функция. Делает активными все выполненые задачи 

function returnsInitialStateTasks(list) {
    list.forEach(task => task.isComplete = !task.isComplete);

}
// Функция. Изменяет стили кнопки selectAll
function changeStyleButtonSelectAll(list) {
    const сompletedTasks = list.filter(task => !task.isComplete)
    const changeStyleButtonSelectAll = (сompletedTasks == 0)
        ? dom.completeAllTasks.classList.add('todo__select-all_active')
        : dom.completeAllTasks.classList.remove('todo__select-all_active');
}