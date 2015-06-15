
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
    
    var directoryTree = addonSystem.getDirectoryTree();
    var directoryTreeRoot = addonSystem.getDirectoryTreeRoot();
    
    function makeSearchFileFunction(path)
    {
        return function (err, contents)
        {
            console.log(path);
            
            if (err) console.log(err);
            
            if (!contents) return;
        
            contents = contents.toLowerCase();
        
            var shortPath = path.replace(directoryTreeRoot, '');
            var lines = contents.split('\n');
    	    
    	    for (var j = 0; j < lines.length; j++) 
            {
                if (lines[j].indexOf(searchTerm) != -1) 
                {
                    $('#fileContentSearchAddonResults').append('<tr class="fileContentSearchAddonResult" style="margin-bottom: 4px;" id="'+(j+1)+'::::'+path+'"><td>'+(j+1)+'</td><td>'+shortPath+'</td></tr>');   
                }
            }
        };
    }
    
    var pathsToCheck = [];
    
    for (var i = 0; i < directoryTree.length; i++) 
    {
        var directoryTreeEntry = directoryTree[i];
        
        if(directoryTreeEntry.type!='file')
        {
            continue;
        }
        
        if (directoryTreeEntry.path.indexOf('.git')!==-1)
        {
            continue;
        }
        
        if (addonSystem.isFileBinary(directoryTreeEntry.path))
        {
            continue;
        }
        
        pathsToCheck.push(directoryTreeEntry.path);
        
    }
    
    function makeLoopFunction(j)
    {
        return function()
        {
            for (i = j; i < j+100; i++) 
            {
                fs.readFile(pathsToCheck[i], 'utf-8', makeSearchFileFunction(pathsToCheck[i]));    
            }
        };
    }
    
    for (var j = 0; j < pathsToCheck.length; j+=100)
    {
        setTimeout(makeLoopFunction(j), j*5);
    }
    
});

$(document).on('click', '.fileContentSearchAddonResult', function()
{
    var searchResultId = $(this).attr('id');
    var searchResultData = searchResultId.split('::::');
    
    var lineNumber = searchResultData[0];
    var path = searchResultData[1];
    
    addonSystem.openFileToLineNumber(path, lineNumber);
});

addonSystem.initialiseAddon(new fileContentSearchAddon());
