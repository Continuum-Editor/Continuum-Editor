
// *** Global Variable - Start ***

// Node js includes
var path = require('path');
var fs = require('fs')

// Define variables
var selectedTabIndex = 0;
var activeTabs = new Array(); // Array of tab objects
var activeDirectoryTree = new Array();

// Setup editor with initial configuration
var editor = ace.edit("editor");
ace.require("ace/ext/language_tools")
var UndoManager = ace.require("ace/undomanager").UndoManager;
var modelist = ace.require("ace/ext/modelist");

// *** Global Variable - End ***

// Initialisation and setup
$(document).ready(function()
{
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

	// Set theme
	if (localStorage.themeName==null) localStorage.themeName = 'eclipse';
	if (localStorage.themeStyle==null) localStorage.themeStyle = 'light';
	setTheme(localStorage.themeName, localStorage.themeStyle);

	// Restore previously opened directory tree
	try
	{
		activeDirectoryTree = JSON.parse(localStorage.activeDirectoryTree);
		ui_updateDirectoryTree();
	}
	catch(e)
	{
		console.log('Error decoded previously opened directory tree. Details: '+e);
	}
});

// Refresh theme
function refreshTheme()
{
	setTheme(localStorage.themeName, localStorage.themeStyle);
}

// Open a file (passing the id of the relevant hidden file input box)
function openFile(id) 
{
	var chooser = $(id);
	
	chooser.change(function() 
	{
		var path = $(this).val();
		
		openFileByName(path);
		
		$(this).val('');
		
		chooser.off('change');
	});

	chooser.trigger('click');  
}

function openFileByName(path)
{
	// Check if file is already open in an existing tab
	for (var i = 0; i < activeTabs.length; i++) 
	{
		if (activeTabs[i].path==path)
		{
			ui_switchTab(i);
			return;
		}
	}
	
	fs.readFile(path, 'utf8', function (err, fileContent) 
	{
		if (err) 
		{
			alert("Whoops! Error opening file. "+err);
			return;
		}
		
		// TODO: Change the editor's mode to reflect the type of file opened
		
		var mode = modelist.getModeForPath(path).mode;
		
		var editSession = new ace.EditSession(fileContent, mode);
		editSession.setUndoManager(new UndoManager());
		
		var newTab = { path: path, editSession: editSession };
		activeTabs.push(newTab);
		
		ui_updateTabs();
		ui_switchTab(activeTabs.length-1);
	});
}

// Update display of tabs
function ui_updateTabs()
{
	var output = '';
	
	for (var i = 0; i < activeTabs.length; i++) 
	{
		output += '<div class="tab">';
		output += '<span class="tabContent" id="'+i+'">'+path.basename(activeTabs[i].path)+'</span>';
		output += '<span class="tabCloseButton" id="'+i+'">&#10006;</span>';
		output += '</div>'
	}
	
	$('#tabs').html(output);
	
	refreshTheme();
}

// Switch to tab (passing tab index)
function ui_switchTab(index)
{
	if (typeof activeTabs[index] !== 'undefined')
	{
		editor.setSession(activeTabs[index].editSession);
		selectedTabIndex = index;
	}
	else
	{
		editor.setValue('');
		selectedTabIndex = 0;
	}
	
}

// Handle tab being clicked
$(document).on('click', ".tabContent", function()
{
	ui_switchTab($(this).attr('id'));
});

// Handle tab close button being clicked
$(document).on('click', ".tabCloseButton", function()
{
	closeTab($(this).attr('id'));
});

function closeTab(index)
{
	activeTabs.splice(index, 1);
	
	if (index-1>0) ui_switchTab(index-1);
	else ui_switchTab(0);
	
	ui_updateTabs();
}

