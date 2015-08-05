
// *** Global Variable - Start ***

// Electron shell includes
var remote = require('remote');
var dialog = remote.require('dialog');

// Node js includes
var os = require('os');
var path = require('path');
var fs = require('fs');
var shell = require('shell');
//var gui = require('nw.gui');

// Define variables
var selectedTabIndex = 0;
var activeTabs = new Array(); // Array of tab objects
var activeDirectoryTree = new Array();
var activeDirectoryTreeRoot = null;
var recentlyAccessed = new Array();
var directoryTreeSidebarHidden = false;
var addonsSidebarHidden = false;

// Setup editor with initial configuration
var editor = ace.edit("editor");
ace.require("ace/ext/language_tools");
var UndoManager = ace.require("ace/undomanager").UndoManager;
var modelist = ace.require("ace/ext/modelist");

// *** Global Variable - End ***

// Initialisation and setup
$(document).ready(function()
{
    // Remove themed Window on OS X
    if (os.platform()=='darwin')
    {
        $('#topMenuBar').hide();
    }
    
	// Set Ui theme
	if (localStorage.uiThemeCssFile==null) localStorage.uiThemeCssFile = '';
	setUiTheme(localStorage.uiThemeCssFile);
	
	// Restore window size
	if (localStorage.windowSize!=null)
	{
		/*
		var win = gui.Window.get();
		if (localStorage.windowSize=='maximized')
		{
			win.maximize();
		}
		else
		{
			try
			{
				var windowSizeParts = localStorage.windowSize.split(',');
				win.resizeTo(windowSizeParts[0], windowSizeParts[1]);
			}
			catch(e)
			{
				console.log('Error recovering window size. Details: '+e);
			}
		}
		*/
	}
	
	// Config default editor parameters
	editor.setFontSize(16);
	editor.getBehavioursEnabled(true); // Quote and bracket pairing
	editor.setHighlightActiveLine(true); 
	editor.setHighlightSelectedWord(true);
	editor.setShowPrintMargin(false); // We're coding, not printing!
	editor.getSession().setMode("ace/mode/php");

	editor.setOptions(
	{
		enableSnippets: true,
		enableBasicAutocompletion: true,
		enableLiveAutocompletion: true
	});
	
	// Hide editor by default (until we have one or more open tabs)
	$('#editor').hide();

	// Set theme
	if (localStorage.themeName==null) localStorage.themeName = 'monokai';
	if (localStorage.themeStyle==null) localStorage.themeStyle = 'dark';
	setTheme(localStorage.themeName, localStorage.themeStyle);

	// Trigger resizing of various elements
	$(window).trigger('resize');
	
	// Restore recently accessed list
	try
	{
		if (localStorage.recentlyAccessed != null)
		{
			recentlyAccessed = JSON.parse(localStorage.recentlyAccessed);
			ui_updateRecentlyAccessedMenu();
		}
	}
	catch(e)
	{
		console.log('Error recovering recently accessed list. Details: '+e);
	}
	
	// Restore previously opened directory tree
	try
	{
	    activeDirectoryTreeRoot = localStorage.activeDirectoryTreeRoot;
	    
	    var directoryTreeFile = activeDirectoryTreeRoot+'/.continuum_directoryTree';
	    
	    var directoryTreeFileContent = fs.readFileSync(directoryTreeFile);
	    
		activeDirectoryTree = JSON.parse(directoryTreeFileContent);
		
		ui_updateDirectoryTree();
	}
	catch(e)
	{
		console.log('Error recovering previously opened directory tree. Details: '+e);
	}
	
	// Restore previously opened tabs
	try
	{
		recoverTabs();
	}
	catch(e)
	{
		console.log('Error recovering previously opened tabs. Details: '+e);
	}
	
	setTimeout(function()
	{
		/*
    	var commandLineArgs = gui.App.argv;
    	
    	for (var i = 0; i < commandLineArgs.length; i++)
        {
            openFileByName(commandLineArgs[i]);
        }
        */
	}, 500);
	
	checkForExternalChanges();
	
	/*
	var win = gui.Window.get();
	win.show();
	*/
});

/*
gui.App.on('open', function(cmdline) 
{
    var commandLineArgs = cmdline.split(' ');
    	
	for (var i = 0; i < commandLineArgs.length; i++)
    {
        openFileByName(commandLineArgs[i]);
    }
});
*/

