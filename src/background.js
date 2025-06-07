chrome.commands.onCommand.addListener(function(command) {
  if (command === 'open-note') {
    chrome.action.openPopup();
  }
}); 