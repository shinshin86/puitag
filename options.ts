document.getElementById("saveButton")?.addEventListener("click", () => {
  const inputStrings =
    (document.getElementById("inputStrings") as HTMLTextAreaElement).value;
  chrome.storage.sync.set({ inputStrings }, () => {
    alert("設定が保存されました。");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("inputStrings", (data) => {
    (document.getElementById("inputStrings") as HTMLTextAreaElement).value =
      data.inputStrings || "";
  });
});