function checkForExternalChanges()
{
    for (var i = 0; i < activeTabs.length; i++)
    {
        if (!activeTabs[i].lastModified && activeTabs[i].path)
        {
            var stats = fs.statSync(activeTabs[i].path);
            activeTabs[i].lastModified = stats.mtime;
        }
        
        if (activeTabs[i].lastModified && activeTabs[i].path)
        {
            var stats = fs.statSync(activeTabs[i].path);
            if (activeTabs[i].lastModified.getTime() != stats.mtime.getTime())
            {
                if (!activeTabs[i].unsavedChanges)
                {
                    reloadTabContents(i);
                }
                else
                {
                    var result = dialog.showMessageBox({ type: 'question', message: 'The file \''+path.basename(activeTabs[i].path)+'\' has been changed by another program. Would you like to reload this file?',
                                        title: 'External file change', buttons: ['Yes', 'No'] });
                    
                    if (result===0)
                    {
                        reloadTabContents(i);
                    }
                }
                
                activeTabs[i].lastModified = stats.mtime;
            }
        }
    }
    
    setTimeout(function() { checkForExternalChanges(); }, 5000);
}

function addToRecentlyAccessed(path, type)
{
	for (var i = 0; i < recentlyAccessed.length; i++) 
	{
		if (recentlyAccessed[i].path == path) return;
	}
	
	while (recentlyAccessed.length>=20)
	{
	    recentlyAccessed.shift();
	}
	
	var newRecentlyAccessed = { path: path, type: type };
	recentlyAccessed.push(newRecentlyAccessed);
	
	localStorage.recentlyAccessed = JSON.stringify(recentlyAccessed);
	
	ui_updateRecentlyAccessedMenu();
}

function ui_updateRecentlyAccessedMenu()
{
	/*while (recentMenu.items.length > 0) 
	{
        recentMenu.removeAt(0);
    }*/
	
	for (var i = recentlyAccessed.length-1; i > 0; i--) 
	{
		if (recentlyAccessed[i].type=='file')
		{
			var path = recentlyAccessed[i].path;
			
			recentMenu.append(new MenuItem({ label: path, click: makeOpenRecentFunction(path) }));
		}
	}
	
	function makeOpenRecentFunction(path)
	{
		return function() { openFileByName(path); }; 
	}
}

// Recover tabs
function recoverTabs()
{
	var tabsToRecover = JSON.parse(localStorage.tabsToRecover);
	
	for (var i = 0; i < tabsToRecover.length; i++) 
	{
		openFileByName(tabsToRecover[i]);
	}
	
}

// Refresh theme
function refreshTheme()
{
	setTheme(localStorage.themeName, localStorage.themeStyle);
}

// Open a file
function openFile(id) 
{
	var paths = dialog.showOpenDialog({ properties: ['openFile'] });
	
	if (typeof paths == 'undefined') return;
	
	for(var i = 0; i < paths.length; i++)
	{
		openFileByName(paths[i]);
	}
}

function openFileByName(path, lineNumber)
{
	// Check if file is already open in an existing tab
	for (var i = 0; i < activeTabs.length; i++) 
	{
		if (activeTabs[i].path==path)
		{
			ui_switchTab(i);
			setLineNumberAndColumn(lineNumber, 0);
			return;
		}
	}
	
	var isBinaryFile = require("isbinaryfile");
	
	var fileIsBinary = isBinaryFile(path);

	if (fileIsBinary)
	{
	    shell.openItem(path);
	    return;
	}
	
	fs.readFile(path, 'utf8', function (err, fileContent) 
	{
		if (err) 
		{
			alert("Whoops! Error opening file. "+err);
			return;
		}
		
		var mode = modelist.getModeForPath(path).mode;
		
		var editSession = new ace.EditSession(fileContent, mode);
		editSession.setUndoManager(new UndoManager());
		
		var newTab = { path: path, editSession: editSession, unsavedChanges: false };
		activeTabs.push(newTab);
		
		addToRecentlyAccessed(path, 'file');
		
		ui_updateTabs();
		ui_switchTab(activeTabs.length-1);
		
		if (lineNumber) setLineNumberAndColumn(lineNumber, 0);
	});
}

