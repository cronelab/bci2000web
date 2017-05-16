function getReplayFiles() {

	var replayFiles = {};
	bci.execute( "LIST DIRECTORIES ../data/", getPatientTasks );

	function getPatientTasks( result ) {
		patients = result.output.trim().split( '\n' );
		console.log( patients );
		for( var i = 0; i < patients.length; i++ ) {
			if( patients[i] == "" ) continue;
			var query = "LIST DIRECTORIES ../data/" + patients[i];
			bci.execute( query, parsePatientTasks( patients[i] ) );
		}
	}

	function parsePatientTasks( patient ) {
		return function( result ) {
			tasks = result.output.trim().split( '\n' );
			console.log( tasks );
			for( var i = 0; i < tasks.length; i++ ) {
				var query = "LIST FILES ../data/" + patient + "/" + tasks[i] + " *.dat";
				bci.execute( query, findTaskFiles( patient, tasks[i] ) );
				replayFiles[ patient ] = {};
			}
		}
	}

	function findTaskFiles( patient, task ) {
		return function( result ) {
			replayFiles[ patient ][ task ] = []
			var files = result.output.trim().split( '\n' );
			console.log( files );
			for( var i = 0; i < files.length; i++ )
				if( files[i] != "" )
					replayFiles[ patient ][ task ].push( files[i] );
			updateArchive( replayFiles );
		}
	}
}

function updateArchive( replayFiles ) {

	function getKeys( obj ) {
		var keys = [];
		for( var key in obj )
			if( obj.hasOwnProperty( key ) )
				keys.push( key )
		return keys;
	}

	var html = "";

	var patients = getKeys( replayFiles ).sort();
	for( var pat_idx = 0; pat_idx < patients.length; pat_idx++ ) {
		html += '<li>';
		html += '	<label label-default="" class="tree-toggler nav-header patient-label"><h2>' + patients[ pat_idx ] + '</h2></label>';
		html += '	<ul class="nav tree active-trial">';
		var tasks = getKeys( replayFiles[ patients[ pat_idx ] ] ).sort();
		for( var task_idx = 0; task_idx < tasks.length; task_idx++ ) {
			html += '	<li>';
			html += '	<label label-default="" class="tree-toggler nav-header">' + tasks[ task_idx ] + '</label>';
			html += '	<ul class="nav tree active-trial">'
			var files = replayFiles[ patients[ pat_idx ] ][ tasks[ task_idx ] ];
			for( var file_idx = 0; file_idx < files.length; file_idx++ ) {
				handler = "launchSession( '" + patients[ pat_idx ] + "', '" + tasks[ task_idx ] + "', '" + files[ file_idx ] + "' );";
				html += '	<li><a onclick="' + handler + '">' + files[ file_idx ] + '</a></li>';
			}
			html += '	</ul>';
			html += '</li>';
		}
		html += '	</ul>';
		html += '</li>';
		html += '<li class="nav-divider"></li>';
	}

	$( '#archive' ).html( html );

	$( 'label.tree-toggler' ).click( function () {
		$( this ).parent().children( 'ul.tree' ).toggle( 300 );
	} );

	$( '.tree-toggler' ).parent().children( 'ul.tree' ).toggle( 1000 );
}

function launchSession( patient, task, file ) {
	var datafile = '../data/' + patient + '/' + task + '/' + file;

	var script = "Reset System; "
	script += "Startup System localhost; "
	script += "Start executable SpectralSignalProcessingMod --local; ";
	script += "Start executable DummyApplication --local; ";
	script += "Start executable FilePlayback --local --FileFormat=Null --PlaybackStates=1 --PlaybackFileName=" + datafile + "; ";
	script += "Wait for Connected; ";
	script += "Load Parameterfile ../parms.ecog/SpectralSigProc.prm; ";

	script += "Set Parameter WSSpectralOutputServer *:20203; ";
	script += "Set Parameter WSConnectorServer *:20323; ";
	script += "Set Parameter WSSourceServer *:20100; ";

	script += "Set Config; ";
	script += "Wait for Resting; ";
	script += "Start; ";

	bci.execute( script );
}

