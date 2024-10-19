function addToDo(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    console.log(data);

    const toDo = data.get("to-do");

    const toDoNode = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type","checkbox");

    const label = document.createElement("p");
    label.appendChild(checkbox);

    label.appendChild(document.createTextNode(toDo));

    toDoNode.appendChild(label);

    document.getElementById("to-do-list").appendChild(toDoNode);
}

window.addEventListener("load",function() {
    document.getElementById("to-do-form").addEventListener("submit",addToDo);
})