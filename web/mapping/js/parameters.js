var sampleblocksize = null;
var samplingrate = null;
function parseParams( paramstr ) {
	ret = {};
	var prmlist = paramstr.split( " \n" );
	for( var i = 0; i < prmlist.length; i++ ) {
		var prm = {};

		var p = prmlist[ i ];
		var end = p.indexOf( '=' );
		var prminfo = ( p.substring( 0, end ) ).split( ' ' );
		var prmval = ( p.substring( end + 2, p.length ) );
		var id = prminfo[ prminfo.length - 1 ];
		if( id == "" ) continue;

		ret[ id ] = {
			type: prminfo[ prminfo.length - 2 ],
			strvalue: prmval
		};
	}

	sampleblocksize = parseInt( parseNum( ret.SampleBlockSize ) );
	samplingrate = parseInt( parseNum( ret.SamplingRate ) );

	return ret;
}

function parseAxis( data ) {
	var ret = [];
	if( data[0] == '{' ) {
		data.shift();
		while( data[0] != '}' )
			ret.push( data.shift() );
		data.shift();
	} else {
		for( var i = 0; i < parseInt( data[0] ); i++ )
			ret.push( ( i + 1 ).toString() );
		data.shift();
	}
	return ret;
}

function parseMatrix( prm ) {
	var data = prm.strvalue.split( ' ' );

	var ret = {};
	ret.rows = parseAxis( data );
	ret.cols = parseAxis( data );
	ret.mat = [];

	for( var r = 0; r < ret.rows.length; r++ ) {
		ret.mat.push( [] );
		for( var c = 0; c < ret.cols.length; c++ ) {
			var val = data.shift()
			if( val == "%" ) ret.mat[ r ].push( "" );
			else ret.mat[ r ].push( decodeURIComponent( val ) );
		}
	}
	return ret;
}

function parseList( prm ) {
	var data = prm.strvalue.split( ' ' );

	var ret = [];
	var listlen = parseInt( data.shift() );
	for( var i = 0; i < listlen; i++ )
		ret.push( data.shift() );
	return ret;
}

function parseIntList( prm ) {
	var ret = parseList( prm );
	for( var i = 0; i < ret.length; i++ )
		ret[i] = parseInt( ret[i] );
	return ret;
}

function parseNum( prm ) {
	var data = prm.strvalue.split( ' ' );
	return data[0];
}

function toms( data ) {
	if( isNaN( data ) ) {
		var idx = /[a-z]/.exec( data )
		if( !idx ) return null;
		
		idx = idx.index;
		var num = +( data.substring( 0, idx ) );
		var unit = data.substring( idx, data.length );
		if( unit == "s" ) num *= 1000;
		return Math.floor( num );
	} else {
		// If no units are specified, it is assumed to be in sampleblocks
		if( sampleblocksize && samplingrate )
			return Math.floor( ( +data * ( sampleblocksize * ( 1.0 / samplingrate ) ) ) * 1000 );
		else console.error( "Couldn't parse time because this code is shitty." );
	}
}