function reloadTabContents(tabIndex)
{
    var path = activeTabs[tabIndex].path;
    
    fs.readFile(path, 'utf8', function (err, fileContent) 
	{
		if (err) 
		{
			alert("Whoops! Error opening file. "+err);
			return;
		}
		
		var mode = modelist.getModeForPath(path).mode;
		
		var editSession = new ace.EditSession(fileContent, mode);
		editSession.setUndoManager(new UndoManager());
		
		activeTabs[tabIndex].editSession.setValue(fileContent);
		activeTabs[tabIndex].unsavedChanges = false;
		
		ui_updateTabs();
	});
}

function openNewFile()
{
	var editSession = new ace.EditSession('');
	editSession.setUndoManager(new UndoManager());
	
	var newTab = { path: '', editSession: editSession, unsavedChanges: false };
	activeTabs.push(newTab);
	
	ui_updateTabs();
	ui_switchTab(activeTabs.length-1);
}

// Update display of tabs
function ui_updateTabs()
{
	var output = '';
	
	for (var i = 0; i < activeTabs.length; i++) 
	{
		output += '<div class="tab" id="'+i+'">';
		
		var additionalClasses = ''; 
		if (activeTabs[i].unsavedChanges===true) additionalClasses += 'tabUnsavedChanges ';
		
		if (activeTabs[i].path)
		{
		    output += '<span class="tabContent '+additionalClasses+'" id="'+i+'" title="'+activeTabs[i].path+'">'+path.basename(activeTabs[i].path)+'</span>';
		}
		else
		{
		    output += '<span class="tabContent '+additionalClasses+'" id="'+i+'" title="File not yet saved.">Untitled Document '+i+'</span>';
		}
		
		output += '<span class="tabCloseButton" id="'+i+'" title="Close tab">&#10006;</span>';
		output += '</div>';
	}
	
	$('#tabs').html(output);
	
	if (activeTabs.length==0) 
	{
	    $('#editor').hide();
	}
	else 
	{
	    $('#editor').show();
	    ui_highlightSelectedTab();
	}
	
	refreshTheme();
	
	storeTabsToRecover();
}

function storeTabsToRecover()
{
	var tabsToRecover = new Array();
	
	for (var i = 0; i < activeTabs.length; i++) 
	{
		tabsToRecover.push(activeTabs[i].path);
	}
	
	localStorage.tabsToRecover = JSON.stringify(tabsToRecover);
	
}

// Switch to tab (passing tab index)
function ui_switchTab(index)
{	
	if (typeof activeTabs[index] !== 'undefined')
	{
		editor.setSession(activeTabs[index].editSession);
		editor.focus();
		selectedTabIndex = index;
	}
	else
	{
		editor.setValue('');
		selectedTabIndex = 0;
	}
	
	ui_highlightSelectedTab();
	
	storeTabsToRecover();
}

function ui_highlightSelectedTab()
{
    for (var i = 0; i < activeTabs.length; i++) 
	{
		if (i==selectedTabIndex)
		{
			if(!$('#'+i+'.tab').hasClass("activeTab")) $('#'+i+'.tab').addClass("activeTab");
		}
		else
		{
			$('#'+i+'.tab').removeClass("activeTab");
		}
	}
}

// Handle tab being clicked
$(document).on('click', ".tab", function()
{
	ui_switchTab($(this).attr('id'));
});

// Handle tab close button being clicked
$(document).on('click', ".tabCloseButton", function(event)
{
	closeTab($(this).attr('id'));
	event.stopPropagation();
});

function closeTab(index)
{
    if (typeof activeTabs[index] == 'undefined') return;
    
    if (activeTabs[index].unsavedChanges===true)
    {
        var result = dialog.showMessageBox({ type: 'warning', message: 'This file is not saved. Do you wish to save it before closing?\n\nFile: '+path.basename(activeTabs[index].path),
                                        title: 'Unsaved Changes', buttons: ['Yes', 'No', 'Cancel'] });
        
        if (result===2)
        {
            return;
        }
        
        if (result===0)
        {
            saveTab(index);
        }
    }
    
    activeTabs[index].editSession = null;
    activeTabs[index] = null;
	activeTabs.splice(index, 1);
	
	ui_updateTabs();
	
	if (index-1>0) ui_switchTab(index-1);
	else ui_switchTab(0);
}

