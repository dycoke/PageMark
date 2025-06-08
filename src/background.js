chrome.commands.onCommand.addListener(function(command) {
  if (command === 'quick-note') {
    chrome.action.openPopup();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateShortcut') {
    // Update the command in the manifest
    chrome.commands.update({
      name: 'quick-note',
      shortcut: request.shortcut
    });
  }
}); 