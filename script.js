const todoList = document.querySelector(".todo-list");
const form = document.querySelector(".new-todo-form");
const newTodo = document.querySelector(".new-todo");
const footer = document.querySelector(".footer");
const itemsLeft = document.querySelector(".items-left");

const completeAll = document.querySelector("#complete-all");

const allButton = document.querySelector("#all");
const activeButton = document.querySelector("#active");
const completedButton = document.querySelector("#completed");

let activeFilter = "all";

let numberOfTodos = 0;

// Needed when the page is refreshed
showAllActiveCompleted();

getFromLocalStorage();

form.onsubmit = (event) => {
  event.preventDefault();
  createToDo(newTodo.value);
};

// Show all posts
allButton.onclick = () => {
  window.location.hash = "";
};

// Show all active
activeButton.onclick = () => {
  window.location.hash = "active";
};

// Show all completed notes
completedButton.onclick = () => {
  window.location.hash = "completed";
};

// Clear completed
document.querySelector("#clear-completed").onclick = () => {
  const complete = document.querySelectorAll(".todo-list input[type=checkbox]:checked");

  complete.forEach((element) => {
    // find and click removebutton
    const removeButton = element.nextElementSibling.nextElementSibling;
    removeButton.click();
  });

  if (todoList.childNodes.length < 1) {
    footer.style.display = "none";
    completeAll.checked = false;
    document.querySelector("#complete-label").style.visibility = "hidden";
  }
  toggleCompleteAll();
};

// Change URL
window.addEventListener("hashchange", () => {
  showAllActiveCompleted();
});

// Checkbox for complete all
completeAll.addEventListener("change", () => {
  const all = document.querySelectorAll(".todo-list li div");
  if (completeAll.checked) {
    numberOfTodos = 0;
    itemsLeft.textContent = setItemsLeft(numberOfTodos);
    all.forEach((element) => {
      element.children[0].checked = true;
      element.children[1].setAttribute("class", "completed");
    });
  } else {
    all.forEach((element) => {
      element.children[0].checked = false;
      element.children[1].setAttribute("class", "not-completed");
    });
    numberOfTodos = all.length;
    itemsLeft.textContent = setItemsLeft(numberOfTodos);
  }

  if (window.location.hash == "#active") {
    showActive();
  } else if (window.location.hash == "#completed") {
    showCompleted();
  }
  updateStorageCheckbox();
  toggleCompleteAll();
});

function createToDo(todoText, isChecked = false) {
  if (todoText != "") {
    const li = document.createElement("li");
    const todoDiv = document.createElement("div");
    const checkBox = document.createElement("input");
    const label = document.createElement("label");
    const removeButton = document.createElement("button");

    // Add attributes and put elements in HTML
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = isChecked;
    todoDiv.append(checkBox);
    if (checkBox.checked) {
      label.setAttribute("class", "completed");
    } else {
      label.setAttribute("class", "not-completed");
      numberOfTodos++;
    }
    label.textContent = todoText;
    todoDiv.append(checkBox);
    todoDiv.append(label);
    todoDiv.append(removeButton);
    li.append(todoDiv);
    todoList.append(li);
    footer.style.display = "flex";

    // Double-click to edit
    label.ondblclick = () => {
      label.contentEditable = true;
      label.focus();
      label.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          label.blur();
        }
      });
      const index = [...todoList.children].indexOf(li);

      label.onblur = () => {
        if (label.textContent.length === 0) {
          removeButton.click();
        } else {
          label.contentEditable = false;
          const storedData = JSON.parse(localStorage.getItem("data"));
          storedData[index].todo = label.textContent;
          localStorage.clear();
          localStorage.setItem("data", JSON.stringify(storedData));
        }
      };
    };

    removeButton.textContent = "❌";
    removeButton.onclick = () => {
      // Get index of list where removebutton is placed
      const index = [...todoList.children].indexOf(li);

      // Get stored data and remove at index, then replace with updated data
      const storedData = JSON.parse(localStorage.getItem("data"));
      storedData.splice(index, 1);
      localStorage.clear();
      localStorage.setItem("data", JSON.stringify(storedData));

      if (checkBox.checked == false) {
        numberOfTodos--;
      }
      li.remove();
      itemsLeft.textContent = setItemsLeft(numberOfTodos);

      // Hide footer element
      if (todoList.childNodes.length < 1) {
        footer.style.display = "none";
        document.querySelector("#complete-label").style.visibility = "hidden";
      }
      toggleCompleteAll();
    };

    saveToStorage(label.textContent, checkBox.checked);
    itemsLeft.textContent = setItemsLeft(numberOfTodos);

    // Check if checkbox is checked
    checkBox.addEventListener("change", function () {
      const all = document.querySelectorAll(".todo-list input[type=checkbox]");
      const checked = document.querySelectorAll(".todo-list input[type=checkbox]:checked");
      toggleCompleteAll();

      if (checkBox.checked) {
        // Checkbox is checked..
        numberOfTodos--;
        itemsLeft.textContent = setItemsLeft(numberOfTodos);
        label.setAttribute("class", "completed");

        if (all.length == checked.length) {
          completeAll.checked = true;
        }
      } else {
        // Checkbox is not checked..
        numberOfTodos++;
        itemsLeft.textContent = setItemsLeft(numberOfTodos);
        label.setAttribute("class", "not-completed");
        if (!(checked.length == all.length)) {
          completeAll.checked = false;
        }
      }
      updateStorageCheckbox();
    });
    document.querySelector("#complete-label").style.visibility = "visible";
  }

  if (activeFilter === "complete") {
    showCompleted();
  } else if (activeFilter === "active") {
    showActive();
  } else {
    showAll();
  }

  form.reset();
}

