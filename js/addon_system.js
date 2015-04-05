
// Global addonSystem singleton
var addonSystem;

// Initialise Addon System
$(document).ready(function()
{
	addonSystem = new addonSystem();
	addonSystem.loadAddons();
});

function addonSystem()
{
    // Main addons array containing all loaded addon objects
    this.addons = Array();
    
    // Load all addons
    this.loadAddons = function()
    {
        var glob = require("glob");
	
    	glob("addons/*.js", null, function (er, files)
    	{
    	    var loadAddonJS = function(src) 
        	{
        		var jsLink = $("<script src='"+src+"' type='text/javascript'>");
        		$("body").append(jsLink); 
        	};
    	    
    		var i = 0;
    		
    		while (i < files.length)
    		{
    			var file = files[i];
    			
    			loadAddonJS(file);
    			
    			i++;
    		}
    	});
	
    };
    
    // Initalise addon (called by addon itself)
    this.initialiseAddon = function(addon)
    {
    	if(typeof addon.sidebarCallback === 'function') 
    	{
    		this.addons.push(addon);
    		
    		if ((this.addons.length===1 && !localStorage.activeAddonName) || localStorage.activeAddonName==addon.name)
    		{
    			$('#rightSelect').append('<option value="'+addon.name+'" selected>'+addon.name+'</a>');
    			this.changeActiveAddon(addon.name);
    		}
    		else
    		{
    			$('#rightSelect').append('<option value="'+addon.name+'">'+addon.name+'</a>');
    		}
    	}
    };
    
    // Call addon's sidebarCallback function based on the addon name passed to it
    this.changeActiveAddon = function(addonName)
    {
        var i = 0;
    	while(i < this.addons.length)
    	{
    		var addon = this.addons[i];
    		
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
    };
    
    // Allows addons to change the right sidebar content
    this.setAddonSidebarContent = function(html)
    {
    	$('#rightContent').html(html);
    };
    
    // Return editor content (as a string)
    this.getEditorContent = function()
    {
    	return editor.getValue();
    };
    
    // Returns all the lines in the editor (as an array of strings)
    this.getEditorLines = function()
    {
    	return editor.getValue().split('\n');
    };
    
    // Function get active directory tree
    this.getDirectoryTree = function()
    {
        return activeDirectoryTree;
    };
    
    // Function get active directory tree root
    this.getDirectoryTreeRoot = function()
    {
        return activeDirectoryTreeRoot;
    };
    
    this.openFileInNewTab = function(path)
    {
        openFileByName(path);
    };
    
    this.changeEditorLineNumber = function(lineNumber)
    {
        editor.gotoLine(lineNumber, 0, true);
    };
    
}


$('#rightSelect').on('change', function()
{
	addonSystem.changeActiveAddon($('#rightSelect').val());
});

$('#rightSelect').on('click', function()
{
	$('#rightSelect').trigger('change');
});
