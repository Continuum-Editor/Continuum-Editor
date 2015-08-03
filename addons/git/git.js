
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
		
		var html = '';
		
		html += '<div id="gitAddon">';
			
		html += '<p style="font-weight: bold;">Changes not staged for commit:</p>';
		
		html += '<div id="notStagedFiles"></div>';
		
		html += '<p style="font-weight: bold;">Changes to be commited:</p>';
		
		html += '<div id="stagedFiles"></div>';
		
		html += '<div id="commit">';
		html += '<p style="font-weight: bold;">Commit message:</p>';
	    html += '<input style="width:95%;" id="commitMessage" />';
	    html += '<button id="commitButton">Commit</button>';
	    html += '</div>';
		
		html += '</div>';
		
		addonSystem.setAddonSidebarContent(html);
		
		this.gitDisplayUpdate();
	};
	
	this.gitDisplayUpdate = function()
	{
	    var exec = require('child_process').exec;
	
		var rootDir = addonSystem.getDirectoryTreeRoot();
	
		var cmd = 'cd '+rootDir+' && git status --porcelain';
	    
	    exec(cmd, function(error, stdout, stderr) 
		{
			var lines = stdout.split('\n');
			
			var changesNotStaged = [];
			var changesStaged = [];
			
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
			
			var html = '';
			
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
    		
    		$('#gitAddon #stagedFiles').html(html);
    		
    		html = '';
    		
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
			
			$('#gitAddon #notStagedFiles').html(html);
			
		    if (changesStaged.length>0)
    		{
    		    $('#gitAddon #commit').slideDown(250);
    		}
    		else
    		{
    		    $('#gitAddon #commit').slideUp(250);
    		    $('#gitAddon #commit #commitMessage').val('');
    		}
			
			//console.log(stdout);
		});
		
		var me = this;
		setTimeout(function() { me.gitDisplayUpdate() }, 1000);
	};
}

$(document).on('click', '#gitAddon #commit #commitButton', function()
{
    var commitMsg = $('#gitAddon #commit #commitMessage').val();
    
    commitMsg = commitMsg.replace(/"/g, '\\"');
    
    $('#gitAddon #commit #commitMessage').val('');
    
    var exec = require('child_process').exec;
	
	var rootDir = addonSystem.getDirectoryTreeRoot();

	var cmd = 'cd '+rootDir+' && git commit -m "'+commitMsg+'"';
	console.log(cmd);
	
	exec(cmd, function(error, stdout, stderr) 
	{
	    
	});
});

$(document).on('click', '#gitAddon .stageFile', function()
{
	var file = $(this).attr('id');
	
	$(this).html('Staging... '+file);
	
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
	
	$(this).html('Unstaging... '+file);
	
	var exec = require('child_process').exec;
	
	var rootDir = addonSystem.getDirectoryTreeRoot();

	var cmd = 'cd '+rootDir+' && git reset HEAD '+file;
			
	exec(cmd, function(error, stdout, stderr) 
	{
	    
	});
});

addonSystem.initialiseAddon(new gitAddon());
