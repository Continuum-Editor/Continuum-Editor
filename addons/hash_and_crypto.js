
function hashAndCryptoAddon()
{
	this.name = 'Hash and Crypto';
	this.active = false;
	
	this.sidebarCallback = function()
	{	
		var hashAlgos = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'SHA-3'];
		
		var html = '';
		
		html += '<div id="hashAndCryptoAddon">';
		
		html += '<p>Hash algorithm: ';
		
		html += '<select id="hashAlgo">';
		
		for(var i = 0; i<hashAlgos.length; i++)
		{
		    html += '<option value="'+hashAlgos[i]+'">'+hashAlgos[i]+'</option>';
		}
		
		html += '</select>';
		
		html += '</p>';
		
		html += '<p>Plaintext:';
		html += '<textarea id="hashPlaintext" style="width: 100%;"></textarea>';
		html += '</p>';
		
		html += '<p>Hashed:';
		html += '<textarea id="hashResult" style="width: 100%; height: 70px;" readonly ></textarea>';
		html += '</p>';
		
		html += '</div>';
		
		html += '</div>';
		
		setAddonSidebarContent(html);
		
		setTimeout(function() { $('#hashAndCryptoAddon #hashPlaintext').trigger('keyup'); }, 500);
		
	};
}

initialiseAddon(new hashAndCryptoAddon());

$(document).on('change', '#hashAndCryptoAddon #hashAlgo', function()
{
    $('#hashAndCryptoAddon #hashPlaintext').trigger('keyup');
});

$(document).on('change', '#hashAndCryptoAddon #hashPlaintext', function()
{
    $('#hashAndCryptoAddon #hashPlaintext').trigger('keyup');
});

$(document).on('keyup', '#hashAndCryptoAddon #hashPlaintext', function()
{
    var hashAlgo = $('#hashAndCryptoAddon #hashAlgo option:selected').val();
    
    if (hashAlgo=='MD5')
    {
        $.getScript("addons/hash_and_crypto/CryptoJS/md5.js", function()
        {
            var plaintext = $('#hashAndCryptoAddon #hashPlaintext').val();
            
            var hashed = CryptoJS.MD5(plaintext);
            
            $('#hashAndCryptoAddon #hashResult').val(hashed);
        });
    }
    else if(hashAlgo=='SHA-1')
    {
        $.getScript("addons/hash_and_crypto/CryptoJS/sha1.js", function()
        {
            var plaintext = $('#hashAndCryptoAddon #hashPlaintext').val();
            
            var hashed = CryptoJS.SHA1(plaintext);
            
            $('#hashAndCryptoAddon #hashResult').val(hashed);
        });
    }
    else if(hashAlgo=='SHA-256')
    {
        $.getScript("addons/hash_and_crypto/CryptoJS/sha256.js", function()
        {
            var plaintext = $('#hashAndCryptoAddon #hashPlaintext').val();
            
            var hashed = CryptoJS.SHA256(plaintext);
            
            $('#hashAndCryptoAddon #hashResult').val(hashed);
        });
    }
    else if(hashAlgo=='SHA-512')
    {
        $.getScript("addons/hash_and_crypto/CryptoJS/sha512.js", function()
        {
            var plaintext = $('#hashAndCryptoAddon #hashPlaintext').val();
            
            var hashed = CryptoJS.SHA512(plaintext);
            
            $('#hashAndCryptoAddon #hashResult').val(hashed);
        });
    }
    else if(hashAlgo=='SHA-3')
    {
        $.getScript("addons/hash_and_crypto/CryptoJS/sha3.js", function()
        {
            var plaintext = $('#hashAndCryptoAddon #hashPlaintext').val();
            
            var hashed = CryptoJS.SHA3(plaintext);
            
            $('#hashAndCryptoAddon #hashResult').val(hashed);
        });
    }
});
