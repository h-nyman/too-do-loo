// toDoList is the state that is stored to local storage. 
// We have to keep it in sync with the UI (HTML/DOM), 
// so that we can recover when the user reloads the page. 
let toDoList = []

// addToDo validates the to-do-form, and if everything is ok, creates a to-do.
function addToDo(event) {

    // prevent automatic submission of form
    event.preventDefault();
    const data = new FormData(event.target);
    const toDoLabel = data.get("to-do");

    // check that the to-do isn't empty or short, error message and red border will appear if empty. 
    if (toDoLabel.length < 2) {
        document.forms['to-do-form']['to-do'].style.borderColor = "red";
        document.getElementById('error-message').innerHTML = "<b> * Fill in a to-do!</b>";
        return false;
    }

    // if there isn't a reason for error, the error style and message is cleared
    document.forms['to-do-form']['to-do'].style.borderColor = "";
    document.getElementById('error-message').innerHTML = "";

    // creating to-do item and adding/displaying it in list
    const toDo = {
        checked: false,
        label: toDoLabel
    }
    const toDoNode = createToDoElement(toDo);
    document.getElementById("to-do-list").appendChild(toDoNode);

    // to-do is saved as an object in the toDoList array
    toDoList.push(toDo)

    // save to local storage
    saveLocalStorage(toDoList);

    // input field is cleared after the to-do is added
    document.getElementById("to-do").value = "";

    updateCompletedCount();
}

// removeToDos removes tasks that are marked as completed from the list and local storage. 
function removeToDos() {

    const toDoListNode = document.getElementById("to-do-list");

    // loop through the list to find items that are completed/box is checked
    for (let i = toDoListNode.children.length - 1; i >= 0; i--) {

        const toDoNode = toDoListNode.children[i];
        const checkbox = toDoNode.querySelector("input[type='checkbox']");

        // removing checked items from list
        if (checkbox && checkbox.checked) {
            toDoListNode.removeChild(toDoNode);
            toDoList.splice(i, 1);
        }
    }

    // saving updates to local storage
    saveLocalStorage(toDoList);
}

// createToDoElement creates DOM node that represents the to-do task 
// and register a change handler that keeps track of changes in the checkbox.
function createToDoElement(toDo) {
    const toDoNode = document.createElement("li");

    // create checkbox
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.checked = toDo.checked;

    // listen for a change event in the checkboxes, updates changes to list and saves to local storage
    checkbox.addEventListener("change", event => {
        const newchecked = event.target.checked;
        toDo.checked = newchecked;
        saveLocalStorage(toDoList);
        updateCompletedCount();
    })

    // creates label and adds checkbox to it
    const label = document.createElement("label");
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(toDo.label));

    // adds label to list item, returns it
    toDoNode.appendChild(label);

    return toDoNode;
}

// saves to do list to local storage
function saveLocalStorage(toDoList) {
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

// loads list from local storage
function showToDo() {
    toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];
    toDoList.forEach(toDo => {
        const toDoNode = createToDoElement(toDo);
        document.getElementById("to-do-list").appendChild(toDoNode);
    })

    updateCompletedCount();
}

// when the page has loaded, registers form event listener and displays saved to-do items
window.addEventListener("load", function () {
    document.getElementById("to-do-form").addEventListener("submit", addToDo);
    showToDo();
})

// counts how many items there are in the list that are not completed and displays them in UI.
function updateCompletedCount() {

    // count items left
    let itemsLeft = toDoList.length;
    for (let i = 0; i < toDoList.length; i++) {
        const toDo = toDoList[i];

        if (toDo.checked) {
            itemsLeft -= 1;
        }
    }

    // display items left in UI
    let numbersDataDiv = document.getElementById("numbers")
    if (numbersDataDiv) {
        numbersDataDiv.innerHTML = `
            <p>Items left to do: ${itemsLeft}</p>
        `;
    }
}