// Open a directory (passing the id of the relevant hidden file input box)
function openDirectory(id) 
{
    var paths = dialog.showOpenDialog({ properties: ['openDirectory'] });
	
	if (typeof paths == 'undefined') return;
	
	for(var i = 0; i < paths.length; i++)
	{
	    openDirectoryByPath(paths[i]);
	}
}

function cloneArray(arrayToClone)
{
    return arrayToClone.slice(0);
}

function openDirectoryByPath(path) 
{
    var maintainDirectoryTreeOpenState = false;
    var oldDirectoryTree = null;
    
    if (activeDirectoryTreeRoot==path)
    {
        maintainDirectoryTreeOpenState = true;
        oldDirectoryTree = cloneArray(activeDirectoryTree);
    }
    
    activeDirectoryTreeRoot = path;
	
	activeDirectoryTree = new Array();
    generateDirectoryTree(activeDirectoryTreeRoot, 0, activeDirectoryTreeRoot);
	
	if (maintainDirectoryTreeOpenState===true)
    {
        for (var i = 0; i < oldDirectoryTree.length; i++) 
        {
            if (oldDirectoryTree[i].isOpen)
            {
                for (var j = 0; j < activeDirectoryTree.length; j++) 
                {
                    if (oldDirectoryTree[i].path==activeDirectoryTree[j].path)
                    {
                        activeDirectoryTree[j].isOpen = true;
                    }
                }
            }
        }
        
        var directoryTreeFile = activeDirectoryTreeRoot+'/.continuum_directoryTree';
        
        try
        {
            fs.writeFileSync(directoryTreeFile, JSON.stringify(activeDirectoryTree, null, 1));
        }
        catch (e)
        {
            alert('Whoops. Couldn\'t write directory tree file to '.fileToWrite);
        }
    }
	
	ui_updateDirectoryTree();
}

function refreshDirectoryTree()
{
    openDirectoryByPath(activeDirectoryTreeRoot);
}

// Update display of directory tree
function ui_updateDirectoryTree()
{
	if (activeDirectoryTree==null) return;
	
	var output = '';
	
	for (var i = 0; i < activeDirectoryTree.length; i++) 
	{
		if (activeDirectoryTree[i].level==0)
		{
			output += ui_generateDirectoryTreeEntryHTML(i);
		}
	}
	
	$('#directoryTree').html(output);
	
	for (i = 0; i < activeDirectoryTree.length; i++) 
	{
	   if (activeDirectoryTree[i].isOpen)
	   {
	       ui_expandDirectoryTreeEntry(i);
	   }
	}
	
	refreshTheme();
}

// Handle directory tree entry being clicked
$(document).on('click', ".directoryTreeEntry", function()
{
	var id = $(this).attr('id');
	var directoryTreeEntry = activeDirectoryTree[id];
	
	if (directoryTreeEntry.type=='file')
	{
		openFileByName(directoryTreeEntry.path);
	}
	else if (directoryTreeEntry.type=='directory')
	{
		if (directoryTreeEntry.isOpen==false) ui_expandDirectoryTreeEntry(id);
		else ui_contractDirectoryTreeEntry(id);
		
		activeDirectoryTree[id].isOpen = !directoryTreeEntry.isOpen;
		
		localStorage.activeDirectoryTree = JSON.stringify(activeDirectoryTree);
		
		refreshTheme();
	}
});

function ui_expandDirectoryTreeEntry(id)
{
	var directoryTreeEntry = activeDirectoryTree[id];
    
    var output = '';
	
	for (var i = 0; i < activeDirectoryTree.length; i++) 
	{
		if (i == id) continue;
		
		if (activeDirectoryTree[i].path.indexOf(directoryTreeEntry.path)>-1)
		{
			
			if (activeDirectoryTree[i].level==directoryTreeEntry.level+1)
			{						
				output += ui_generateDirectoryTreeEntryHTML(i);
			}
		}
	}
	
    $('#'+id+'.directoryTreeEntry').after(output);
}

function ui_contractDirectoryTreeEntry(id)
{
    var directoryTreeEntry = activeDirectoryTree[id];
    
	for (var i = 0; i < activeDirectoryTree.length; i++) 
	{
		if (i == id) continue;
		
		if (activeDirectoryTree[i].path.indexOf(directoryTreeEntry.path)>-1)
		{
			$('#'+i+'.directoryTreeEntry').remove();
			
			activeDirectoryTree[i].isOpen = false;
		}
	}
}

