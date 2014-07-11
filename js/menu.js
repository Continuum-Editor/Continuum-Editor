var gui = require('nw.gui');

// File Menu

var mainMenu = new gui.Menu({ type: 'menubar' });

var fileMenu = new gui.Menu();
fileMenu.append(new gui.MenuItem({ label: 'Open File...', click: function(){ openFile('#openFileDialog'); } }));
fileMenu.append(new gui.MenuItem({ label: 'Open Directory...', click: function(){ openDirectory('#openDirectoryDialog'); } }));
fileMenu.append(new gui.MenuItem({ type: 'separator' }));
fileMenu.append(new gui.MenuItem({ label: 'Save', click: function(){ saveSelectedTab(); } }));
fileMenu.append(new gui.MenuItem({ label: 'Save As...', click: function(){ saveFileAs('#saveFileAsDialog'); } }));

mainMenu.append(new gui.MenuItem({ label: 'File', submenu: fileMenu }));

// View Menu

var darkThemeMenu = new gui.Menu();

darkThemeMenu.append(new gui.MenuItem({ label: 'Monokai', click: function(){ setTheme('monokai', false); } }));

var lightThemeMenu = new gui.Menu();

lightThemeMenu.append(new gui.MenuItem({ label: 'Eclipse', click: function(){ setTheme('eclipse', true); } }));
lightThemeMenu.append(new gui.MenuItem({ label: 'Dreamweaver', click: function(){ setTheme('dreamweaver', true); } }));

var themeMenu = new gui.Menu();
themeMenu.append(new gui.MenuItem({ label: 'Dark', submenu: darkThemeMenu }));
themeMenu.append(new gui.MenuItem({ label: 'Light', submenu: lightThemeMenu }));

var viewMenu = new gui.Menu();
viewMenu.append(new gui.MenuItem({ label: 'Theme', submenu: themeMenu }));

mainMenu.append(new gui.MenuItem({ label: 'View', submenu: viewMenu }));

gui.Window.get().menu = mainMenu;
