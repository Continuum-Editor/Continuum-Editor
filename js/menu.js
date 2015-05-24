
var os = require('os');

var mainMenu = new gui.Menu({ type: 'menubar' });

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

// Edit Menu

var editMenu = new gui.Menu();
editMenu.append(new gui.MenuItem({ label: 'Cut', click: function()
{ 
    gui.Clipboard.get().set(editor.session.getTextRange(editor.getSelectionRange()), 'text'); 
    editor.getSession().getDocument().remove(editor.getSelectionRange()); 
}}));


editMenu.append(new gui.MenuItem({ label: 'Copy', click: function()
{ 
    gui.Clipboard.get().set(editor.session.getTextRange(editor.getSelectionRange()), 'text'); 
}}));

editMenu.append(new gui.MenuItem({ label: 'Paste', click: function()
{ 
    editor.getSession().getDocument().remove(editor.getSelectionRange()); editor.getSession().getDocument().insert(editor.getCursorPosition(), gui.Clipboard.get().get('text')); 
}}));

mainMenu.append(new gui.MenuItem({ label: 'Edit', submenu: editMenu }));

$(document).ready(function()
{
	$("#editMenu").bind("click", function() 
	{
		var pos = $("#editMenu").position();
		var height = $("#editMenu").height();
		var offset = 5;
		editMenu.popup(Math.floor(pos.left), Math.floor(pos.top+height+offset));
	});
});

// Search Menu

var searchMenu = new gui.Menu();
searchMenu.append(new gui.MenuItem({ label: 'Go to line number', click: function()
{ 
    promptAndGotoLineNumber();
}}));

mainMenu.append(new gui.MenuItem({ label: 'Search', submenu: searchMenu }));

$(document).ready(function()
{
	$("#searchMenu").bind("click", function() 
	{
		var pos = $("#searchMenu").position();
		var height = $("#searchMenu").height();
		var offset = 5;
		searchMenu.popup(Math.floor(pos.left), Math.floor(pos.top+height+offset));
	});
});

// View Menu

var darkThemeMenu = new gui.Menu();

darkThemeMenu.append(new gui.MenuItem({ label: 'Monokai', click: function(){ setTheme('monokai', 'dark'); } }));

var lightThemeMenu = new gui.Menu();

lightThemeMenu.append(new gui.MenuItem({ label: 'Eclipse', click: function(){ setTheme('eclipse', 'light'); } }));
lightThemeMenu.append(new gui.MenuItem({ label: 'Dreamweaver', click: function(){ setTheme('dreamweaver', 'light'); } }));
lightThemeMenu.append(new gui.MenuItem({ label: 'Notepad++', click: function(){ setTheme('notepadplusplus', 'light'); } }));

var themeMenu = new gui.Menu();
themeMenu.append(new gui.MenuItem({ label: 'Dark', submenu: darkThemeMenu }));
themeMenu.append(new gui.MenuItem({ label: 'Light', submenu: lightThemeMenu }));

var glob = require("glob");
var path = require('path');

var darkUiThemeMenu = new gui.Menu();
darkUiThemeMenu.append(new gui.MenuItem({ label: 'Continuum (default)', click: function(){ setUiTheme(''); } }));

glob("css/ui_theme/dark/*.css", null, function (er, files)
{
	var i = 0;
    		
	while (i < files.length)
	{
		var file = files[i];
		
		var uiThemeName = (path.basename(file).charAt(0).toUpperCase() + path.basename(file).slice(1)).replace('.css', '');
	
		darkUiThemeMenu.append(new gui.MenuItem({ label: uiThemeName, click: function(){ setUiTheme(file); } }));
	
		i++;
	}
	
});

var lightUiThemeMenu = new gui.Menu();

glob("css/ui_theme/light/*.css", null, function (er, files)
{
	var i = 0;
    		
	while (i < files.length)
	{
		var file = files[i];
		
		var uiThemeName = (path.basename(file).charAt(0).toUpperCase() + path.basename(file).slice(1)).replace('.css', '');
	
		lightUiThemeMenu.append(new gui.MenuItem({ label: uiThemeName, click: function(){ setUiTheme(file); } }));
	
		i++;
	}
	
});

var uiThemeMenu = new gui.Menu();
uiThemeMenu.append(new gui.MenuItem({ label: 'Dark', submenu: darkUiThemeMenu }));
uiThemeMenu.append(new gui.MenuItem({ label: 'Light', submenu: lightUiThemeMenu }));

var sidebarsMenu = new gui.Menu();
sidebarsMenu.append(new gui.MenuItem({ label: 'Left (directory tree)', click: function() { toggleDirectoryTreeSidebar(); } }));
sidebarsMenu.append(new gui.MenuItem({ label: 'Right (addons)', click: function() { toggleAddonsSidebar(); } }));

var viewMenu = new gui.Menu();
viewMenu.append(new gui.MenuItem({ label: 'Editor Theme', submenu: themeMenu }));
viewMenu.append(new gui.MenuItem({ label: 'UI Theme', submenu: uiThemeMenu }));
viewMenu.append(new gui.MenuItem({ label: 'Sidebars', submenu: sidebarsMenu }));

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
helpMenu.append(new gui.MenuItem({ label: 'Report bug / suggest feature...', click: function(){ gui.Shell.openExternal('https://github.com/Continuum-Editor/Continuum-Editor/issues/new'); } }));
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

var directoryListingMenu = new gui.Menu();

directoryListingMenu.append(new gui.MenuItem({ label: 'Rename...', click: function()
{  
    var directoryTreeEntry = activeDirectoryTree[directoryTreeEntryIDForContextMenu];
    
    var newFilename = prompt('Rename '+path.basename(directoryTreeEntry.path)+' to: ', path.basename(directoryTreeEntry.path));

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
    
} }));

directoryListingMenu.append(new gui.MenuItem({ label: 'Create new file here...', click: function()
{
    var directoryTreeEntry = activeDirectoryTree[directoryTreeEntryIDForContextMenu];
    
    var randNum = Math.floor((Math.random() * 99999) + 1);
    
    var creationPath = null;
    
    if (directoryTreeEntry.type=='file') creationPath = path.dirname(directoryTreeEntry.path);
    else creationPath = directoryTreeEntry.path;
    
    var newFilename = prompt('Creating a new file here: '+creationPath+'\n\nName the new name:', 'new_file_'+randNum+'.txt');

    newFilename = path.basename(newFilename);

    if (newFilename===null || newFilename==='null' || newFilename==='') return;
    
    var newPath = creationPath + path.sep + newFilename;
    
    fs.closeSync(fs.openSync(newPath, 'a'));
    
    openFileByName(newPath);
    
    refreshDirectoryTree();
    
} }));

directoryListingMenu.append(new gui.MenuItem({ label: 'Create new directory here...', click: function()
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
		directoryListingMenu.popup(Math.floor(pos.left), Math.floor(pos.top+height+offset));
    });
});

if (os.platform()=='darwin')
{
    gui.Window.get().menu = mainMenu;
}