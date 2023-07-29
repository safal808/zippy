const fileInput = document.getElementById("file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");
const shareBtn = document.getElementById("share-btn");
const shareLinkBtn = document.getElementById("share-link-btn");

const MAX_FILE_SIZE = 1024 * 1024 * 1024;

fileInput.addEventListener("change", ({ target }) => {
  const file = target.files[0];
  const fileError = document.getElementById("file-error"); // Get the error message element

  if (file) {
    let fileName = file.name;
    if (fileName.length >= 12) {
      const splitName = fileName.split(".");
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    if (file.size > MAX_FILE_SIZE) {
      const fileSize = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(2);
      const errorMessage = `File size cannot exceed ${fileSize} MB.`;
      fileError.textContent = errorMessage; // Display the error message
      return;
    } else {
      fileError.textContent = ""; // Clear the error message
    }
    uploadFile(file, fileName);
  }
});

shareBtn.addEventListener("click", () => {
  const fileInput = document.getElementById("file-input");
  if (fileInput.files.length === 0) {
    alert("Please select a file.");
    return;
  }
  document.querySelector("form").submit();
});

function uploadFile(file, name) {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  formData.append("file", file);
  formData.append("name", name);
  if (document.getElementById("password").value.trim() !== "") {
    formData.append(
      "password",
      document.getElementById("password").value.trim()
    );
  }

  xhr.open("POST", "/upload");

  xhr.upload.addEventListener("progress", ({ loaded, total }) => {
    const fileLoaded = Math.floor((loaded / total) * 100);
    let fileSize;
    total < 1024
      ? (fileSize = total + " KB")
      : (fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB");

    const progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading</span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;

    if (loaded == total) {
      progressArea.innerHTML = "";
      const uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <i class="fas fa-check"></i>
                          </li>`;
      uploadedArea.classList.remove("onprogress");
      uploadedArea.innerHTML = uploadedHTML; // Replace existing content with the new file
    }
  });

  xhr.send(formData);
}

let copyText = document.querySelector(".copy-text");
copyText.querySelector("button").addEventListener("click", function () {
  let input = copyText.querySelector("input.text");
  input.select();
  document.execCommand("copy");
  copyText.classList.add("active");
  window.getSelection().removeAllRanges();
  setTimeout(function () {
    copyText.classList.remove("active");
  }, 2500);
});
