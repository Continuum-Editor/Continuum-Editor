
// Main addons array containing all loaded addon objects
var addons = Array();

// Load all addons
$(document).ready(function()
{
	var glob = require("glob")
	
	loadAddonJS = function(src) 
	{
		var jsLink = $("<script src='"+src+"' type='text/javascript'>");
		$("body").append(jsLink); 
	}; 
	
	glob("addons/*.js", null, function (er, files) 
	{
		var i = 0;
		
		while (i < files.length)
		{
			var file = files[i];
			
			loadAddonJS(file);
			
			i++;
		}
	});
	
});

// Initalise addon (called by addon itself)
function initialiseAddon(addon)
{
	if(typeof addon.sidebarCallback === 'function') 
	{
		addons.push(addon);
		
		if ((addons.length===1 && !localStorage.activeAddonName) || localStorage.activeAddonName==addon.name)
		{
			$('#rightSelect').append('<option value="'+addon.name+'" selected>'+addon.name+'</a>');
			changeActiveAddon(addon.name);
		}
		else
		{
			$('#rightSelect').append('<option value="'+addon.name+'">'+addon.name+'</a>');
		}
	}
}

// Call addon's sidebarCallback function based on the addon name passed to it
function changeActiveAddon(addonName)
{
    var i = 0;
	while(i < addons.length)
	{
		var addon = addons[i];
		
		if (addonName==addon.name)
		{
			if(typeof addon.sidebarCallback === 'function') 
			{
				addon.active = true;
				addon.sidebarCallback();
				localStorage.activeAddonName = addon.name;
			}
		}
		else
		{
			addon.active = false;
		}
		
		i++;
	}
}

$('#rightSelect').on('change', function()
{
	changeActiveAddon($('#rightSelect').val());
});

$('#rightSelect').on('click', function()
{
	$('#rightSelect').trigger('change');
});

// Allows addons to change the right sidebar content
function setAddonSidebarContent(html)
{
	$('#rightContent').html(html);
}

// Return editor content (as a string)
function getEditorContent()
{
	return editor.getValue();
}

// Returns all the lines in the editor (as an array of strings)
function getEditorLines()
{
	return editor.getValue().split('\n');
}

// Function get active directory tree
function getDirectoryTree()
{
    return activeDirectoryTree;
}

// Function get active directory tree root
function getDirectoryTreeRoot()
{
    return activeDirectoryTreeRoot;
}

function openFileInNewTab(path)
{
    openFileByName(path);
}
