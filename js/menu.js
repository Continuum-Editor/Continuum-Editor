var gui = require('nw.gui');

var mainMenu = new gui.Menu({ type: 'menubar' });

var fileMenu = new gui.Menu();
fileMenu.append(new gui.MenuItem({ label: 'Open File...', click: function(){ openFile('#openFileDialog'); } }));
fileMenu.append(new gui.MenuItem({ label: 'Open Directory...', click: function(){ openDirectory('#openDirectoryDialog'); } }));
fileMenu.append(new gui.MenuItem({ type: 'separator' }));
fileMenu.append(new gui.MenuItem({ label: 'Save', click: function(){ saveSelectedTab(); } }));

mainMenu.append(new gui.MenuItem({ label: 'File', submenu: fileMenu }));

gui.Window.get().menu = mainMenu;