function getFromLocalStorage() {
  if (localStorage.length > 0) {
    let data = JSON.parse(localStorage.getItem("data"));
    localStorage.clear();
    data.forEach((element) => {
      let isChecked = false;
      if (element.checkBox == true) {
        isChecked = true;
      } else {
        isChecked = false;
      }
      createToDo(element.todo, isChecked);
    });

    itemsLeft.textContent = setItemsLeft(numberOfTodos);

    const all = document.querySelectorAll(".todo-list input[type=checkbox]");
    const checked = document.querySelectorAll(".todo-list input[type=checkbox]:checked");
    if (all.length == checked.length) {
      completeAll.checked = true;
    }
    toggleCompleteAll();
    itemsLeft.textContent = setItemsLeft(numberOfTodos);
  }
}

function saveToStorage(todoText, checkBoxValue) {
  const newData = {
    todo: todoText,
    checkBox: checkBoxValue,
  };

  if (localStorage.getItem("data") == null) {
    localStorage.setItem("data", "[]");
  }

  const oldData = JSON.parse(localStorage.getItem("data"));
  oldData.push(newData);

  localStorage.setItem("data", JSON.stringify(oldData));
}

function updateStorageCheckbox() {
  if (localStorage.length > 0) {
    let data = JSON.parse(localStorage.getItem("data"));
    const all = document.querySelectorAll(".todo-list input[type=checkbox]");

    for (let i = 0; i < all.length; i++) {
      data[i].checkBox = all[i].checked;
    }
    localStorage.clear();
    localStorage.setItem("data", JSON.stringify(data));

    toggleCompleteAll();
    itemsLeft.textContent = setItemsLeft(numberOfTodos);
  }
}

function setItemsLeft(number) {
  if (number === 1) {
    return `${number} item left`;
  } else {
    return `${number} items left`;
  }
}

function borderOnFilterButton(filter) {
  if (filter == "all") {
    document.querySelector("#all").setAttribute("class", "selected");
    document.querySelector("#active").setAttribute("class", "");
    document.querySelector("#completed").setAttribute("class", "");
  } else if (filter == "active") {
    document.querySelector("#all").setAttribute("class", "");
    document.querySelector("#active").setAttribute("class", "selected");
    document.querySelector("#completed").setAttribute("class", "");
  } else {
    document.querySelector("#all").setAttribute("class", "");
    document.querySelector("#active").setAttribute("class", "");
    document.querySelector("#completed").setAttribute("class", "selected");
  }
}

function showAllActiveCompleted() {
  if (window.location.hash == "#active") {
    showActive();
  } else if (window.location.hash == "#completed") {
    showCompleted();
  } else {
    showAll();
  }
}

function showAll() {
  const all = document.querySelectorAll(".todo-list input[type=checkbox]");
  all.forEach((element) => {
    element.parentElement.parentElement.style.display = "initial";
  });
  activeFilter = "all";
  borderOnFilterButton(activeFilter);
}

function showActive() {
  const checked = document.querySelectorAll(".todo-list input[type=checkbox]:checked");
  checked.forEach((element) => {
    element.parentElement.parentElement.style.display = "none";
  });
  const unchecked = document.querySelectorAll(".todo-list input[type=checkbox]:not(:checked)");
  unchecked.forEach((element) => {
    element.parentElement.parentElement.style.display = "initial";
  });
  activeFilter = "active";
  borderOnFilterButton(activeFilter);
}

function showCompleted() {
  const checked = document.querySelectorAll(".todo-list input[type=checkbox]:checked");
  checked.forEach((element) => {
    element.parentElement.parentElement.style.display = "initial";
  });
  const unchecked = document.querySelectorAll(".todo-list input[type=checkbox]:not(:checked)");
  unchecked.forEach((element) => {
    element.parentElement.parentElement.style.display = "none";
  });
  activeFilter = "complete";
  borderOnFilterButton(activeFilter);
}

function anyChecked() {
  const checked = document.querySelectorAll(".todo-list input[type=checkbox]:checked");
  if (checked.length > 0) {
    return true;
  } else {
    return false;
  }
}

function toggleCompleteAll() {
  if (anyChecked()) {
    return (document.querySelector("#clear-completed").style.visibility = "visible");
  } else {
    return (document.querySelector("#clear-completed").style.visibility = "hidden");
  }
}
