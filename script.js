const form = document.getElementById("task-form");
const imageInput = document.getElementById("task-image");
const textInput = document.getElementById("task-text");
const list = document.getElementById("list");
const preview = document.getElementById("preview");
const uploadText = document.getElementById("upload-text");
const empty = document.getElementById("empty");
const viewButtons = document.querySelectorAll(".view button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let view = localStorage.getItem("view") || "grid";

function setView(name) {
  view = name;
  localStorage.setItem("view", view);
  list.classList.toggle("list-view", view === "list");
  viewButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === view));
}

viewButtons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";
  empty.hidden = tasks.length > 0;

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    if (task.image) {
      const img = document.createElement("img");
      img.src = task.image;
      img.alt = task.text;
      li.appendChild(img);
    }

    const text = document.createElement("p");
    text.textContent = task.text;
    li.appendChild(text);

    const actions = document.createElement("div");
    actions.className = "actions";

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      save();
      render();
    });
    label.append(checkbox, task.done ? "Done" : "Mark done");

    const remove = document.createElement("button");
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      tasks.splice(index, 1);
      save();
      render();
    });

    actions.append(label, remove);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function readImage(file) {
  return new Promise((resolve) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function showPreview(image) {
  preview.src = image;
  preview.hidden = !image;
  uploadText.hidden = !!image;
}

imageInput.addEventListener("change", async () => {
  showPreview(await readImage(imageInput.files[0]));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = textInput.value.trim();
  if (!text) return;

  const image = await readImage(imageInput.files[0]);
  tasks.push({ text, image, done: false });
  save();
  render();
  form.reset();
  showPreview("");
});

setView(view);
render();
