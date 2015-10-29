
var os = require('os');

var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var mainMenu = new Menu({ type: 'menubar' });

// File Menu

var fileMenu = new Menu();
fileMenu.append(new MenuItem({ label: 'New', click: function(){ openNewFile(); } }));
fileMenu.append(new MenuItem({ label: 'Open File...', click: function(){ openFile('#openFileDialog'); } }));
fileMenu.append(new MenuItem({ label: 'Open Directory...', click: function(){ openDirectory('#openDirectoryDialog'); } }));
fileMenu.append(new MenuItem({ type: 'separator' }));

var recentMenu = new Menu();
fileMenu.append(new MenuItem({ label: 'Open Recent', submenu: recentMenu }));

fileMenu.append(new MenuItem({ type: 'separator' }));
fileMenu.append(new MenuItem({ label: 'Save', click: function(){ saveSelectedTab(); } }));
fileMenu.append(new MenuItem({ label: 'Save As...', click: function(){ saveFileAs('#saveFileAsDialog'); } }));

mainMenu.append(new MenuItem({ label: 'File', submenu: fileMenu }));

$(document).ready(function()
{
	$("#fileMenu").bind("click", function() 
	{
		var pos = $("#fileMenu").position();
		var height = $("#fileMenu").height();
		var offset = 5;
		fileMenu.popup(remote.getCurrentWindow());
	});
});

// Edit Menu

var editMenu = new Menu();
editMenu.append(new MenuItem({ label: 'Cut', click: function()
{ 
    gui.Clipboard.get().set(editor.session.getTextRange(editor.getSelectionRange()), 'text'); 
    editor.getSession().getDocument().remove(editor.getSelectionRange()); 
}}));


editMenu.append(new MenuItem({ label: 'Copy', click: function()
{ 
    gui.Clipboard.get().set(editor.session.getTextRange(editor.getSelectionRange()), 'text'); 
}}));

editMenu.append(new MenuItem({ label: 'Paste', click: function()
{ 
    editor.getSession().getDocument().remove(editor.getSelectionRange()); editor.getSession().getDocument().insert(editor.getCursorPosition(), gui.Clipboard.get().get('text')); 
}}));

editMenu.append(new MenuItem({ type: 'separator' }));

editMenu.append(new MenuItem({ label: 'Word Wrap', click: function(){ toggleWordWrap(); }}));

mainMenu.append(new MenuItem({ label: 'Edit', submenu: editMenu }));

$(document).ready(function()
{
	$("#editMenu").bind("click", function() 
	{
		var pos = $("#editMenu").position();
		var height = $("#editMenu").height();
		var offset = 5;
		editMenu.popup(remote.getCurrentWindow());
	});
});

// Search Menu

var searchMenu = new Menu();
searchMenu.append(new MenuItem({ label: 'Go to line number', click: function()
{ 
    promptAndGotoLineNumber();
}}));

mainMenu.append(new MenuItem({ label: 'Search', submenu: searchMenu }));

$(document).ready(function()
{
	$("#searchMenu").bind("click", function() 
	{
		var pos = $("#searchMenu").position();
		var height = $("#searchMenu").height();
		var offset = 5;
		searchMenu.popup(remote.getCurrentWindow());
	});
});

// View Menu

var darkThemeMenu = new Menu();

darkThemeMenu.append(new MenuItem({ label: 'Monokai', click: function(){ setTheme('monokai', 'dark'); } }));

var lightThemeMenu = new Menu();

lightThemeMenu.append(new MenuItem({ label: 'Eclipse', click: function(){ setTheme('eclipse', 'light'); } }));
lightThemeMenu.append(new MenuItem({ label: 'Dreamweaver', click: function(){ setTheme('dreamweaver', 'light'); } }));
lightThemeMenu.append(new MenuItem({ label: 'Notepad++', click: function(){ setTheme('notepadplusplus', 'light'); } }));

var themeMenu = new Menu();
themeMenu.append(new MenuItem({ label: 'Dark', submenu: darkThemeMenu }));
themeMenu.append(new MenuItem({ label: 'Light', submenu: lightThemeMenu }));

var glob = require("glob");
var path = require('path');

var darkUiThemeMenu = new Menu();
darkUiThemeMenu.append(new MenuItem({ label: 'Continuum (default)', click: function(){ setUiTheme(''); } }));

glob("css/ui_theme/dark/*.css", null, function (er, files)
{
	var i = 0;
    		
	while (i < files.length)
	{
		var file = files[i];
		
		var uiThemeName = (path.basename(file).charAt(0).toUpperCase() + path.basename(file).slice(1)).replace('.css', '');
	
		darkUiThemeMenu.append(new MenuItem({ label: uiThemeName, click: function(){ setUiTheme(file); } }));
	
		i++;
	}
	
});

var lightUiThemeMenu = new Menu();

glob("css/ui_theme/light/*.css", null, function (er, files)
{
	var i = 0;
    		
	while (i < files.length)
	{
		var file = files[i];
		
		var uiThemeName = (path.basename(file).charAt(0).toUpperCase() + path.basename(file).slice(1)).replace('.css', '');
	
		lightUiThemeMenu.append(new MenuItem({ label: uiThemeName, click: function(){ setUiTheme(file); } }));
	
		i++;
	}
	
});

