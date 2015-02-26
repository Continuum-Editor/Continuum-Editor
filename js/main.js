
// *** Global Variable - Start ***

// Node js includes
var path = require('path');
var fs = require('fs')

// Define variables
var selectedTabIndex = 0;
var activeTabs = new Array(); // Array of tab objects
var activeDirectoryTree = new Array();
var activeDirectoryTreeRoot = null;
var recentlyAccessed = new Array();

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
	
	// Hide editor by default (until we have one or more open tabs)
	$('#editor').hide();

	// Set theme
	if (localStorage.themeName==null) localStorage.themeName = 'monokai';
	if (localStorage.themeStyle==null) localStorage.themeStyle = 'dark';
	setTheme(localStorage.themeName, localStorage.themeStyle);

	// Trigger resizing of various elements
	$(window).trigger('resize');

	// Restore previously opened directory tree
	try
	{
	    activeDirectoryTreeRoot = localStorage.activeDirectoryTreeRoot;
		activeDirectoryTree = JSON.parse(localStorage.activeDirectoryTree);
		
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
	
});

function addToRecentlyAccessed(path, type)
{
	for (var i = 0; i < recentlyAccessed.length; i++) 
	{
		if (recentlyAccessed[i].path == path) return;
	}
	
	var newRecentlyAccessed = { path: path, type: type };
	recentlyAccessed.push(newRecentlyAccessed);
	
	ui_updateRecentlyAccessedMenu();
}

function ui_updateRecentlyAccessedMenu()
{
	for (var i = 0; i < recentMenu.items.length; i++) 
	{
		recentMenu.removeAt(i);
	}
	
	for (var i = 0; i < recentlyAccessed.length; i++) 
	{
		if (recentlyAccessed[i].type=='file')
		{
			var path = recentlyAccessed[i].path;
			
			recentMenu.append(new gui.MenuItem({ label: path, click: makeOpenRecentFunction(path) }));
		}
		
		if (i>=20) break;
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

// Open a file (passing the id of the relevant hidden file input box)
function openFile(id) 
{
	var chooser = $(id);
	
	chooser.change(function() 
	{
		var path = $(this).val();
		
		if (path.length>0) openFileByName(path);
		
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
	
	var isBinaryFile = require("isbinaryfile");
	
	var fileIsBinary = isBinaryFile(path);

	if (fileIsBinary)
	{
	    gui.Shell.openItem(path);
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
		
		var newTab = { path: path, editSession: editSession };
		activeTabs.push(newTab);
		
		addToRecentlyAccessed(path, 'file');
		
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
		output += '<div class="tab" id="'+i+'">';
		output += '<span class="tabContent" id="'+i+'" title="'+activeTabs[i].path+'">'+path.basename(activeTabs[i].path)+'</span>';
		output += '<span class="tabCloseButton" id="'+i+'" title="Close tab">&#10006;</span>';
		output += '</div>'
	}
	
	$('#tabs').html(output);
	
	if (activeTabs.length==0) $('#editor').hide();
	else $('#editor').show();
	
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
	
	for (var i = 0; i < activeTabs.length; i++) 
	{
		if (i==index)
		{
			$('#'+i+'.tab').css('background-color', '#2e353b');
		}
		else
		{
			$('#'+i+'.tab').css('background-color', '#3a3e41');
		}
	}
	
	
	
	storeTabsToRecover();
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
	activeTabs.splice(index, 1);
	
	ui_updateTabs();
	
	if (index-1>0) ui_switchTab(index-1);
	else ui_switchTab(0);
}

// Open a directory (passing the id of the relevant hidden file input box)
function openDirectory(id) 
{
	var chooser = $(id);
	chooser.change(function() 
	{
		var directoryToOpen = $(this).val();
		
		openDirectoryByPath(directoryToOpen);
		
		chooser.off('change');
	});

	chooser.trigger('click');  
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
        
        localStorage.activeDirectoryTree = JSON.stringify(activeDirectoryTree);
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
	
	for (var i = id; i < activeDirectoryTree.length; i++) 
	{
		if (i == id) continue;
		
		if (activeDirectoryTree[i].path.indexOf(directoryTreeEntry.path)>-1)
		{
			
			if (activeDirectoryTree[i].level==directoryTreeEntry.level+1)
			{						
				output += ui_generateDirectoryTreeEntryHTML(i);
			}
		}
		else
		{
			break;
		}
	}
	
    $('#'+id+'.directoryTreeEntry').after(output);
}

function ui_contractDirectoryTreeEntry(id)
{
    var directoryTreeEntry = activeDirectoryTree[id];
    
	for (var i = id; i < activeDirectoryTree.length; i++) 
	{
		if (i == id) continue;
		
		if (activeDirectoryTree[i].path.indexOf(directoryTreeEntry.path)>-1)
		{
			$('#'+i+'.directoryTreeEntry').remove();
			
			activeDirectoryTree[i].isOpen = false;
		}
		else
		{
			break;
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
		$('#editor .ace_content').css('background-color', '#fff');
	}
	else
	{
		$('#editor .ace_content').css('background-color', '');
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
		
		if (level==0)
		{
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

// Handle resizing of various elements when the window is resized
$(window).on('resize', function()
{
	var leftWidth = $('#left').outerWidth();
	if ($('#left').position().left<0) leftWidth = 40;
	
	var tabContainerWidth = $(window).outerWidth() - leftWidth - $('#tabsScrollButtons').outerWidth();
	$('#tabsContainer').outerWidth(tabContainerWidth);
	
	var editorWidth = $(window).outerWidth() - leftWidth - $('#right').outerWidth();
	$('#editor').outerWidth(editorWidth);
	
	var rightContentHeight = $(window).outerHeight() - $('#topMenuBar').outerHeight() - $('#tabsContainer').outerHeight() - $('#rightSelect').outerHeight() - 16;
	$('#rightContent').outerHeight(rightContentHeight);
	
	var leftContentHeight = $(window).outerHeight() - $('#topMenuBar').outerHeight() - 16;
	$('#leftContent').outerHeight(leftContentHeight);
	
	var directoryTreeHeight = $('#leftContent').outerHeight() - 75;
	$('#leftContent #directoryTree').outerHeight(directoryTreeHeight);
});

$(document).on('click', '#refreshDirectionTreeButton', function()
{
    $('#refreshDirectionTreeButton').html('&#8635; Refreshing...');
    
    refreshDirectoryTree();
    
    setTimeout(function() { $('#refreshDirectionTreeButton').html('&#8635; Refresh Files'); }, 500);
});

$(document).on('click', '#leftMinimizeButton', function()
{
    $('#left').animate({'left': -$('#left').outerWidth()}, 500);
    $('#editor').animate({'left': 40, 'width': $('#editor').outerWidth()+$('#left').outerWidth()-40}, 500);
    $('#tabsContainer').animate({'left': 40, 'width': $('#tabsContainer').outerWidth()+$('#left').outerWidth()-40}, 500);
    
    $('#leftUnminimizeButton').fadeIn(1000);
});

$(document).on('click', '#leftUnminimizeButton', function()
{
    $('#left').animate({'left': 0}, 500);
    $('#editor').animate({'left': $('#left').outerWidth(), 'width': $('#editor').outerWidth()-$('#left').outerWidth()+40}, 500);
    $('#tabsContainer').animate({'left': $('#left').outerWidth(), 'width': $('#tabsContainer').outerWidth()-$('#left').outerWidth()+40}, 500);
    
    $('#leftUnminimizeButton').fadeOut(500);
});