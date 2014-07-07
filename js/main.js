// Setup editor with initial configuration
var editor = ace.edit("editor");
editor.setFontSize(14);
editor.setTheme("ace/theme/ambiance");
editor.getBehavioursEnabled(true); // Quote and bracket pairing
editor.setHighlightActiveLine(true); 
editor.setHighlightSelectedWord(true);
editor.setShowPrintMargin(false); // We're coding, not printing!
editor.getSession().setMode("ace/mode/php");

// Handle open file link being clicked
$('#openFile').click(function() 
{
	openFile('#fileDialog');
});

// Open a file (passing the id of the hidden file input box)
function openFile(name) 
{
	var chooser = $(name);
	chooser.change(function(evt) 
	{
		fileToOpen = $(this).val();
		
		fs = require('fs')
		fs.readFile(fileToOpen, 'utf8', function (err, fileContent) 
		{
			if (err) 
			{
				alert("Whoops! Error opening file. "+err);
				return;
			}
			
			// TODO: Change the editor's mode to reflect the type of file opened
			
			editor.setValue(fileContent, -1); // -1 positions cursor at start
		});
	});

	chooser.trigger('click');  
}
