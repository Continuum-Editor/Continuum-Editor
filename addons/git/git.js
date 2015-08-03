
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
	
		var cmd = 'cd '+rootDir+' && git status --porcelain';
				
		exec(cmd, function(error, stdout, stderr) 
		{
			var html = '';
			
			var lines = stdout.split('\n');
			
			var changesNotStaged = [];
			var changesStaged = []
			
			for (var i = 0; i < lines.length; i++) 
			{
			    var line = lines[i];
			    
			    var file = line.substr(3);
			    
			    if (line[0]=='M')
			    {
			        changesStaged.push(file);
			    }
			    
			    if (line[1]=='M')
			    {
			        changesNotStaged.push(file);
			    }
			}
			
			html += '<div id="gitAddon">';
			
			html += '<p style="font-weight: bold;">Changes not staged for commit:</p>';
			
			if (changesNotStaged.length>0)
			{
    			for (var i = 0; i < changesNotStaged.length; i++) 
    			{
    			    html += '<div class="stageFile" id="'+changesNotStaged[i]+'">&darr; ';
    			    html += changesNotStaged[i];
    			    html += '</div>';
    			}
			}
			else
			{
			    html += 'None';
    			html += '<br/>';
			}
			
			html += '<p style="font-weight: bold;">Changes to be commited:</p>';
			
			if (changesStaged.length>0)
			{
    			for (var i = 0; i < changesStaged.length; i++) 
    			{
    			    html += '<div class="unstageFile" id="'+changesStaged[i]+'">&uarr;<span> ';
    			    html += changesStaged[i];
    			    html += '</div>';
    			}
			}
			else
			{
			    html += 'None';
    			html += '<br/>';
			}
			
			html += '</div>';
			
			//console.log(stdout);
			
			addonSystem.setAddonSidebarContent(html);
		});
		
		var me = this;
		setTimeout(function() { me.gitDisplay() }, 1000);
	}
}

$(document).on('click', '#gitAddon .stageFile', function()
{
	var file = $(this).attr('id');
	
	var exec = require('child_process').exec;
	
	var rootDir = addonSystem.getDirectoryTreeRoot();

	var cmd = 'cd '+rootDir+' && git add '+file;
			
	exec(cmd, function(error, stdout, stderr) 
	{
	    
	});
});

$(document).on('click', '#gitAddon .unstageFile', function()
{
	var file = $(this).attr('id');
	
	var exec = require('child_process').exec;
	
	var rootDir = addonSystem.getDirectoryTreeRoot();

	var cmd = 'cd '+rootDir+' && git reset HEAD '+file;
			
	exec(cmd, function(error, stdout, stderr) 
	{
	    
	});
});

addonSystem.initialiseAddon(new gitAddon());
