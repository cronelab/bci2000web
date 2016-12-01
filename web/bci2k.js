var BCI2K = BCI2K || {};

BCI2K.Connection = function() {

	this.onconnect = function( event ) {};
	this.ondisconnect = function( event ) {};

	this._socket = null;
	this._execid = 0;
	this._exec = {}
}

BCI2K.Connection.prototype = {

	constructor: BCI2K.Connection,

	connect: function( address ) {
		if( address === undefined )
			address = window.location.host;
		this.address = address;
		this._socket = new WebSocket( "ws://" + address );

		var connection = this;

		this._socket.onopen = function( event ) {
			connection.onconnect( event );
		};

		this._socket.onmessage = function( event ) {
			arr = event.data.split( ' ' );

			var opcode = arr[0];
			var id = arr[1];
			var msg = arr.slice( 2 ).join(' ');
			 
			switch( opcode ) {
				case 'S': // START: Starting to execute command
					if( connection._exec[ id ].onstart )
						connection._exec[ id ].onstart( connection._exec[ id ] );
					break;
				case 'O': // OUTPUT: Received output from command
					connection._exec[ id ].output += msg + ' \n';
					if( connection._exec[ id ].onoutput )
						connection._exec[ id ].onoutput( connection._exec[ id ] );
					break;
				case 'D': // DONE: Done executing command
					connection._exec[ id ].exitcode = parseInt( msg );
					if( connection._exec[ id ].ondone )
						connection._exec[ id ].ondone( connection._exec[ id ] );
					delete connection._exec[ id ];
					break;
			}
		};

		this._socket.onclose = function( event ) {
			connection.ondisconnect( event );
		};
	},

	// Deprecated API
	stream: function( callback ) {
		this.execute( "Get Parameter WSConnectorServer", function( result ) {
			this.dataConnection = new BCI2K.DataConnection();
			this.dataConnection.onGenericSignal = callback;
			this.dataConnection.connect( 
				window.location.hostname + ':' +
				result.output.split( ':' )[1]
			);
		} );
	},

	tap: function( location, onSuccess, onFailure ) {
		var locprm = "WS" + location + "Server";
		this.execute( "Get Parameter " + locprm, function( result ) {
			if( result.output.indexOf( 'does not exist' ) >= 0 ) {
				if( onFailure ) onFailure( result );
			} else if( result.output == '' ) {
				if( onFailure ) onFailure( result );
			} else {
				var dataConnection = new BCI2K.DataConnection();
				if( onSuccess ) onSuccess( dataConnection );
				dataConnection.connect( 
					window.location.hostname + ':' +
					result.output.split( ':' )[1]
				);
			}
		} );
	},

	connected: function() {
		return ( this._socket != null && this._socket.readyState == WebSocket.OPEN );
	},

	execute: function( instruction, ondone, onstart, onoutput ) {
		if( this.connected() ) {
			id = ( ++( this._execid ) ).toString();
			this._exec[ id ] = {
				onstart: onstart,
				onoutput: onoutput,
				ondone: ondone, 
				output: "", 
				exitcode: null
			};
			msg = "E " + id + " " + instruction;
			this._socket.send( msg );
		}
	},

	getVersion: function( fn ) {
		this.execute( "Version", function( exec ) {  
			fn( exec.output.split(' ')[1] );
		} );
	},

	showWindow: function() {
		this.execute( "Show Window" );
	},

	hideWindow: function() {
		this.execute( "Hide Window" );
	},

	resetSystem: function() {
		this.execute( "Reset System" );
	},

	setConfig: function( fn ) {
		this.execute( "Set Config", fn );
	},

	start: function() { 
		this.execute( "Start" );
	},

	stop: function() {
		this.execute( "Stop" );
	},

	kill: function() {
		this.execute( "Exit" );
	}
}

