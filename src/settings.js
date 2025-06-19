document.addEventListener('DOMContentLoaded', () => {
  const notesList = document.getElementById('notesList');

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

  // Initial load of notes
  loadNotes();
}); 