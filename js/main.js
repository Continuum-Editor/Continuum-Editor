// Node js includes
path = require('path');
fs = require('fs')

// Define variables
var activeTabs = new Array(); // Array of tab objects
var activeDirectoryTree = new Array();

// Setup editor with initial configuration
var editor = ace.edit("editor");
ace.require("ace/ext/language_tools")

editor.setFontSize(14);
editor.setTheme("ace/theme/monokai");
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

// Handle open file link being clicked
$('#openFile').click(function() 
{
	openFile('#openFileDialog');
});

// Open a file (passing the id of the relevant hidden file input box)
function openFile(id) 
{
	var chooser = $(id);
	
	chooser.change(function() 
	{
		var path = $(this).val();
		
		openFileByName(path);
		
		chooser.off('change');
	});

	chooser.trigger('click');  
}

function openFileByName(path)
{
	fs.readFile(path, 'utf8', function (err, fileContent) 
	{
		if (err) 
		{
			alert("Whoops! Error opening file. "+err);
			return;
		}
		
		// TODO: Change the editor's mode to reflect the type of file opened
		
		var editSession = new ace.EditSession(fileContent, "ace/mode/php");
		
		var newTab = { path: path, editSession: editSession };
		activeTabs.push(newTab);
		
		ui_updateTabs();
		editor.setSession(newTab.editSession);
	});
}

// Update display of tabs
function ui_updateTabs()
{
	var output = '';
	
	for (var i = 0; i < activeTabs.length; i++) 
	{
		output += '<div class="tab" id="'+i+'">';
		output += '<span class="tabContent">'+path.basename(activeTabs[i].path)+'</span>';
		output += '<span class="tabCloseButton" id="'+i+'">&#10006;</span>';
		output += '</div>'
	}
	
	$('#tabs').html(output);
}

// Switch to tab (passing tab index)
function ui_switchTab(index)
{
	if (typeof activeTabs[0] !== 'undefined')
	{
		editor.setSession(activeTabs[index].editSession);
	}
	else
	{
		editor.setValue('');
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

// Handle open directory link being clicked
$('#openDirectory').click(function() 
{
	openDirectory('#openDirectoryDialog');
});

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

function generateDirectoryTree(currentDirectory, level, previousDirectory)
{
	try
	{
		var files = fs.readdirSync(currentDirectory);
			
		for (var i = 0; i < files.length; i++) 
		{
			var path = currentDirectory+'\\'+files[i]
			
			try
			{
				if (fs.lstatSync(path).isDirectory())
				{
					var newDirectoryTreeEntry = { path: path, type: 'directory', level: level, previousDirectory: previousDirectory, visible: false };
					activeDirectoryTree.push(newDirectoryTreeEntry);
					
					generateDirectoryTree(path, level + 1, currentDirectory);
				}
				else if (fs.lstatSync(path).isFile())
				{
					var newDirectoryTreeEntry = { path: path, type: 'file', level: level, previousDirectory: currentDirectory, visible: false };
					activeDirectoryTree.push(newDirectoryTreeEntry);
				}
			}
			catch (err)
			{
				console.log(err);
			}
		}
	}
	catch (err)
	{
		console.log(err);
	}
}

// Update display of directory tree
function ui_updateDirectoryTree()
{
	var output = '';
	
	for (var i = 0; i < activeDirectoryTree.length; i++) 
	{
		if (activeDirectoryTree[i].level==0)
		{
			output += '<div class="directoryTreeEntry" id="'+i+'">';
			output += path.basename(activeDirectoryTree[i].path);
			output += '</div>'
		}
	}
	
	$('#directoryTree').html(output);
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
		for (var i = id; i < activeDirectoryTree.length; i++) 
		{
			if (activeDirectoryTree[i].level==directoryTreeEntry.level+1)
			{
				if (activeDirectoryTree[i].path.indexOf(directoryTreeEntry.path)>-1)
				{
					if (activeDirectoryTree[i].visible==false)
					{
						var output = '';
						
						var padding = activeDirectoryTree[i].level * 10;
						
						output += '<div class="directoryTreeEntry" style="padding-left: '+padding+'px;"; id="'+i+'">';
						output += path.basename(activeDirectoryTree[i].path);
						output += '</div>'
						
						$(this).after(output);
						
						activeDirectoryTree[i].visible = true;
					}
					else
					{
						$('#'+i+'.directoryTreeEntry').remove();
						
						activeDirectoryTree[i].visible = false;
					}
				}
				else
				{
					return;
				}
			}
		}
	}
});
