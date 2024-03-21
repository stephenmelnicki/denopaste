const button = document.getElementById("copy-btn");

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(function () {
      button.textContent = "Copied!";
      button.style.paddingLeft = "3.38rem";
      button.style.paddingRight = "3.38rem";

      setTimeout(function () {
        button.textContent = "Copy to clipboard";
        button.style.removeProperty("padding-left");
        button.style.removeProperty("padding-right");
      }, 750);

      console.log("content copied to clipboard.");
    })
    .catch(function (err) {
      console.error("failed to copy content to clipboard.", err);
    });
}

button.addEventListener(
  "click",
  function () {
    const text = document.getElementsByTagName("pre").item(0).innerText;
    copyToClipboard(text);
  },
  false,
);
