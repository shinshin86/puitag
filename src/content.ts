const ORIGINAL_BUTTON_TEXT = "タグを一括入力";

function insertButtonOutsideForm(): void {
  const tagInputElement = document.querySelector(
    "div.is-flex > input",
  ) as HTMLInputElement;
  if (!tagInputElement) {
    console.error("Tag input field not found!");
    return;
  }

  // Get the position of the tag input element
  const tagInputRect = tagInputElement.getBoundingClientRect();

  // Create a container for the new button and select
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = `${tagInputRect.top + window.scrollY}px`;
  container.style.left = `${tagInputRect.right + window.scrollX + 10}px`;
  container.style.zIndex = "1000";
  container.style.display = "flex";
  container.style.marginTop = "10px";
  container.style.backgroundColor = "white";

  const div = document.createElement("div");
  div.style.borderStyle = "solid";
  div.style.borderWidth = "0";
  div.style.boxSizing = "border-box";

  const select = document.createElement("select");
  styleSelectElement(select);
  loadDropdownOptions(select);

  const button = document.createElement("button");
  button.innerHTML = ORIGINAL_BUTTON_TEXT;
  styleButtonElement(button);

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const selectedKey = select.value;
    chrome.storage.sync.get("data", (data) => {
      const inputStrings = data.data[selectedKey]
        ? data.data[selectedKey].split("\n")
        : [];
      addTags(inputStrings);
    });
  });

  div.appendChild(select);
  div.appendChild(button);
  container.appendChild(div);

  document.body.appendChild(container);

  // Function to update the position of the container
  const updatePosition = () => {
    const tagInputRect = tagInputElement.getBoundingClientRect();
    container.style.top = `${tagInputRect.top + window.scrollY}px`;
    container.style.left = `${tagInputRect.right + window.scrollX + 10}px`;
  };

  // Adjust position on window resize
  window.addEventListener("resize", updatePosition);

  // Create a MutationObserver to watch for changes to the DOM
  const observer = new MutationObserver(updatePosition);
  observer.observe(document.body, { childList: true, subtree: true });
}

function styleSelectElement(select: HTMLSelectElement): void {
  select.style.alignItems = "center";
  select.style.border = "1px solid #eaeae9";
  select.style.display = "flex";
  select.style.width = "150px";
  select.style.height = "40px";
  select.style.padding = "6px 11px";
  select.style.font = "#2c2d25";
  select.style.display = "inline-block";
  select.style.fontSize = "14px";
  select.style.fontWeight = "700";
  select.style.marginRight = "10px";
}

function styleButtonElement(button: HTMLButtonElement): void {
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
}

function loadDropdownOptions(select: HTMLSelectElement): void {
  chrome.storage.sync.get("data", (result) => {
    const data = result.data || {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const option = document.createElement("option");
        option.value = key;
        option.text = key;
        select.appendChild(option);
      }
    }
  });
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

// Call the function to insert the button outside the form
insertButtonOutsideForm();