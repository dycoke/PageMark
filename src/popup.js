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
    // Render Markdown to HTML using marked
    let html = window.marked.parse(note, { gfm: true, breaks: true });
    // Render LaTeX using KaTeX (display mode first)
    html = html.replace(/\$\$(.*?)\$\$/gs, (match, expr) => {
      try {
        return window.katex.renderToString(expr, {
          throwOnError: false,
          displayMode: true
        });
      } catch (e) {
        return `<span style='color:#dc2626;font-weight:bold'>LaTeX Error (Display): ${e.message}</span>`;
      }
    });
    html = html.replace(/\$(.*?)\$/g, (match, expr) => {
      try {
        return window.katex.renderToString(expr, {
          throwOnError: false,
          displayMode: false
        });
      } catch (e) {
        return `<span style='color:#dc2626;font-weight:bold'>LaTeX Error (Inline): ${e.message}</span>`;
      }
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