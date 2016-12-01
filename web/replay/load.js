// This load function gets the categories json file and loads
// the category labels and centers.
var blocks = null;
var categories = null;
( function loadBlocks() { 
	$.getJSON( paradigm.categories, function( data ) {
		// The paradigm categories are in 'data'
		// .labels is a list of the category labels
		// .centers is a list of the same length as .labels
		//    that contains the category centers.
		categories = data;

		// Now that we know the categories, we need to decide
		// what the block presentation order is.  We might close
		// the system down or restart between blocks, so we want
		// the same stimuli to appear in a block between reloads.
		// The order of stimuli within that block is irrelevant,
		// and should probably be randomized anyway.

		// Start by populating 'blocks' with empty arrays
		blocks = [];
		for( i = 0; i < paradigm.n_blocks; i++ )
			blocks.push( [] );

		// Deal the category indices into the collection of blocks
		for( i = 0; i < categories.labels.length; i++ )
			blocks[ i % blocks.length ].push( i );

		/*// Push a "Choose A Category" trial into each block
		// We'll define this trial as category index 'categories.labels.length'
		// and shuffle the within-block stimulus order for good science.
		for( i = 0; i < blocks.length; i++ ) {
			blocks[ i ].push( categories.labels.length );
			blocks[ i ].sort( function() { return .5 - Math.random(); } );
		}

		// Might as well just add the stimulus to the list.
		// NB that there will not be a corresponding category center.
		categories.labels.push( 'Choose A Category' );*/
	} )
} )();

// This load function checks whether or not a model exists
// and sets up UI interactions that control whether or not
// the model is applied, and provide a button for training
var modelAvailable = null;
var applyModel = null;
var modelFile = null;
( function setupModelSection() {
	if( bci.connected() && config && blocksDone ) {
		// Ultimate location for a model file for this subject that may or may not exist
		modelFile = "../data/" + config.subject + "/" + paradigm.name + "/model.prm";
		// If at least one of the elements in blocksDone is true, we have **some** data available
		var dataAvailable = blocksDone.some( function( element, index, array ) { return element; } );

		// Ask BCI2000 to determine if the model file exists
		bci.execute( "IS FILE " + modelFile, function( result ) {
			modelAvailable = ( result.output.search( "true" ) != -1 );
			if( dataAvailable ) {
				// If data is available, we certainly have the ability to train a model
				$( "#modelsection" ).append( '<div id="trainbutton" class="btn"></div>' );
				$( "#trainbutton").mouseup( trainModel );

				if( modelAvailable ) {
					// If we have a model available, we can retrain the model,
					// and choose whether or not to apply the model.
					$( "#trainbutton" ).append( "Retrain Model" );
					$( "#modelsection" ).append( '<div id="applymodel" class="btn"></div>');

					// Because we'll immediately simulate a click on the applyModel button
					// which will toggle the value of applyModel, we'll negate it here.
					applyModel = !paradigm.default_apply_model;

					$( "#applymodel" ).mouseup( function() {
						applyModel = !applyModel; // When the applymodel button is clicked, toggle applyModel
						$( "#applymodel" ).text( ( applyModel ) ? "Apply Model ☑" : "Apply Model ☐" );
						$( "#applymodel" ).attr( 'class', 'btn' + ( applyModel ? " done" : "" ) );
					} ).mouseup();

				} else $( "#trainbutton" ).append( "Train Model" );
			}
		} );
	} else setTimeout( setupModelSection, 200 );
} )();

var blocksDone = null;
( function setupBlockButtons() {
	if( bci.connected() && config && blocks ) {
		// Set a click handler for the Tutorial Button
		$( "#tutorialbutton" ).mouseup( startTutorial );

		// Let's determine what blocks have been run already via a BCI2000 query
		datadir = "../data/" + config.subject + "/" + paradigm.name + "/";
		query = "IF ${ IS DIRECTORY " + datadir + " }; LIST FILES " + datadir + " *.dat; END;";
		bci.execute( query, function( data ) {
			blocksDone = [];
			if( data.output.trim() != '0' ) {
				$( "#blockbuttons" ).append( '<div class="header">Choose a Block</div><br>' )
				for( i = 0; i < blocks.length; i++ ) {
					// Create a button for each block
					block = ( i + 1 ).toString();
					btnID = "block" + block;
					done = data.output.search( 'S' + ( "00" + block ).slice( -3 ) ) != -1;
					blocksDone.push( done );
					$( "#blockbuttons" ).append( '<div id="' + btnID + '">' + block + '</div>' );

					// Apply a slightly different style to blocks that have been run already
					$( "#" + btnID ).attr( 'class', 'btn block' + ( done ? " done" : "" ) )
									.attr( 'unselectable', 'on' )
									.mouseup( { block: i }, start );
				}
			}
		} );
	} else setTimeout( setupBlockButtons, 200 );
} )();