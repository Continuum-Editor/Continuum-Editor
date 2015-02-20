
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
		line = $('<div/>').text(line).html();
		line = line.replace(' ', '&nbsp;');
		line = line.replace('\t', '&nbsp;&nbsp;&nbsp;&nbsp;');
		
		html += '<div class="minimapLine" id="'+(i+1)+'">';
		if (line=='') html += '<br/>';
		else html += line;
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