var uiThemeMenu = new Menu();
uiThemeMenu.append(new MenuItem({ label: 'Dark', submenu: darkUiThemeMenu }));
uiThemeMenu.append(new MenuItem({ label: 'Light', submenu: lightUiThemeMenu }));

var sidebarsMenu = new Menu();
sidebarsMenu.append(new MenuItem({ label: 'Left (directory tree)', click: function() { toggleDirectoryTreeSidebar(); } }));
sidebarsMenu.append(new MenuItem({ label: 'Right (addons)', click: function() { toggleAddonsSidebar(); } }));

var viewMenu = new Menu();
viewMenu.append(new MenuItem({ label: 'Editor Theme', submenu: themeMenu }));
viewMenu.append(new MenuItem({ label: 'UI Theme', submenu: uiThemeMenu }));
viewMenu.append(new MenuItem({ label: 'Sidebars', submenu: sidebarsMenu }));

mainMenu.append(new MenuItem({ label: 'View', submenu: viewMenu }));

$(document).ready(function()
{
	$("#viewMenu").bind("click", function() 
	{
		var pos = $("#viewMenu").position();
		var height = $("#viewMenu").height();
		var offset = 5;
		viewMenu.popup(remote.getCurrentWindow());
	});
});

// Help Menu

var helpMenu = new Menu();
helpMenu.append(new MenuItem({ label: 'Report bug / suggest feature...', click: function(){

    var shell = require('shell');
    shell.openExternal('https://github.com/Continuum-Editor/Continuum-Editor/issues/new');
    
} }));

helpMenu.append(new MenuItem({ label: 'About Continuum Editor', click: function(){ 
    
    window.open('about.html');
    
} } ) );

mainMenu.append(new MenuItem({ label: 'Help', submenu: helpMenu }));

$(document).ready(function()
{
	$("#helpMenu").bind("click", function() 
	{
		var pos = $("#helpMenu").position();
		var height = $("#helpMenu").height();
		var offset = 5;
		helpMenu.popup(remote.getCurrentWindow());
	});
});

// Window buttons

$(document).ready(function()
{
	var isMaximized = false;
	
	$("#closeButton").bind("click", function() 
	{
		exitContinuum();
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

// Directory listing menu

var directoryTreeEntryIDForContextMenu = null;

var directoryListingMenu = new Menu();

directoryListingMenu.append(new MenuItem({ label: 'Rename...', click: function()
{  
    var directoryTreeEntry = activeDirectoryTree[directoryTreeEntryIDForContextMenu];
    
    smalltalk.prompt('Rename file', 'Rename '+path.basename(directoryTreeEntry.path)+' to: ', path.basename(directoryTreeEntry.path)).then(function(newFilename)
    {
        newFilename = path.basename(newFilename);

        if (newFilename===null || newFilename==='null' || newFilename==='') return;
        
        var newPath = path.dirname(directoryTreeEntry.path) + path.sep + newFilename;
        
        fs.renameSync(directoryTreeEntry.path, newPath);
        
        for (var i = 0; i < activeTabs.length; i++) 
        {
            if (activeTabs[i].path == directoryTreeEntry.path)
            {
                activeTabs[i].path = newPath;
            }
        }
        
        ui_updateTabs();
        refreshDirectoryTree();
    }, function()
    {
        
    });
    
} }));

directoryListingMenu.append(new MenuItem({ label: 'Create new file here...', click: function()
{
    var directoryTreeEntry = activeDirectoryTree[directoryTreeEntryIDForContextMenu];
    
    var randNum = Math.floor((Math.random() * 99999) + 1);
    
    var creationPath = null;
    
    if (directoryTreeEntry.type=='file') creationPath = path.dirname(directoryTreeEntry.path);
    else creationPath = directoryTreeEntry.path;
    
    var newFilename = prompt('Creating a new file here: '+creationPath+'\n\nName the new file:', 'new_file_'+randNum+'.txt');

    newFilename = path.basename(newFilename);

    if (newFilename===null || newFilename==='null' || newFilename==='') return;
    
    var newPath = creationPath + path.sep + newFilename;
    
    fs.closeSync(fs.openSync(newPath, 'a'));
    
    openFileByName(newPath);
    
    refreshDirectoryTree();
    
} }));

directoryListingMenu.append(new MenuItem({ label: 'Create new directory here...', click: function()
{
    var directoryTreeEntry = activeDirectoryTree[directoryTreeEntryIDForContextMenu];
    
    var randNum = Math.floor((Math.random() * 99999) + 1);
    
    var creationPath = null;
    
    if (directoryTreeEntry.type=='file') creationPath = path.dirname(directoryTreeEntry.path);
    else creationPath = directoryTreeEntry.path;
    
    var newFilename = prompt('Creating a new directory here: '+creationPath+'\n\nName the new directory:', 'new_directory_'+randNum);

    newFilename = path.basename(newFilename);

    if (newFilename===null || newFilename==='null' || newFilename==='') return;
    
    var newPath = creationPath + path.sep + newFilename;
    
    fs.mkdirSync(newPath);
    
    refreshDirectoryTree();
    
} }));

$(document).ready(function()
{
    $(document).on('contextmenu', '.directoryTreeEntry', function()
    {
        directoryTreeEntryIDForContextMenu = $(this).attr('id');
        var pos = $(this).position();
		var height = $(this).height();
		var offset = 40;
		directoryListingMenu.popup(remote.getCurrentWindow());
    });
});

Menu.setApplicationMenu(mainMenu);
