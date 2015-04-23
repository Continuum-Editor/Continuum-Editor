// New File
$("body, textarea").bind('keydown', 'ctrl+n', function(){ openNewFile(); });

// Open File
$("body, textarea").bind('keydown', 'ctrl+o', function(){ openFile('#openFileDialog'); });

// Open Directory
$("body, textarea").bind('keydown', 'ctrl+shift+o', function(){ openDirectory('#openDirectoryDialog'); });

// Save
$("body, textarea").bind('keydown', 'ctrl+s', function(){ saveSelectedTab(); });

// Save As
$("body, textarea").bind('keydown', 'ctrl+shift+s', function(){ saveFileAs('#saveFileAsDialog'); });

// Tab right
$("body, textarea").bind('keydown', 'ctrl+tab', function(){ ui_switchTabRight() });

// Tab left
$("body, textarea").bind('keydown', 'ctrl+shift+tab', function(){ ui_switchTabLeft() });

// Tab close
$("body, textarea").bind('keydown', 'ctrl+w', function(){ closeActiveTab() });

// Go to line number
$("body, textarea").bind('keydown', 'ctrl+g', function(){ promptAndGotoLineNumber() });