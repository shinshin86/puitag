const ORIGINAL_BUTTON_TEXT = "タグを一括入力";

function insertButton(): void {
  const targetElement = document.querySelector(
    "div.is-flex > input",
  ) as HTMLInputElement;
  if (!targetElement) {
    console.error("Target input not found!");
    return;
  }

  const div = document.createElement("div");
  div.style.borderStyle = "solid";
  div.style.borderWidth = "0";
  div.style.boxSizing = "border-box";

  const button = document.createElement("button");
  button.innerHTML = ORIGINAL_BUTTON_TEXT;
  button.style.alignItems = "center";
  button.style.border = "1px solid #eaeae9";
  button.style.display = "flex";
  button.style.width = "150px";
  button.style.height = "40px";
  button.style.padding = "6px 11px";
  button.style.font = "#2c2d25";
  button.style.display = "inline-block";
  button.style.fontSize = "14px";
  button.style.fontWeight = "700";

  button.addEventListener("click", () => {
    chrome.storage.sync.get("inputStrings", (data) => {
      const inputStrings = data.inputStrings
        ? data.inputStrings.split("\n")
        : [];
      addTags(inputStrings);
    });
  });

  targetElement.parentElement?.appendChild(button);
}

function addTags(inputStrings: string[]): void {
  const inputField = document.querySelector(
    "div.is-flex > input",
  ) as HTMLInputElement;
  const tagContainer = document.querySelector(
    "div.field.is-grouped.is-grouped-multiline",
  ) as HTMLElement;

  if (!inputField || !tagContainer) {
    console.error("Required elements not found!");
    return;
  }

  inputStrings.forEach((tagText) => {
    // Create hidden input
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "tag_name";
    hiddenInput.id = "id_tag_name";
    hiddenInput.value = tagText;

    // Create tag element
    const controlDiv = document.createElement("div");
    controlDiv.className = "control";

    const tagsDiv = document.createElement("div");
    tagsDiv.className = "tags has-addons";

    const spanTag = document.createElement("span");
    spanTag.className = "tag is-dark";
    spanTag.textContent = `#${tagText}`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "tag is-delete";
    deleteButton.type = "button";
    deleteButton.addEventListener("click", () => {
      // Remove tag when delete button is clicked
      tagContainer.removeChild(controlDiv);
      tagContainer.parentElement?.removeChild(hiddenInput);
    });

    tagsDiv.appendChild(spanTag);
    tagsDiv.appendChild(deleteButton);
    controlDiv.appendChild(tagsDiv);
    tagContainer.appendChild(controlDiv);
    tagContainer.parentElement?.insertBefore(hiddenInput, tagContainer);
  });

  inputField.value = "";
}

insertButton();
