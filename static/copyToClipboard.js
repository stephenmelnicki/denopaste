function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(function () {
      console.log("content copied to clipboard.");
    })
    .catch(function (err) {
      console.error("failed to copy content to clipboard.", err);
    });
}

document
  .getElementById("copy-btn")
  .addEventListener("click", function () {
    const text = document.getElementsByTagName("pre").item(0).innerText;
    copyToClipboard(text);
  });
