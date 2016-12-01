bci = new BCI2K.Connection();
bci.connect();

( function( $ ){
	$( function() {
		$( '.button-collapse' ).sideNav();
		$( '.modal-trigger' ).leanModal();
		$( '.slider' ).slider( {full_width: true} );
		$( '.slider' ).slider( 'pause' );
	} );
} )( jQuery ); // end of jQuery name space