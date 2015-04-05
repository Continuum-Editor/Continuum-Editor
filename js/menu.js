
var mainMenu = new gui.Menu({ type: 'menubar' });
//gui.Window.get().menu = mainMenu;

// File Menu

var fileMenu = new gui.Menu();
fileMenu.append(new gui.MenuItem({ label: 'New', click: function(){ openNewFile(); } }));
fileMenu.append(new gui.MenuItem({ label: 'Open File...', click: function(){ openFile('#openFileDialog'); } }));
fileMenu.append(new gui.MenuItem({ label: 'Open Directory...', click: function(){ openDirectory('#openDirectoryDialog'); } }));
fileMenu.append(new gui.MenuItem({ type: 'separator' }));

var recentMenu = new gui.Menu();
fileMenu.append(new gui.MenuItem({ label: 'Open Recent', submenu: recentMenu }));

fileMenu.append(new gui.MenuItem({ type: 'separator' }));
fileMenu.append(new gui.MenuItem({ label: 'Save', click: function(){ saveSelectedTab(); } }));
fileMenu.append(new gui.MenuItem({ label: 'Save As...', click: function(){ saveFileAs('#saveFileAsDialog'); } }));

mainMenu.append(new gui.MenuItem({ label: 'File', submenu: fileMenu }));

$(document).ready(function()
{
	$("#fileMenu").bind("click", function() 
	{
		var pos = $("#fileMenu").position();
		var height = $("#fileMenu").height();
		var offset = 5;
		fileMenu.popup(Math.floor(pos.left), Math.floor(pos.top+height+offset));
	});
});

// View Menu

var darkThemeMenu = new gui.Menu();

darkThemeMenu.append(new gui.MenuItem({ label: 'Monokai', click: function(){ setTheme('monokai', 'dark'); } }));

var lightThemeMenu = new gui.Menu();

lightThemeMenu.append(new gui.MenuItem({ label: 'Eclipse', click: function(){ setTheme('eclipse', 'light'); } }));
lightThemeMenu.append(new gui.MenuItem({ label: 'Dreamweaver', click: function(){ setTheme('dreamweaver', 'light'); } }));

var themeMenu = new gui.Menu();
themeMenu.append(new gui.MenuItem({ label: 'Dark', submenu: darkThemeMenu }));
themeMenu.append(new gui.MenuItem({ label: 'Light', submenu: lightThemeMenu }));

var viewMenu = new gui.Menu();
viewMenu.append(new gui.MenuItem({ label: 'Theme', submenu: themeMenu }));

mainMenu.append(new gui.MenuItem({ label: 'View', submenu: viewMenu }));

$(document).ready(function()
{
	$("#viewMenu").bind("click", function() 
	{
		var pos = $("#viewMenu").position();
		var height = $("#viewMenu").height();
		var offset = 5;
		viewMenu.popup(Math.floor(pos.left), Math.floor(pos.top+height+offset));
	});
});

// Help Menu

var helpMenu = new gui.Menu();
helpMenu.append(new gui.MenuItem({ label: 'Report bug / suggest feature...', click: function(){ gui.Shell.openExternal('https://github.com/DivineOmega/unnamed-editor/issues/new'); } }));
helpMenu.append(new gui.MenuItem({ label: 'About Continuum Editor', click: function(){ gui.Window.open('about.html', { position: 'center', width: 450, height: 350, frame: true, toolbar: false, resizable: false, focus: true }); } } ) );

mainMenu.append(new gui.MenuItem({ label: 'Help', submenu: helpMenu }));

$(document).ready(function()
{
	$("#helpMenu").bind("click", function() 
	{
		var pos = $("#helpMenu").position();
		var height = $("#helpMenu").height();
		var offset = 5;
		helpMenu.popup(Math.floor(pos.left), Math.floor(pos.top+height+offset));
	});
});

// Window buttons

$(document).ready(function()
{
	var isMaximized = false;
	
	$("#closeButton").bind("click", function() 
	{
		var gui = require('nw.gui');
		gui.App.quit();
	});
	
	$("#maximizeButton").bind("click", function() 
	{
		var gui = require('nw.gui');
		var win = gui.Window.get();
		
		if (isMaximized) win.unmaximize();
		else win.maximize();
		
		isMaximized = !isMaximized;
	});
	
	$("#minimizeButton").bind("click", function() 
	{
		var gui = require('nw.gui');
		var win = gui.Window.get();
		win.minimize();
	});
});
