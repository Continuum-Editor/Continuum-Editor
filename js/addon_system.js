
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
		
		if (addons.length===1)
		{
			$('#rightSelect').append('<option value="'+addon.name+'" selected>'+addon.name+'</a>');
			$('#rightSelect').trigger('change');
		}
		else
		{
			$('#rightSelect').append('<option value="'+addon.name+'">'+addon.name+'</a>');
		}
	}
}

// Call addon's sidebarCallback function when right sidebar dropdown is changed
$('#rightSelect').on('change', function()
{
	var i = 0;
	while(i < addons.length)
	{
		var addon = addons[i];
		
		if ($('#rightSelect').val()==addon.name)
		{
			if(typeof addon.sidebarCallback === 'function') 
			{
				addon.active = true;
				addon.sidebarCallback();
			}
		}
		else
		{
			addon.active = false;
		}
		
		i++;
	}
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
