const list = document.getElementById("list");
let hidden = new Set();

function save() {
  chrome.storage.sync.set({ [XLS_STORAGE_KEY]: [...hidden] });
}

function render() {
  list.textContent = "";
  for (const item of XLS_ITEMS) {
    const row = document.createElement("label");
    const name = document.createElement("span");
    name.textContent = item.label;
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = !hidden.has(item.id); // ON = 表示
    box.addEventListener("change", () => {
      box.checked ? hidden.delete(item.id) : hidden.add(item.id);
      save();
    });
    row.append(name, box);
    list.append(row);
  }
}

document.getElementById("reset").addEventListener("click", () => {
  hidden = new Set(xlsDefaultHidden());
  save();
  render();
});

chrome.storage.sync.get(XLS_STORAGE_KEY, (res) => {
  hidden = new Set(res[XLS_STORAGE_KEY] ?? xlsDefaultHidden());
  render();
});
