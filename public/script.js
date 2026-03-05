const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.getElementById('fileName');
const uploadBtn = document.getElementById('uploadBtn');
const dropZone = document.getElementById('dropZone');

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
    alert('SELECT A FILE FIRST');
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
      console.log('Upload response status:', res.status);
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
      alert(msg);
      listFiles();
    })
    .catch((err) => {
      console.error('Upload error:', err);
      uploadBtn.classList.remove('loading');
      alert('ERROR: ' + err.message);
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
        const card = document.createElement('a');
        card.href = f.url;
        card.target = '_blank';
        card.className = 'file-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const icon = getFileIcon(f.name);
        
        card.innerHTML = `
          <div class="file-card-icon">${icon}</div>
          <div class="file-card-name">${f.name}</div>
        `;
        
        fileList.appendChild(card);
      });
    })
    .catch((err) => {
      console.error('List files error:', err);
      alert('Error loading files: ' + err.message);
    });
}

window.onload = listFiles;
