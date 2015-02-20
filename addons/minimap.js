
var minimapAddonName = 'Minimap';
var minimapAddonCallbackFunction = 'minimapStart'

setAddonSidebarDetails(minimapAddonName, minimapAddonCallbackFunction);

function minimapStart()
{
	minimapDisplay();
}

function minimapDisplay()
{	
	if (!isAddonActive(minimapAddonName)) return;
	
	var lines = editor.getValue().split('\n');
	
	var html = '';
	
	html += '<div id="minimapEditor" style="font-size: 25%;">'
	
	for (var i = 0; i < lines.length; i++) 
	{
		var line = lines[i];
		escapedLine = $('<div/>').text(line).html();
		escapedLine = escapedLine.replace(/ /g, '&nbsp;');
		escapedLine = escapedLine.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
		
		var lineSnippetLength = 100;
		var lineSnippet = line.trim().substr(0, lineSnippetLength).replace(/"/g, '&quot;');
		if (line.trim().length>lineSnippetLength) lineSnippet += ' [...]';
		
		html += '<div style="width: 100%" title="Line '+(i+1)+': '+lineSnippet+'" class="minimapLine" id="'+(i+1)+'">';
		if (line=='') html += '<br/>';
		else html += escapedLine;
		html += '</div>';
	}
	
	html += '</div>';

	setAddonSidebarContent(html);
	
	setTimeout(function() { minimapDisplay() }, 1000);
}

$(document).on('click', '.minimapLine', function()
{
	var lineNumber = $(this).attr('id');
	
	editor.gotoLine(lineNumber, 0, true);
});
