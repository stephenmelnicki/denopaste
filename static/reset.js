const button = document.getElementById("reset-btn");

function resetPaste() {
  const textarea = document.getElementsByTagName("textarea").item(0);
  textarea.value = "";
}

button.addEventListener("click", resetPaste);
