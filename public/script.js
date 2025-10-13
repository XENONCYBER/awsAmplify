function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) return alert("Select a file");

  console.log("Uploading file:", file.name, file.size, "bytes");

  const formData = new FormData();
  formData.append("file", file);

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then(async (res) => {
      console.log("Upload response status:", res.status);
      if (!res.ok) {
        const text = await res.text();
        let errorMsg;
        try {
          const error = JSON.parse(text);
          errorMsg = error.message || error.error || "Upload failed";
        } catch {
          errorMsg = text || "Upload failed";
        }
        throw new Error(errorMsg);
      }
      return res.text();
    })
    .then((msg) => {
      console.log("Upload successful:", msg);
      alert(msg);
      fileInput.value = ""; // Clear file input
      listFiles();
    })
    .catch((err) => {
      console.error("Upload error:", err);
      alert("Error: " + err.message);
    });
}

function listFiles() {
  console.log("Fetching file list...");

  fetch("/files")
    .then(async (res) => {
      console.log("List files response status:", res.status);
      if (!res.ok) {
        const text = await res.text();
        let errorMsg;
        try {
          const error = JSON.parse(text);
          errorMsg = error.message || error.error || "Failed to fetch files";
        } catch {
          errorMsg = text || "Failed to fetch files";
        }
        throw new Error(errorMsg);
      }
      return res.json();
    })
    .then((files) => {
      console.log("Files received:", files.length);
      const fileList = document.getElementById("fileList");
      fileList.innerHTML = "";

      if (files.length === 0) {
        fileList.innerHTML =
          '<li style="color: gray;">No files uploaded yet</li>';
        return;
      }

      files.forEach((f) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${f.url}" target="_blank">${f.name}</a>`;
        fileList.appendChild(li);
      });
    })
    .catch((err) => {
      console.error("List files error:", err);
      alert("Error loading files: " + err.message);
    });
}

// List files on page load
window.onload = listFiles;