function ui_generateDirectoryTreeEntryHTML(i)
{
	var margin = activeDirectoryTree[i].level * 10;
	
	var additionalClasses = 'level'+activeDirectoryTree[i].level;
	
	var fileTypeImage = 'text70.svg';
	if (activeDirectoryTree[i].type=='directory') fileTypeImage = 'folder215.svg';
	
	var output = '';
	
	output += '<div class="directoryTreeEntry '+additionalClasses+'" id="'+i+'" style="margin-left: '+margin+'px;" title="'+activeDirectoryTree[i].path+'">';
	output += '<img src="images/'+fileTypeImage+'" /> ';
	output += path.basename(activeDirectoryTree[i].path);
	output += '</div>'
	
	return output;
}

function saveTab(index)
{
    var activeTab = activeTabs[index];
	
	// If there is no active tab, there is nothing to save
	if (typeof activeTab === 'undefined') return;
	
	if (!activeTab.path)
	{
	    saveFileAs('#saveFileAsDialog');
	    return;
	}
	
	var dataToSave = activeTab.editSession.getValue();
		
	try
	{
		fs.writeFileSync(activeTab.path, dataToSave);
		
		activeTabs[index].unsavedChanges = false;
		activeTabs[index].lastModified = null;
        ui_updateTabs();
	}
	catch (err)
	{
		alert('Bogus, save error: '+err);
	}
}

function saveSelectedTab()
{
	return saveTab(selectedTabIndex);
}

function saveSelectedTabAs(newPath)
{
	var activeTab = activeTabs[selectedTabIndex];
	
	var dataToSave = activeTab.editSession.getValue();
		
	try
	{
		fs.writeFileSync(newPath, dataToSave);
		activeTab.path = newPath;
		
		activeTabs[selectedTabIndex].unsavedChanges = false;
		activeTabs[selectedTabIndex].lastModified = null;
        ui_updateTabs();
	}
	catch (err)
	{
		alert('Bogus, save error: '+err);
	}
}

// Save file as (with different name) (passing the id of the relevant hidden file input box)
function saveFileAs(id) 
{
	var chooser = $(id);
	
	chooser.change(function() 
	{
		var path = $(this).val();
		
		saveSelectedTabAs(path);
		
		$(this).val('');
		
		chooser.off('change');
	});

	chooser.trigger('click');  
}

function setTheme(themeName, themeStyle)
{
	editor.setTheme('ace/theme/'+themeName);
	
	if (themeStyle=='light')
	{
		$('#editor .ace_content').css('background-color', '#fff');
	}
	else
	{
		$('#editor .ace_content').css('background-color', '');
	}
	
	localStorage.themeName = themeName;
	localStorage.themeStyle = themeStyle;
}

function setUiTheme(cssFile)
{
	$('#uiTheme').attr('href', cssFile);
	
	localStorage.uiThemeCssFile = cssFile;
}

function generateDirectoryTree(currentDirectory, level, previousDirectory)
{
	try
	{		
		var files = fs.readdirSync(currentDirectory);
			
		for (var i = 0; i < files.length; i++) 
		{
			var currentPath = currentDirectory + path.sep + files[i]
			
			var fileLStat = fs.lstatSync(currentPath);
			
			try
			{
				if (fileLStat.isDirectory())
				{
					var newDirectoryTreeEntry = { path: currentPath + path.sep, type: 'directory', level: level, previousDirectory: previousDirectory, isOpen: false };
					activeDirectoryTree.push(newDirectoryTreeEntry);
					
					generateDirectoryTree(currentPath, level + 1, currentDirectory);
				}
				else if (fileLStat.isFile())
				{
					var newDirectoryTreeEntry = { path: currentPath, type: 'file', level: level, previousDirectory: currentDirectory, isOpen: false };
					activeDirectoryTree.push(newDirectoryTreeEntry);
				}
			}
			catch (err)
			{
				console.log(err);
			}
		}
		
		if (level==0)
		{
		    activeDirectoryTree.sort(sort_by_type_and_path(false));
		    
		    localStorage.activeDirectoryTreeRoot = currentDirectory;
			localStorage.activeDirectoryTree = JSON.stringify(activeDirectoryTree);
			addToRecentlyAccessed(currentDirectory, 'directory');
		}
	}
	catch (err)
	{
		console.log(err);
	}
}

