
function testAddon()
{
	this.name = 'Test addon!';
	this.active = false;
	
	this.sidebarCallback = function()
	{	
		var html = 'Test!<br/>123<br/>456';
		
		setAddonSidebarContent(html);
	};
}

initialiseAddon(new testAddon());
