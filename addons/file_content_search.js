
function fileContentSearchAddon()
{
	this.name = 'File Content Search';
	this.active = false;
	
	this.sidebarCallback = function()
	{
		this.fileContentSearchDisplay();
	};
	
	this.fileContentSearchDisplay = function()
	{
		if (this.active===false) return;
		
		html = '<input id="fileContentSearchAddonSearch" type="search" value="" placeholder="Search contents of files..." style="width: 75%; margin-bottom: 10px;" />';
		html += '<input id="fileContentSearchAddonSearchButton" type="submit" value="Search" style="width: 24%; margin-bottom: 10px;" />';
		
		html += '<div id="fileContentSearchAddonResults" style="cursor: default;"></div>';
		
		addonSystem.setAddonSidebarContent(html);
		
		$('#fileContentSearchAddonSearch').focus();
		
	};
	
}

$(document).on('click', '#fileContentSearchAddonSearchButton', function()
{
    var searchTerm = $('#fileContentSearchAddonSearch').val();
    
    if (searchTerm==='' || searchTerm.length<3)
    {
        $('#fileContentSearchAddonResults').html('No search term or search term too short.');
        return;
    }
    
    $('#fileContentSearchAddonResults').html('');
    
    var isBinaryFile = require("isbinaryfile");
    
    var directoryTree = addonSystem.getDirectoryTree();
    
    for (var i = 0; i < directoryTree.length; i++) 
    {
        var directoryTreeEntry = directoryTree[i];
        
        if(directoryTreeEntry.type!='file') continue;
        
        var contents = null;
        
        try
        {
            contents = fs.readFileSync(directoryTreeEntry.path, 'utf-8');
        }
        catch(e)
        {
            contents = null;
        }
        
        if (!contents) continue;
        
        var lines = contents.split('\n');
	    
	    for (var j = 0; j < lines.length; j++) 
        {
            if (lines[j].indexOf(searchTerm) != -1) 
            {
                $('#fileContentSearchAddonResults').append('<div class="fileContentSearchAddonResult" style="margin-bottom: 4px;" id="Line '+directoryTreeEntry.path+'">'+(j+1)+': '+path.basename(directoryTreeEntry.path)+'</div>');   
            }
        }
    }

});

$(document).on('click', '.fileContentSearchAddonResult', function()
{
    var path = $(this).attr('id');
    
    addonSystem.openFileInNewTab(path);
});

addonSystem.initialiseAddon(new fileContentSearchAddon());