function sort_by_type_and_path(reverse){

   var key = function(x) { return (x['type']+x['path']).toLowerCase() };

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}

function sort_object_by_field(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}

editor.on('change', function()
{
    if (typeof activeTabs[selectedTabIndex] == 'undefined') return;
    activeTabs[selectedTabIndex].unsavedChanges = true; 
    ui_updateTabs();
});

// Handle left tab scroll button being clicked
$(document).on('click', '#tabsScrollButtonLeft', function()
{
	$('#tabsContainer').animate({ scrollLeft: '-=400' }, 250);
});

// Handle right tab scroll button being clicked
$(document).on('click', '#tabsScrollButtonRight', function()
{
	$('#tabsContainer').animate({ scrollLeft: '+=400' }, 250);
});

// Handle right sidebar left tab scroll button being clicked
$(document).on('click', '#rightTabsScrollButtonLeft', function()
{
	$('#rightTabsContainer').animate({ scrollLeft: '-=100' }, 250);
});

// Handle right sidebar right tab scroll button being clicked
$(document).on('click', '#rightTabsScrollButtonRight', function()
{
	$('#rightTabsContainer').animate({ scrollLeft: '+=100' }, 250);
});

/*
gui.Window.get().on('maximize', function () 
{
	localStorage.windowSize = 'maximized';
});

gui.Window.get().on('unmaximize', function () 
{
	var win = gui.Window.get();
	localStorage.windowSize = win.width+','+win.height;
});
*/

// Handle resizing of various elements when the window is resized
$(window).on('resize', function()
{
	var leftWidth = $('#left').outerWidth();
	if (directoryTreeSidebarHidden) leftWidth = 40;
	
	var rightWidth = $('#right').outerWidth();
	if (addonsSidebarHidden) rightWidth = 40;
	
	var tabContainerWidth = $(window).outerWidth() - leftWidth - rightWidth /*- $('#tabsScrollButtons').outerWidth()*/;
	$('#tabsContainer').outerWidth(tabContainerWidth);
	
	var editorWidth = $(window).outerWidth() - leftWidth - rightWidth;
	$('#editor').outerWidth(editorWidth);
	
	var rightContentHeight = $(window).outerHeight() - $('#topMenuBar').outerHeight() - 16;
	$('#rightContent').outerHeight(rightContentHeight);
	
	var leftContentHeight = $(window).outerHeight() - $('#topMenuBar').outerHeight() - 16;
	$('#leftContent').outerHeight(leftContentHeight);
	
	var directoryTreeHeight = $('#leftContent').outerHeight() - 75;
	$('#leftContent #directoryTree').outerHeight(directoryTreeHeight);

    var addonContentHeight = $('#rightContent').outerHeight() - $('#rightSelect').outerHeight() - 115;
	$('#rightContent #addonContent').outerHeight(addonContentHeight);

	editor.resize(true);
	
	if (localStorage.windowSize!='maximized')
	{
		/*
		var win = gui.Window.get();
		localStorage.windowSize = win.width+','+win.height;
		*/
	}
});

$(document).on('click', '#refreshDirectionTreeButton', function()
{
    $('#refreshDirectionTreeButton').html('&#8635; Refreshing...');
    
    setTimeout(function() 
    { 
		refreshDirectoryTree(); 
		$('#refreshDirectionTreeButton').html('&#8635; Refresh Files'); 
	}, 250);
});

$(document).on("dragover", function(e) {
    event.preventDefault();  
    event.stopPropagation();
});

$(document).on("dragleave", function(e) {
    event.preventDefault();  
    event.stopPropagation();
});

$(document).on("drop", function(e) {
    event.preventDefault();  
    event.stopPropagation();
    
    for (var i = 0; i < e.originalEvent.dataTransfer.files.length; ++i) 
    {
		var pathToOpen = e.originalEvent.dataTransfer.files[i].path;
		
		openFileByName(pathToOpen)
	}
    
  return false;
});

function ui_switchTabRight()
{
    var newTabIndex = selectedTabIndex+1;
    
    if (newTabIndex>activeTabs.length-1)
    {
        newTabIndex = 0;
    }
    
    ui_switchTab(newTabIndex);
}

function ui_switchTabLeft()
{
    var newTabIndex = selectedTabIndex-1;
    
    if (newTabIndex<0)
    {
        newTabIndex = activeTabs.length-1;
    }
    
    ui_switchTab(newTabIndex);
}

