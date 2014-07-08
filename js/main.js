// Node js includes
path = require('path');
fs = require('fs')

// Define variables
var activeTabs = new Array(); // Array of tab objects

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
function openFile(name) 
{
	var chooser = $(name);
	
	chooser.change(function() 
	{
		fileToOpen = $(this).val();
		
		fs.readFile(fileToOpen, 'utf8', function (err, fileContent) 
		{
			if (err) 
			{
				alert("Whoops! Error opening file. "+err);
				return;
			}
			
			// TODO: Change the editor's mode to reflect the type of file opened
			
			var editSession = new ace.EditSession(fileContent, "ace/mode/php");
			
			var newTab = { name: fileToOpen, editSession: editSession };
			activeTabs.push(newTab);
			
			ui_updateTabs();
			editor.setSession(newTab.editSession);
		});
		
		chooser.off('change');
	});

	chooser.trigger('click');  
}


// Update display of tabs
function ui_updateTabs()
{
	var output = '';
	
	for (var i = 0; i < activeTabs.length; i++) 
	{
		output += '<span class="tab" id="'+i+'">';
		output += path.basename(activeTabs[i].name);
		output += '</span>'
	}
	
	$('#tabs').html(output);
}

// Switch to tab (passing tab index)
function ui_switchTab(index)
{
	editor.setSession(activeTabs[index].editSession);
}

// Handle tab being clicked
$(document).on('click', ".tab", function()
{
	ui_switchTab($(this).attr('id'));
});

// Handle open directory link being clicked
$('#openDirectory').click(function() 
{
	openDirectory('#openDirectoryDialog');
});

// Open a directory (passing the id of the relevant hidden file input box)
function openDirectory(name) 
{
	var chooser = $(name);
	chooser.change(function(evt) 
	{
		directoryToOpen = $(this).val();
		
		alert('Got directory: '+directoryToOpen);
		
		// TODO: Open specified directory in left sidebar
		
		chooser.off('change');
	});

	chooser.trigger('click');  
}