// Open a directory (passing the id of the relevant hidden file input box)
function openDirectory(id) 
{
	var chooser = $(id);
	chooser.change(function() 
	{
		var directoryToOpen = $(this).val();
		
		activeDirectoryTree = new Array();
		generateDirectoryTree(directoryToOpen, 0, directoryToOpen);
		
		ui_updateDirectoryTree();
		
		chooser.off('change');
	});

	chooser.trigger('click');  
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
		var output = '';
		
		for (var i = id; i < activeDirectoryTree.length; i++) 
		{
			if (i == id) continue;
			
			if (activeDirectoryTree[i].path.indexOf(directoryTreeEntry.path)>-1)
			{
				if (directoryTreeEntry.isOpen==false)
				{
					if (activeDirectoryTree[i].level==directoryTreeEntry.level+1)
					{						
						output += ui_generateDirectoryTreeEntryHTML(i);
					}
				}
				else
				{
					$('#'+i+'.directoryTreeEntry').remove();
					
					activeDirectoryTree[i].isOpen = false;
				}
			}
			else
			{
				break;
			}
		}
		
		$(this).after(output);
		
		refreshTheme();
	}
	
	directoryTreeEntry.isOpen = !directoryTreeEntry.isOpen;
});

function ui_generateDirectoryTreeEntryHTML(i)
{
	var margin = activeDirectoryTree[i].level * 10;
	
	var fileTypeImage = 'text70.svg';
	if (activeDirectoryTree[i].type=='directory') fileTypeImage = 'folder215.svg';
	
	var output = '';
	
	output += '<div class="directoryTreeEntry" id="'+i+'" style="margin-left: '+margin+'px;">';
	output += '<img src="images/'+fileTypeImage+'" /> ';
	output += path.basename(activeDirectoryTree[i].path);
	output += '</div>'
	
	return output;
}

function saveSelectedTab()
{
	var activeTab = activeTabs[selectedTabIndex];
	
	var dataToSave = activeTab.editSession.getValue();
		
	try
	{
		fs.writeFileSync(activeTab.path, dataToSave);
	}
	catch (err)
	{
		alert('Bogus, save error: '+err);
	}
}

function saveSelectedTabAs(newPath)
{
	var activeTab = activeTabs[selectedTabIndex];
	
	var dataToSave = activeTab.editSession.getValue();
		
	try
	{
		fs.writeFileSync(newPath, dataToSave);
		activeTab.path = newPath;
	}
	catch (err)
	{
		alert('Bogus, save error: '+err);
	}
	
	ui_updateTabs();
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
		$('body').css('background-color', '#D9D9D9');
		$('body').css('color', '#191E23');
		$('img').css('-webkit-filter', 'invert(0%)'); 
		$('#directoryTree .directoryTreeEntry').css('border-left-color', '#000000');
	}
	else if (themeStyle=='dark')
	{
		$('body').css('background-color', '#262626');
		$('body').css('color', '#E6E1DC');
		$('img').css('-webkit-filter', 'invert(100%)'); 
		$('#directoryTree .directoryTreeEntry').css('border-left-color', '#FFFFFF');
	}
	
	localStorage.themeName = themeName;
	localStorage.themeStyle = themeStyle;
}

function generateDirectoryTree(currentDirectory, level, previousDirectory)
{
	try
	{		
		var files = fs.readdirSync(currentDirectory);
			
		for (var i = 0; i < files.length; i++) 
		{
			var currentPath = currentDirectory + path.sep + files[i]
			
			try
			{
				if (fs.lstatSync(currentPath).isDirectory())
				{
					var newDirectoryTreeEntry = { path: currentPath + path.sep, type: 'directory', level: level, previousDirectory: previousDirectory, isOpen: false };
					activeDirectoryTree.push(newDirectoryTreeEntry);
					
					generateDirectoryTree(currentPath, level + 1, currentDirectory);
				}
				else if (fs.lstatSync(currentPath).isFile())
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
		
		if (level==0) localStorage.activeDirectoryTree = JSON.stringify(activeDirectoryTree);
		
	}
	catch (err)
	{
		console.log(err);
	}
}
