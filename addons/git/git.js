
function gitAddon()
{
	this.name = 'Git';
	this.active = false;
	
	this.sidebarCallback = function()
	{	
		this.gitDisplay();
	};
	
	this.gitDisplay = function()
	{
		if (this.active===false) return;
		
		var exec = require('child_process').exec;
	
		var rootDir = addonSystem.getDirectoryTreeRoot();
	
		var cmd = 'cd '+rootDir+' && git status';
				
		exec(cmd, function(error, stdout, stderr) 
		{
			var html = '';
			
			var formattedOutput = stdout.replace(/(?:\r\n|\r|\n)/g, '<br/>');

			html += formattedOutput;
			
			addonSystem.setAddonSidebarContent(html);
		});
		
		var me = this;
		setTimeout(function() { me.gitDisplay() }, 1000);
	}
}

addonSystem.initialiseAddon(new gitAddon());
