document.addEventListener('DOMContentLoaded', () => {
  const noteInput = document.getElementById('noteInput');
  const previewDiv = document.getElementById('preview');
  const settingsButton = document.getElementById('settingsButton');

  function loadNote() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const url = tabs[0].url;
      chrome.storage.local.get(url, (data) => {
        if (data[url]) {
          noteInput.value = data[url];
          renderNote();
        }
        // Focus the input after loading
        noteInput.focus();
      });
    });
  }

  function saveNote() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const url = tabs[0].url;
      const note = noteInput.value;
      chrome.storage.local.set({[url]: note}, () => {
        console.log('Note saved!');
      });
    });
  }

  function renderNote() {
    const note = noteInput.value;
    let html = marked.parse(note);
    html = html.replace(/\$\$(.*?)\$\$/g, (match, p1) => {
      return katex.renderToString(p1, {displayMode: true});
    });
    html = html.replace(/\$(.*?)\$/g, function(match, p1) {
      return katex.renderToString(p1, {displayMode: false});
    });
    previewDiv.innerHTML = html;
  }
  settingsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  loadNote();

  let debounceTimer;
  noteInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      saveNote();
      renderNote();
    }, 250);
  });


}); 