function closeActiveTab()
{
    closeTab(selectedTabIndex);
}

function setLineNumberAndColumn(lineNumber, column)
{
    editor.gotoLine(lineNumber, column, true);
}

function promptAndGotoLineNumber()
{
    var lineNumber = prompt('Line number: ');
    if (lineNumber!==null && lineNumber!==false) setLineNumberAndColumn(lineNumber, 0);
    editor.focus();
}

window.onbeforeunload = function(e)
{
    exitContinuum();
    return false;
}

function exitContinuum()
{
    exitChecks();
}

function exitChecks()
{
    var unsavedTabsCount = 0;
    
    var i = 0;
    
    while(i < activeTabs.length)
	{
		if (activeTabs[i].unsavedChanges===true) unsavedTabsCount++;
		
		i++;
	}
	
    if (unsavedTabsCount===0) exitFinal();
    
    var pluralString = 's';
    if (unsavedTabsCount===1) pluralString = '';
    
    var result = dialog.showMessageBox({ type: 'warning', message: 'You have '+unsavedTabsCount+' unsaved tab'+pluralString+'.\n\nExit anyway?',
                                        title: 'Exit Continuum?', buttons: ['Yes', 'No'] });
    
    if (result===0) exitFinal();
}


function exitFinal()
{
    gui.App.quit();
}

function toggleDirectoryTreeSidebar()
{
    if (directoryTreeSidebarHidden)
    {
        $('#left').animate({'left': 0}, 500);
        $('#editor').animate({'left': $('#left').outerWidth(), 'width': $('#editor').outerWidth()-$('#left').outerWidth()+40}, 500);
        $('#tabsContainer').animate({'left': $('#left').outerWidth(), 'width': $('#tabsContainer').outerWidth()-$('#left').outerWidth()+40}, 500);
        
        $('#leftUnminimizeButton').fadeOut(500);
    }
    else
    {
        $('#left').animate({'left': -$('#left').outerWidth()}, 500);
        $('#editor').animate({'left': 40, 'width': $('#editor').outerWidth()+$('#left').outerWidth()-40}, 500);
        $('#tabsContainer').animate({'left': 40, 'width': $('#tabsContainer').outerWidth()+$('#left').outerWidth()-40}, 500);
        
        $('#leftUnminimizeButton').fadeIn(1000);
    }
    
    setTimeout(function() { editor.resize(true); }, 500);
    
    directoryTreeSidebarHidden = !directoryTreeSidebarHidden;
}

function toggleAddonsSidebar()
{
    if (addonsSidebarHidden)
    {
        $('#right').animate({'right': 0}, 500);
        $('#tabsScrollButtons').animate({'right': $('#right').outerWidth()}, 500);
        $('#editor').animate({'width': $('#editor').outerWidth()-$('#right').outerWidth()+40}, 500);
        $('#tabsContainer').animate({'width': $('#tabsContainer').outerWidth()-$('#right').outerWidth()+40}, 500);
    
        $('#rightUnminimizeButton').fadeOut(500);
    }
    else
    {
        $('#right').animate({'right': -$('#right').outerWidth()}, 500);
        $('#tabsScrollButtons').animate({'right': 0}, 500);
        $('#editor').animate({'width': $('#editor').outerWidth()+$('#right').outerWidth()-40}, 500);
        $('#tabsContainer').animate({'width': $('#tabsContainer').outerWidth()+$('#right').outerWidth()-40}, 500);
    
        $('#rightUnminimizeButton').fadeIn(1000);
    }
    
    setTimeout(function() { editor.resize(true); }, 500);
    
    addonsSidebarHidden = !addonsSidebarHidden;
}

function toggleWordWrap()
{
    var currentUseWrapMode =  editor.getSession().getUseWrapMode();
    
    editor.getSession().setUseWrapMode(!currentUseWrapMode);
}

$(document).on('click', '#leftMinimizeButton', function()
{
    toggleDirectoryTreeSidebar();
});

$(document).on('click', '#leftUnminimizeButton', function()
{
    toggleDirectoryTreeSidebar();
});

$(document).on('click', '#rightMinimizeButton', function()
{
    toggleAddonsSidebar();
});

$(document).on('click', '#rightUnminimizeButton', function()
{
    toggleAddonsSidebar();
});
