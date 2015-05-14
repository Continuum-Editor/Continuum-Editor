
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
		
		html += '<table style="width: 100%;" id="fileContentSearchAddonResults">';
		html += '</table>';
		
		addonSystem.setAddonSidebarContent(html);
		
		$('#fileContentSearchAddonSearch').focus();
		
	};
	
}

$(document).on('click', '#fileContentSearchAddonSearchButton', function()
{
    var searchTerm = $('#fileContentSearchAddonSearch').val();
    
    if (searchTerm==='' || searchTerm.length<3)
    {
        $('#fileContentSearchAddonResults').html('<tr><td>No search term or search term too short.</td></tr>');
        return;
    }
    
    searchTerm = searchTerm.toLowerCase();
    
    var html = '<tr>';
	html += '<th style="text-align: left;">Line</th>';
	html += '<th style="text-align: left;">File</th>';
	html += '</tr>';
    
    $('#fileContentSearchAddonResults').html(html);
    
    var isBinaryFile = require("isbinaryfile");
    
    var directoryTree = addonSystem.getDirectoryTree();
    var directoryTreeRoot = addonSystem.getDirectoryTreeRoot();
    
    function makeSearchFileFunction(path)
    {
        return function (err, contents)
        {
            if (!contents) return;
        
            contents = contents.toLowerCase();
        
            var shortPath = path.replace(directoryTreeRoot, '');
            var lines = contents.split('\n');
    	    
    	    for (var j = 0; j < lines.length; j++) 
            {
                if (lines[j].indexOf(searchTerm) != -1) 
                {
                    $('#fileContentSearchAddonResults').append('<tr class="fileContentSearchAddonResult" style="margin-bottom: 4px;" id="Line '+path+'"><td>'+(j+1)+'</td><td>'+shortPath+'</td></tr>');   
                }
            }
        };
    }
    
    for (var i = 0; i < directoryTree.length; i++) 
    {
        var directoryTreeEntry = directoryTree[i];
        
        if(directoryTreeEntry.type!='file') continue;
        
        var contents = null;
        
        contents = fs.readFile(directoryTreeEntry.path, 'utf-8', makeSearchFileFunction(directoryTreeEntry.path));

        
    }

});

$(document).on('click', '.fileContentSearchAddonResult', function()
{
    var path = $(this).attr('id');
    
    addonSystem.openFileInNewTab(path);
});

addonSystem.initialiseAddon(new fileContentSearchAddon());
