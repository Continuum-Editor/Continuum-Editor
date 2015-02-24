
function outlineAddon()
{
	this.name = 'Outline';
	this.active = false;
	
	this.sidebarCallback = function()
	{
		this.outlineDisplay();
	};
	
	this.outlineDisplay = function()
	{
		if (this.active===false) return;
		
		var lines = getEditorLines();
		
		var functions = Array();
		
		for (var i = 0; i < lines.length; i++) 
		{
			var line = lines[i];
		
			var tokens = line.match(/\S+/g);
			if (tokens===null) continue;
			
			for (var j = 0; j < tokens.length; j++) 
			{
				var token = tokens[j];
				
				var functionWord = 'function';
				
				if (token.substr(0, functionWord.length)==functionWord)
				{
				    var name = 'unknown';
				    var type = 'standard';
				    
				    if (tokens.length>=j+2)
				    {
				        name = tokens[j+1];
				    }
					
					if (token.substr(0, functionWord.length+1)==functionWord+'(' || name.substr(0, 1)=='(')
					{
					    name = 'n/a';
					    type = 'anonymous';
					}
					else if (token==functionWord)
					{
    					if (j-1 >= 0)
    					{
    						if (tokens[j-1]=='private' || tokens[j-1]=='public' || tokens[j-1]=='protected' || tokens[j-1]=='static')
    						{
    							type = tokens[j-1];
    						}
    						else
    						{
    							type = 'unknown';
    						}
    					}
    					
    					if (name.substr(0,2)=='__')
    					{
    						type += ' magic';
    					}
					}
					else
					{
					    continue;
					}
					
					var bracketInNamePos = name.indexOf('(');
					
					if (bracketInNamePos>0)
					{
						name = name.substr(0, bracketInNamePos);
					}
					
					var functionObj = { lineNumber: i+1, name: name, type: type };
					
					functions.push(functionObj);
				}
			}
		}
		
		
		var html = '';
		
		html += '<div id="outline">';
		
		html += '<table class="outlineFunctions" style="width: 100%;">';
		
		html += '<tr>';
		html += '<th style="text-align: left;">Line</th>'
		html += '<th style="text-align: left;">Function name</th>';
		html += '<th style="text-align: left;">Type</th>';
		html += '</tr>';
		
		for (var i = 0; i < functions.length; i++) 
		{
			var functionObj = functions[i];
			
			html += '<tr class="outlineLine" id="'+(functionObj.lineNumber)+'">';
			html += '<td>' + functionObj.lineNumber + '</td>';
			html += '<td>' + functionObj.name + '</td>';
			html += '<td>' + functionObj.type + '</td>';
			html += '</tr>';
		}
		
		html += '</table>';
		
		html += '</div>';
		
		setAddonSidebarContent(html);
		
		
		var me = this;
		setTimeout(function() { me.outlineDisplay() }, 1000);
	};
}

$(document).on('click', '#outline .outlineLine', function ()
{
	var lineNumber = $(this).attr('id');
	
	editor.gotoLine(lineNumber, 0, true);
});

initialiseAddon(new outlineAddon());
