
setAddonSidebarDetails('Test addon!', 'testAddonRightSidebarFunction');

function testAddonRightSidebarFunction()
{
	var html = 'Test!<br/>123<br/>456';
	
	setAddonSidebarContent(html);
}
