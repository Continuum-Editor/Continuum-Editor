
$(document).ready(function()
{
	var glob = require("glob")
	
	loadAddonJS = function(src) 
	{
		var jsLink = $("<script src='"+src+"' type='text/javascript'>");
		$("body").prepend(jsLink); 
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
