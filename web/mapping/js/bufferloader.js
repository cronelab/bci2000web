// Adapted from http://webaudioapi.com/samples/shared.js
function BufferLoader( context, urlList, callback ) {
	this.context = context;
	this.urlList = urlList;
	this.onload = callback;
	this.bufferList = new Array();
	this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function( url, index ) {

	// Handle empty entries gracefully
	if( url == false ) {
		this.bufferList[ index ] = null;
		if( ++this.loadCount == this.urlList.length )
			this.onload( this.bufferList );
		return;
	}

	// Load buffer asynchronously
	var request = new XMLHttpRequest();
	request.open( "GET", url, true );
	request.responseType = "arraybuffer";

	var loader = this;

	request.onload = function() {
		// Asynchronously decode the audio file data in request.response
		loader.context.decodeAudioData(
			request.response,
			function( buffer ) {
				if( !buffer ) {
					alert( 'error decoding file data: ' + url );
					return;
				}
				loader.bufferList[ index ] = buffer;
				if( ++loader.loadCount == loader.urlList.length )
					loader.onload( loader.bufferList );
			},
			function( error ) {
				console.error( 'decodeAudioData error', error );
			}
		);
	}

	request.onerror = function() {
		alert( 'BufferLoader: XHR error' );
	}

	request.send();
};

BufferLoader.prototype.load = function() {
	for( var i = 0; i < this.urlList.length; ++i )
		this.loadBuffer( this.urlList[i], i );
};

function ImageLoader( urlList, callback ) {
	this.urlList = urlList;
	this.onload = callback;
	this.imageList = new Array();
	this.loadCount = 0;
}

ImageLoader.prototype.loadImage = function( url, index ) {

	// Handle empty entries gracefully
	if( url == false ) {
		this.imageList[ index ] = null;
		if( ++this.loadCount == this.urlList.length )
			this.onload( this.imageList );
		return;
	}

	// Load image asynchronously
	var img = new Image();
	var loader = this;
	img.onload = function() {
		loader.imageList[ index ] = this.src;
		if( ++loader.loadCount == loader.urlList.length )
			loader.onload( loader.imageList );
	}

	img.onerror = function() {
		console.error( "Could not load image: " + url );
	}

	// Starts loading
	img.src = url;
};

ImageLoader.prototype.load = function() {
	for( var i = 0; i < this.urlList.length; ++i )
		this.loadImage( this.urlList[i], i );
};