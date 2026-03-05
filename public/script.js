const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.getElementById('fileName');
const uploadBtn = document.getElementById('uploadBtn');
const dropZone = document.getElementById('dropZone');
const alertContainer = document.getElementById('alertContainer');

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    fileNameDisplay.textContent = `SELECTED: ${e.target.files[0].name}`;
  }
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  
  if (e.dataTransfer.files.length > 0) {
    fileInput.files = e.dataTransfer.files;
    fileNameDisplay.textContent = `SELECTED: ${e.dataTransfer.files[0].name}`;
  }
});

function uploadFile() {
  const file = fileInput.files[0];
  if (!file) {
    showAlert('SELECT A FILE FIRST', 'error');
    return;
  }

  console.log('Uploading file:', file.name, file.size, 'bytes');

  uploadBtn.classList.add('loading');

  const formData = new FormData();
  formData.append('file', file);

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        let errorMsg;
        try {
          const error = JSON.parse(text);
          errorMsg = error.message || error.error || 'Upload failed';
        } catch {
          errorMsg = text || 'Upload failed';
        }
        throw new Error(errorMsg);
      }
      return res.text();
    })
    .then((msg) => {
      console.log('Upload successful:', msg);
      uploadBtn.classList.remove('loading');
      fileInput.value = '';
      fileNameDisplay.textContent = '';
      showAlert('File uploaded successfully!', 'success');
      listFiles();
    })
    .catch((err) => {
      console.error('Upload error:', err);
      uploadBtn.classList.remove('loading');
      showAlert('ERROR: ' + err.message, 'error');
    });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const icons = {
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    jpg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    jpeg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    png: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    gif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    docx: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    txt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    zip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    mp3: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    mp4: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
  };
  return icons[ext] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
}

function listFiles() {
  console.log('Fetching file list...');

  fetch('/files')
    .then(async (res) => {
      console.log('List files response status:', res.status);
      if (!res.ok) {
        const text = await res.text();
        let errorMsg;
        try {
          const error = JSON.parse(text);
          errorMsg = error.message || error.error || 'Failed to fetch files';
        } catch {
          errorMsg = text || 'Failed to fetch files';
        }
        throw new Error(errorMsg);
      }
      return res.json();
    })
    .then((files) => {
      console.log('Files received:', files.length);
      const fileList = document.getElementById('fileList');
      const fileCount = document.getElementById('fileCount');
      
      fileCount.textContent = files.length;
      fileList.innerHTML = '';

      if (files.length === 0) {
        fileList.innerHTML = `
          <div class="empty-state">
            <p>NO FILES UPLOADED</p>
            <p class="empty-hint">Upload your first file above</p>
          </div>
        `;
        return;
      }

      files.forEach((f, index) => {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const icon = getFileIcon(f.name);
        
        card.innerHTML = `
          <div class="file-card-icon">${icon}</div>
          <div class="file-card-name">${f.name}</div>
          <div class="file-card-meta">${formatFileSize(f.size)}</div>
          <div class="file-card-actions">
            <button class="file-card-btn" onclick="downloadFile('${f.name.replace(/'/g, "\\'")}')">DOWNLOAD</button>
          </div>
        `;
        
        fileList.appendChild(card);
      });
    })
    .catch((err) => {
      console.error('List files error:', err);
      showAlert('Error loading files: ' + err.message, 'error');
    });
}

function createAlert(type, message) {
  const alert = document.createElement('div');
  alert.className = `alert ${type}`;
  alert.innerHTML = `
    <div class="alert-title">${type.toUpperCase()}</div>
    <div class="alert-message">${message}</div>
    <button class="alert-close" onclick="this.parentElement.remove()">X</button>
  `;
  
  setTimeout(() => {
    alert.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => {
      alert.remove();
    }, 300);
  }, 5000);
  
  return alert;
}

function showAlert(message, type = 'info') {
  const alert = createAlert(type, message);
  alertContainer.appendChild(alert);
}

function downloadFile(filename) {
  fetch(`/download/${encodeURIComponent(filename)}`)
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        let errorMsg;
        try {
          const error = JSON.parse(text);
          errorMsg = error.message || error.error || 'Download failed';
        } catch {
          errorMsg = text || 'Download failed';
        }
        throw new Error(errorMsg);
      }
      return res.json();
    })
    .then((data) => {
      const link = document.createElement('a');
      link.href = data.url;
      link.download = data.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showAlert('Download started: ' + data.filename, 'success');
    })
    .catch((err) => {
      console.error('Download error:', err);
      showAlert('Download error: ' + err.message, 'error');
    });
}

window.onload = listFiles;