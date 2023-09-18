const createNewTodoButton = document.querySelector('#newTodoButton');
const createNewTodoForm = document.querySelector('#newTodoForm');
const cancelNewTodoButton = document.querySelector('#newTodoCancel');
const saveNewTodoButton = document.querySelector('#saveNewTodo');
const newTodoDate = document.querySelector('#newDate');
const newTodoDescription = document.querySelector('#newDescription');
var currentId;
getCurrentId();

createNewTodoButton.addEventListener("click",()=>{
    createNewTodoForm.style.display = 'block';
    createNewTodoButton.disabled = 'disabled';
    createNewTodoButton.style.display = 'none';
})
cancelNewTodoButton.addEventListener("click", ()=>{
    newTodoDate.value = null;
    newTodoDescription.value = null;
    createNewTodoForm.style.display = 'none';
    createNewTodoButton.disabled = '';
    createNewTodoButton.style.display = 'block';
})
saveNewTodoButton.addEventListener("click", ()=>{
    if(newTodoDate.value == '' || newTodoDescription.value == ''){
        alert('Пожалуйста, заполните все поля')
    } else {
        let newTodo = new SaveTodo(getCurrentId());
        localStorage.setItem(`todo_${newTodo.id}`, JSON.stringify(newTodo))
        localStorage.setItem('currentId', +(localStorage.getItem('currentId')) + 1);
        todoList[`todo_${newTodo.id}`] = `todo_${newTodo.id}`;
        createNewTodoButton.style.display = 'block';
        cancelNewTodoButton.click();
        renderPage();
    }
    
})

function getCurrentId(){
    if(localStorage.getItem('currentId')){
        currentId = localStorage.getItem('currentId');
        return currentId;
    } else {
        localStorage.setItem('currentId', 0);
        return currentId;
    }
}

function SaveTodo(id){
    this.id = id;
    this.date = newTodoDate.value;
    this.description = newTodoDescription.value;
    this.isDone = false;
}

function renderPage(){
    const todoList = document.querySelector('#todoList');
    todoList.innerHTML = '';
    for (let i = 0; i < localStorage.length; ++i) {
        if (/todo_/.test(localStorage.key(i))){
        const recordKey = localStorage.key(i);
        const currentTodo = JSON.parse(localStorage.getItem(recordKey));

        const currentTodoDiv = document.createElement('div');
        currentTodoDiv.id = recordKey + '_Div';
        currentTodoDiv.className = 'todoListItem';

        let currentDate = document.createElement('span');
        currentDate.textContent = ' (' + (currentTodo.date).replace(`T`, ` / `) + ')';
        currentDate.className = 'todoDate'

        let currentDescription = document.createElement('span');
        currentDescription.textContent = currentTodo.description;
        currentDescription.className = 'todoDescription'

        const currentCheckbox = document.createElement('input');
        currentCheckbox.type = 'checkbox';
        currentCheckbox.className = 'buttonToDisable';
        currentCheckbox.checked = currentTodo.isDone;
        if (currentCheckbox.checked){
            currentDate.style.color = "rgb(115, 115, 115)";
            currentDescription.style.textDecoration = "line-through";
            currentDescription.style.color = "rgb(115, 115, 115)";
        }

        currentCheckbox.onchange = ()=>{
            const todo = currentTodo;
            if (todo.isDone === true){
                todo.isDone = false;
            } else {
                todo.isDone = true;
            }
            localStorage.setItem(recordKey, JSON.stringify(currentTodo));
            renderPage();
        }
        
        const currentEditButton = document.createElement('img');
        currentEditButton.src = 'assets/ico/pencil.png';
        currentEditButton.id = recordKey + '_Edit';
        currentEditButton.className = 'todoButtons buttonToDisable buttonsToHide';
        currentEditButton.onclick = function(){
            editTodo(recordKey)
        };

        const currentDeleteButton = document.createElement('img');
        currentDeleteButton.src = 'assets/ico/remove.png';
        currentDeleteButton.id = recordKey + '_Delete'
        currentDeleteButton.className = 'todoButtons buttonToDisable buttonsToHide';
        currentDeleteButton.onclick = ()=>{
            localStorage.removeItem(recordKey);
            renderPage();
        }

        currentTodoDiv.appendChild(currentCheckbox);
        currentTodoDiv.appendChild(currentDescription);
        currentTodoDiv.appendChild(currentDate);
        currentTodoDiv.appendChild(currentEditButton);
        currentTodoDiv.appendChild(currentDeleteButton);
        todoList.appendChild(currentTodoDiv);
        }
    }
    
}

function editTodo(key){
    const allOtherButtons = document.getElementsByClassName('buttonToDisable');
    for(let i = 0; i < allOtherButtons.length; ++i){
        allOtherButtons[i].disabled = 'disabled';
    }

    const todoEditing = document.querySelector(`#${key}_Div`);
    todoEditing.innerHTML = '';
    
    const currentTodo = JSON.parse(localStorage.getItem(key));

    const dateEditing = document.createElement('input');
    dateEditing.type = 'datetime-local';
    dateEditing.id = 'dateEditing';
    dateEditing.value = currentTodo.date;
    
    const descriptionEditing = document.createElement('input');
    descriptionEditing.type = 'text';
    descriptionEditing.id = 'descriptionEditing';
    descriptionEditing.value = currentTodo.description;

    const doneEditing = document.createElement('img');
    doneEditing.src = 'assets/ico/done.png';
    doneEditing.className = 'doneEditingButton';
    doneEditing.onclick = function(){
        if (dateEditing.value == '' || descriptionEditing.value == '') {
            alert('Пожалуйста, заполните все поля')
        } else {
            currentTodo.date = dateEditing.value;
            currentTodo.description = descriptionEditing.value;
            localStorage.setItem(key, JSON.stringify(currentTodo));
            for(let i = 0; i < allOtherButtons.length; ++i){
                allOtherButtons[i].disabled = '';
             }
            renderPage();
        }
        
    }

    const cancelEditing = document.createElement('img');
    cancelEditing.src = 'assets/ico/cancel.png';
    cancelEditing.className = 'todoButtons';
    cancelEditing.onclick = function(){
        for(let i = 0; i < allOtherButtons.length; ++i){
            allOtherButtons[i].disabled = '';
            createNewTodoButton.style.display = 'block';
        }
        renderPage();
    }
    
    todoEditing.appendChild(descriptionEditing);
    todoEditing.appendChild(dateEditing);
    todoEditing.appendChild(doneEditing);
    todoEditing.appendChild(cancelEditing);
}

function clearLocalStorage(){
    localStorage.clear();
    renderPage();
}

renderPage()