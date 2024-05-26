document.getElementById("saveButton")?.addEventListener("click", () => {
  const key = (document.getElementById("keyInput") as HTMLInputElement).value;
  const inputStrings =
    (document.getElementById("inputStrings") as HTMLTextAreaElement).value;

  if (key && inputStrings) {
    chrome.storage.sync.get("data", (result) => {
      const data = result.data || {};
      data[key] = inputStrings;
      chrome.storage.sync.set({ data }, () => {
        loadSavedData();
      });
    });
  } else {
    alert("キーと入力文字列を両方入力してください。");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadSavedData();
});

function loadSavedData() {
  chrome.storage.sync.get("data", (result) => {
    const savedDataDiv = document.getElementById("savedData");
    if (savedDataDiv) {
      savedDataDiv.innerHTML = "";
      const data = result.data || {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const div = document.createElement("div");
          div.className = "data-item";
          const title = key;
          const firstLine = data[key].split("\n")[0] + "...";
          div.innerHTML = `<strong>${title}</strong>: ${firstLine}
                           <button class="editButton" data-key="${key}">編集</button>
                           <button class="deleteButton" data-key="${key}">削除</button>`;
          savedDataDiv.appendChild(div);
        }
      }
      addEventListeners();
    }
  });
}

function addEventListeners() {
  const editButtons = document.querySelectorAll(".editButton");
  const deleteButtons = document.querySelectorAll(".deleteButton");

  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const key = (event.target as HTMLElement).getAttribute("data-key");
      if (key) {
        chrome.storage.sync.get("data", (result) => {
          const data = result.data || {};
          if (data[key]) {
            (document.getElementById("keyInput") as HTMLInputElement).value =
              key;
            (document.getElementById("inputStrings") as HTMLTextAreaElement)
              .value = data[key];
          }
        });
      }
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const key = (event.target as HTMLElement).getAttribute("data-key");
      if (key) {
        chrome.storage.sync.get("data", (result) => {
          const data = result.data || {};
          delete data[key];
          chrome.storage.sync.set({ data }, () => {
            loadSavedData();
          });
        });
      }
    });
  });
}