// BCI2K.DataConnection relies on jDataView
// https://github.com/jDataView
if( window.jDataView === undefined ) {

	BCI2K.DataConnection = function() {
		console.error( "jDataView wasn't loaded before BCI2K.js, DataConnection currently unsupported." );
	}

} else { 

	jDataView.prototype.getNullTermString = function() {
		var val = "";
		while( this._offset < this.byteLength ) {
			v = this.getUint8();
			if( v == 0 ) break;
			val += String.fromCharCode( v );
		}
		return val;
	}

	jDataView.prototype.getLengthField = function( n ) {
		var len = 0;
		var extended = false;
		switch( n ) {
			case 1:
				len = this.getUint8();
				extended = len == 0xff;
				break;
			case 2:
				len = this.getUint16();
				extended = len == 0xffff;
				break;
			case 4:
				len = this.getUint32();
				extended = len == 0xffffffff;
				break;
			default:
				console.error( "unsupported" );
				break;
		}

		return extended ? parseInt( this.getNullTermString() ) : len;
	}

	BCI2K.DataConnection = function() {
		this._socket = null;

		this.onconnect = function( event ) {};
		this.onGenericSignal = function( data ) {};
		this.onStateVector = function( data ) {};
		this.onSignalProperties = function( data ) {};
		this.onStateFormat = function( data ) {};
		this.ondisconnect = function( event ) {};

		this.signalProperties = null;
		this.stateFormat = null;
		this.stateVecOrder = null;
	}

	BCI2K.DataConnection.prototype = {

		constructor: BCI2K.DataConnection,

		connect: function( address ) {
			this._socket = new WebSocket( "ws://" + address );

			var connection = this;

			this._socket.onopen = function( event ) {
				connection.onconnect( event );
			};

			this._socket.onmessage = function( event ) {
				var messageInterpreter = new FileReader();
				messageInterpreter.onload = function( e ) {
					connection._decodeMessage( e.target.result );
				}
				messageInterpreter.readAsArrayBuffer( event.data );
			};

			this._socket.onclose = function( event ) {
				connection.ondisconnect( event );
			};
		},

		connected: function() {
			return ( this._socket != null && this._socket.readyState == WebSocket.OPEN );
		},

		SignalType: {
			INT16 : 0,
			FLOAT24 : 1,
			FLOAT32 : 2,
			INT32 : 3
		},

		_decodeMessage: function( data ) {
			var dv = new jDataView( data, 0, data.byteLength, true );

			var descriptor = dv.getUint8();
			switch( descriptor ) {
				case 3:
					this._decodeStateFormat( dv ); break;
				case 4:
					var supplement = dv.getUint8();
					switch( supplement ) {
						case 1:
							this._decodeGenericSignal( dv ); break;
						case 3:
							this._decodeSignalProperties( dv ); break;
						default:
							console.error( "Unsupported Supplement: " + supplement.toString() );
							break;
					} break;
				case 5:
					this._decodeStateVector( dv ); break;
				default:
					console.error( "Unsupported Descriptor: " + descriptor.toString() ); break;
			}
		},

		_decodePhysicalUnits: function( unitstr ) {
			var units = {};
			var unit = unitstr.split( ' ' );
			var idx = 0;
			units.offset = Number( unit[ idx++ ] );
			units.gain = Number( unit[ idx++ ] );
			units.symbol = unit[ idx++ ];
			units.vmin = Number( unit[ idx++ ] );
			units.vmax = Number( unit[ idx++ ] );
			return units;
		},

		_decodeSignalProperties: function( dv ) {
			var propstr = dv.getNullTermString();

			// Bugfix: There seems to not always be spaces after '{' characters
			propstr = propstr.replace( /{/g, ' { ' );
			propstr = propstr.replace( /}/g, ' } ' ); 

			this.signalProperties = {};
			var prop_tokens = propstr.split( ' ' );
			var props = [];
			for( var i = 0; i < prop_tokens.length; i++ ) {
				if( $.trim( prop_tokens[i] ) == "" ) continue;
				props.push( prop_tokens[i] );
			}

			var pidx = 0;
			this.signalProperties.name = props[ pidx++ ];

			this.signalProperties.channels = [];
			if( props[ pidx ] == '{' ) {
				while( props[ ++pidx ] != '}' )
					this.signalProperties.channels.push( props[ pidx ] );
				pidx++; // }
			} else {
				var numChannels = parseInt( props[ pidx++ ] );
				for( var i = 0; i < numChannels; i++ )
					this.signalProperties.channels.push( ( i + 1 ).toString() );
			} 

			this.signalProperties.elements = [];
			if( props[ pidx ] == '{' ) {
				while( props[ ++pidx ] != '}' )
					this.signalProperties.elements.push( props[ pidx ] );
				pidx++; // }
			} else {
				var numElements = parseInt( props[ pidx++ ] );
				for( var i = 0; i < numElements; i++ )
					this.signalProperties.elements.push( ( i + 1 ).toString() );
			}
			
			// Backward Compatibility
			this.signalProperties.numelements = this.signalProperties.elements.length;
			this.signalProperties.signaltype = props[ pidx++ ];
			this.signalProperties.channelunit = this._decodePhysicalUnits(
				props.slice( pidx, pidx += 5 ).join( ' ' )
			);

			this.signalProperties.elementunit = this._decodePhysicalUnits(
				props.slice( pidx, pidx += 5 ).join( ' ' )
			);

			pidx++; // '{'

			this.signalProperties.valueunits = []
			for( var i = 0; i < this.signalProperties.channels.length; i++ )
				this.signalProperties.valueunits.push(
					this._decodePhysicalUnits( 
						props.slice( pidx, pidx += 5 ).join( ' ' )
					) 
				);

			pidx++; // '}'
			
			this.onSignalProperties( this.signalProperties );
		},

		_decodeStateFormat: function( dv ) {
			this.stateFormat = {};
			var formatStr = dv.getNullTermString();

			var lines = formatStr.split( '\n' );
			for( var lineIdx = 0; lineIdx < lines.length; lineIdx++ ){
				if( $.trim( lines[ lineIdx ] ).length == 0 ) continue;
				var stateline = lines[ lineIdx ].split( ' ' );
				var name = stateline[0];
				this.stateFormat[ name ] = {};
				this.stateFormat[ name ].bitWidth = parseInt( stateline[1] );
				this.stateFormat[ name ].defaultValue = parseInt( stateline[2] );
				this.stateFormat[ name ].byteLocation = parseInt( stateline[3] );
				this.stateFormat[ name ].bitLocation = parseInt( stateline[4] );
			}

			var vecOrder = []
			for( var state in this.stateFormat ) {
				var loc = this.stateFormat[ state ].byteLocation * 8;
				loc += this.stateFormat[ state ].bitLocation
				vecOrder.push( [ state, loc ] );
			}

			// Sort by bit location
			vecOrder.sort( function( a, b ) {
				return a[1] < b[1] ? -1 : ( a[1] > b[1] ? 1 : 0 );
			} );

			// Create a list of ( state, bitwidth ) for decoding state vectors
			this.stateVecOrder = [];
			for( var i = 0; i < vecOrder.length; i++ ) {
				var state = vecOrder[i][0]
				this.stateVecOrder.push( [ state, this.stateFormat[ state ].bitWidth ] );
			} 

			this.onStateFormat( this.stateFormat );
		},

		_decodeGenericSignal: function( dv ) {

			var signalType = dv.getUint8();
			var nChannels = dv.getLengthField( 2 );
			var nElements = dv.getLengthField( 2 );

			var signal = [];
			for( var ch = 0; ch < nChannels; ++ch ) {
				signal.push( [] );
				for( var el = 0; el < nElements; ++el ) {
					switch( signalType ) {

						case this.SignalType.INT16:
							signal[ ch ].push( dv.getInt16() );
							break;

						case this.SignalType.FLOAT32:
							signal[ ch ].push( dv.getFloat32() );
							break;

						case this.SignalType.INT32:
							signal[ ch ].push( dv.getInt32() );
							break;

						case this.SignalType.FLOAT24:
							// TODO: Currently Unsupported
							signal[ ch ].push( 0.0 );
							break;
					}
				}
			}

			this.onGenericSignal( signal );
		},

		_decodeStateVector: function( dv ) {
			if( this.stateVecOrder == null ) return;

			// Currently, states are maximum 32 bit unsigned integers
			// BitLocation 0 refers to the least significant bit of a byte in the packet
			// ByteLocation 0 refers to the first byte in the sequence.
			// Bits must be populated in increasing significance

			var stateVectorLength = parseInt( dv.getNullTermString() );
			var numVectors = parseInt( dv.getNullTermString() );

			var vecOff = dv.tell();

			var states = {};
			for( var state in this.stateFormat )
				states[ state ] = Array( numVectors ).fill( this.stateFormat[ state ].defaultValue ) ;

			for( var vecIdx = 0; vecIdx < numVectors; vecIdx++ ) {
				var vec = dv.getBytes( stateVectorLength, dv.tell(), true, false );
				var bits = [];
				for( var byteIdx = 0; byteIdx < vec.length; byteIdx++ ) {
					bits.push( ( vec[ byteIdx ] & 0x01 ) != 0 ? 1 : 0 );
					bits.push( ( vec[ byteIdx ] & 0x02 ) != 0 ? 1 : 0 );
					bits.push( ( vec[ byteIdx ] & 0x04 ) != 0 ? 1 : 0 );
					bits.push( ( vec[ byteIdx ] & 0x08 ) != 0 ? 1 : 0 );
					bits.push( ( vec[ byteIdx ] & 0x10 ) != 0 ? 1 : 0 );
					bits.push( ( vec[ byteIdx ] & 0x20 ) != 0 ? 1 : 0 );
					bits.push( ( vec[ byteIdx ] & 0x40 ) != 0 ? 1 : 0 );
					bits.push( ( vec[ byteIdx ] & 0x80 ) != 0 ? 1 : 0 );
				}

 				for( var stateIdx = 0; stateIdx < this.stateVecOrder.length; stateIdx++ ) {
					var fmt = this.stateFormat[ this.stateVecOrder[ stateIdx ][ 0 ] ];
					var offset = fmt.byteLocation * 8 + fmt.bitLocation;
					var val = 0; var mask = 0x01;
					for( var bIdx = 0; bIdx < fmt.bitWidth; bIdx++ ) {
						if( bits[ offset + bIdx ] ) val = ( val | mask ) >>> 0;
						mask = ( mask << 1 ) >>> 0;
					}
					states[ this.stateVecOrder[ stateIdx ][0] ][ vecIdx ] = val;
 				}
			}
			this.onStateVector( states );
		},
	}
}