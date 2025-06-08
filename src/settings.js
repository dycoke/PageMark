document.addEventListener('DOMContentLoaded', () => {
  const shortcutInput = document.getElementById('shortcutInput');
  const saveShortcutButton = document.getElementById('saveShortcut');
  const notesList = document.getElementById('notesList');

  // Load current shortcut
  chrome.storage.local.get('shortcut', (data) => {
    shortcutInput.value = data.shortcut || '';
  });

  // Load all notes
  function loadNotes() {
    chrome.storage.local.get(null, (data) => {
      notesList.innerHTML = '';
      Object.entries(data)
        .filter(([key]) => key !== 'shortcut') // Skip the shortcut setting
        .sort(([urlA], [urlB]) => urlA.localeCompare(urlB)) // Sort by URL
        .forEach(([url, note]) => {
          const noteItem = document.createElement('div');
          noteItem.className = 'note-item';
          
          const noteContent = document.createElement('div');
          
          const urlLink = document.createElement('a');
          urlLink.href = url;
          urlLink.target = '_blank';
          urlLink.className = 'note-url';
          urlLink.textContent = url;
          
          const notePreview = document.createElement('div');
          notePreview.className = 'note-preview';
          notePreview.textContent = note;
          
          noteContent.appendChild(urlLink);
          noteContent.appendChild(notePreview);

          function createDeleteButton() {
            const button = document.createElement('button');
            button.className = 'remove-button';

            // Create the SVG element
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M2 2L22 22M2 22L22 2');
            svg.appendChild(path);
            button.appendChild(svg);
            button.addEventListener('click', () => {
                messageBox.style.display = 'block'; // Show the message box
            });

            button.onclick = () => {
              chrome.storage.local.remove(url, () => {
                noteItem.remove();
              });
            };

            return button;
          }
          
          const removeButton = createDeleteButton();
          
          noteItem.appendChild(noteContent);
          noteItem.appendChild(removeButton);
          notesList.appendChild(noteItem);
        });
    });
  }

  // Shortcut input handler
  shortcutInput.addEventListener('keydown', function(e) {
    e.preventDefault();
    const keys = [];
    if (e.ctrlKey) keys.push('Ctrl');
    if (e.altKey) keys.push('Alt');
    if (e.shiftKey) keys.push('Shift');
    if (e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Shift') {
      keys.push(e.key.toUpperCase());
    }
    this.value = keys.join('+');
  });

  // Save shortcut button click handler
  saveShortcutButton.onclick = function() {
    const shortcut = shortcutInput.value;
    chrome.storage.local.set({shortcut: shortcut}, () => {
      // Update the command in the manifest
      chrome.runtime.sendMessage({
        action: 'updateShortcut',
        shortcut: shortcut
      });
    });
  }

  // Initial load of notes
  loadNotes();
}); 