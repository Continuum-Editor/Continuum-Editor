
// Open File
$("body, textarea").bind('keydown', 'ctrl+o', function(){ openFile('#openFileDialog'); });

// Open Directory
$("body, textarea").bind('keydown', 'ctrl+shift+o', function(){ openDirectory('#openDirectoryDialog'); });

// Save
$("body, textarea").bind('keydown', 'ctrl+s', function(){ saveSelectedTab(); });
