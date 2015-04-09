
function fileSearchAddon()
{
	this.name = 'File Search';
	this.active = false;
	
	this.sidebarCallback = function()
	{
		this.fileSearchDisplay();
	};
	
	this.fileSearchDisplay = function()
	{
		if (this.active===false) return;
		
		html = '<input id="fileSearchAddonSearch" type="search" value="" placeholder="Search by file name..." style="width: 100%; margin-bottom: 10px;" />';
		
		html += '<div id="fileSearchAddonResults" style="cursor: default; font-size: 75%;"></div>';
		
		addonSystem.setAddonSidebarContent(html);
		
		$('#fileSearchAddonSearch').focus();
		
	};
}

$(document).on('keyup', '#fileSearchAddonSearch', function()
{
    var searchTerm = $(this).val();
    
    if (searchTerm==='')
    {
        $('#fileSearchAddonResults').html('');
        return;
    }
    
    var directoryTree = addonSystem.getDirectoryTree();
    var directoryTreeRoot = addonSystem.getDirectoryTreeRoot();
    
    var pathsFound = [];
   
    for (var i = 0; i < directoryTree.length; i++) 
    {
        var directoryTreeEntry = directoryTree[i];
        
        if (directoryTreeEntry.type!='file') continue;
        
        if (directoryTreeEntry.path.toLowerCase().indexOf(searchTerm.toLowerCase())!=-1)
        {
            pathsFound.push(directoryTreeEntry.path);   
        }
        
        if (pathsFound.length>=500) break;
    }
    
    $('#fileSearchAddonResults').html('');
    
    for (i = 0; i < pathsFound.length; i++) 
    {
        var path = pathsFound[i];
        var shortPath = path.replace(directoryTreeRoot, '');
        
        $('#fileSearchAddonResults').append('<div class="fileSearchAddonResult" style="margin-bottom: 4px;" id="'+path+'">'+shortPath+'</div>');
    }
    
});

$(document).on('click', '.fileSearchAddonResult', function()
{
    var path = $(this).attr('id');
    
    addonSystem.openFileInNewTab(path);
});

addonSystem.initialiseAddon(new fileSearchAddon());
