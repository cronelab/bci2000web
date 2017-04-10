var BCI2K = BCI2K || {};

BCI2K.ModConfig = function() {
	this.executable = "";
	this.launchflags = [ "--local" ];
}

BCI2K.ModConfig.prototype = {
	constructor: BCI2K.ModConfig,
	exepath: "",
	pre: function() { return ""; },
	launch: function() { return "Start executable " + this.exepath + this.executable + " " + this.launchflags.join( ' ' ) + "; "; },
	post: function() { return ""; },
}

// SignalSource Configuration
BCI2K.SourceConfig = function( source ) { 
	this.executable = ( source === undefined ) ? "SignalGenerator" : source
}
BCI2K.SourceConfig.prototype = new BCI2K.ModConfig();
BCI2K.SourceConfig.prototype.constructor = BCI2K.SourceConfig;
BCI2K.SourceConfig.prototype.post = function() {
	var ret_ = "Set Parameter SamplingRate 1000Hz; ";
	return ret_;
}

// SignalProcessing Configuration
BCI2K.ProcConfig = function( proc ) {
	this.executable = ( proc === undefined ) ? "DummySignalProcessing" : proc;
}
BCI2K.ProcConfig.prototype = new BCI2K.ModConfig();
BCI2K.ProcConfig.prototype.constructor = BCI2K.ProcConfig;

// Application Configuration
BCI2K.AppConfig = function( app ) {
	this.executable = ( app === undefined ) ? "DummyApplication" : app;
}
BCI2K.AppConfig.prototype = new BCI2K.ModConfig();
BCI2K.AppConfig.prototype.constructor = BCI2K.AppConfig;

// SOURCE CONFIGURATIONS

// Nihon Kohden Configuration
BCI2K.NKConfig = function( deviceAddress ) {
	BCI2K.SourceConfig.call( this, "NihonKohdenSource" );
	this.address = deviceAddress;
}

BCI2K.NKConfig.prototype = new BCI2K.SourceConfig();
BCI2K.NKConfig.prototype.constructor = BCI2K.NKConfig;
BCI2K.NKConfig.prototype.post = function() {
	var ret_ = "";
	if( this.address !== undefined ) {
		ret_ += "Set Parameter DeviceAddress "
			+ this.address.toString() + "; ";
		ret_ += "Set Parameter SampleBlockSize 100; ";
	}
	return ret_;
}

// Blackrock Configuration
BCI2K.BlackrockConfig = function( instances, samplingRate ) {
	BCI2K.SourceConfig.call( this, "Blackrock" );
	this.instances = instances;
	this.samplingRate = samplingRate;
}

BCI2K.BlackrockConfig.prototype = new BCI2K.SourceConfig();
BCI2K.BlackrockConfig.prototype.constructor = BCI2K.BlackrockConfig;
BCI2K.BlackrockConfig.prototype.post = function() {
	var ret_ = "";
	if( this.instances !== undefined )
		ret_ += "Set Parameter NSPInstances "
			+ this.instances.toString() + "; ";
	if( this.samplingRate !== undefined )
		ret_ += "Set Parameter SamplingRate "
			+ this.samplingRate.toString() + "; ";
	return ret_;
}

// Grapevine Configuration
BCI2K.GrapevineConfig = function( samplingRate ) {
	BCI2K.SourceConfig.call( this, "Grapevine" );
	this.samplingRate = samplingRate;
}

BCI2K.GrapevineConfig.prototype = new BCI2K.SourceConfig();
BCI2K.GrapevineConfig.prototype.constructor = BCI2K.GrapevineConfig;
BCI2K.GrapevineConfig.prototype.post = function() {
	var ret_ = "";
	if( this.samplingRate !== undefined ) {
		ret_ += "Set Parameter SamplingRate "
			+ this.samplingRate.toString() + "; ";
		if( this.samplingRate == 1000 )
			ret_ += "Set Parameter SampleBlockSize 48; ";
	}
	return ret_;
}

// Biosemi 2 Configuration
BCI2K.Biosemi2Config = function( prm ) {
	BCI2K.SourceConfig.call( this, "Biosemi2" );
	var fragPath = "../parms.ecog/AmpFragments/Biosemi2/";
	if( prm === undefined ) prm = 'BioSemi32CH.prm';
	this.prm = fragPath + prm;
}

BCI2K.Biosemi2Config.prototype = new BCI2K.SourceConfig();
BCI2K.Biosemi2Config.prototype.constructor = BCI2K.Biosemi2Config;
BCI2K.Biosemi2Config.prototype.post = function() {
	return "Load Parameterfile " + this.prm + "; ";
}

// Storage configuration
BCI2K.StorageConfig = function( subject, task, session ) {
	var ret = 'Set parameter SubjectName ' + subject + "; "; 
	if( session ) ret += 'Set parameter SubjectSession ' + session + '; ';
	ret += 'Set parameter DataFile ';
	ret += '"%24%7bSubjectName%7d/' + task + '/%24%7bSubjectName%7d_';
	ret += task + '_S%24%7bSubjectSession%7dR%24%7bSubjectRun%7d.';
	ret += '%24%7bFileFormat%7d"; ';
	return ret;
}

BCI2K.StartupConfig = function( system ) {
	if( system === undefined ) system = "localhost";
	this.startupConfig = system;
}

BCI2K.StartupConfig.prototype = {
	constructor: BCI2K.StartupConfig,
	pre: function() { return ""; },
	system: function() { return "Startup system " + this.startupConfig + "; "; },
	post: function() { return ""; },
}

BCI2K.Config = function( data ) {
	this.subject = data.subject;
	this.task = data.task;
	this.session = data.session;
	this.startupConfig = ( data.startupConfig === undefined ) ?
		new BCI2K.StartupConfig() : eval( data.startupConfig );
	this.sourceConfig = ( data.sourceConfig === undefined ) ? 
		new BCI2K.SourceConfig() : eval( data.sourceConfig );
	this.procConfig = ( data.procConfig === undefined ) ? 
		new BCI2K.ProcConfig() : eval( data.procConfig );
	this.appConfig = ( data.appConfig === undefined ) ? 
		new BCI2K.AppConfig() : eval( data.appConfig );

	if( data.startPort != 4000 ) {
		this.startupConfig.startupConfig = 
			"* SignalSource:" + data.startPort.toString() +
			" SignalProcessing:" + ( data.startPort + 1 ).toString() +
			" Application:" + ( data.startPort + 2 ).toString();
		this.sourceConfig.launchflags[ 0 ] = "127.0.0.1:" + data.startPort.toString();
		console.log( this.sourceConfig.launchflags );
		this.procConfig.launchflags[ 0 ] = "127.0.0.1:" + ( data.startPort + 1 ).toString();
		console.log( this.sourceConfig.launchflags );
		this.appConfig.launchflags[ 0 ] = "127.0.0.1:" + ( data.startPort + 2 ).toString();
	}
}

BCI2K.Config.prototype = {

	constructor: BCI2K.Config,

	script: function() {
		var ret_ = "Reset System; ";
		ret_ += this.startupConfig.pre();
		ret_ += this.startupConfig.system();
		ret_ += this.startupConfig.post();
		ret_ += this.sourceConfig.pre();
		ret_ += this.procConfig.pre();
		ret_ += this.appConfig.pre();
		ret_ += this.sourceConfig.launch();
		ret_ += this.procConfig.launch();
		ret_ += this.appConfig.launch();
		ret_ += "Wait for Connected; ";
		storage = BCI2K.StorageConfig( this.subject, this.task, this.session );
		ret_ += storage;
		ret_ += this.sourceConfig.post();
		ret_ += this.procConfig.post();
		ret_ += this.appConfig.post();
		return ret_;
	},
}

BCI2K.CreateConfig = function( callback, input, prompt ) {
	if( input === undefined ) input = {};

	function doPrompt( data ) {
		if( data.subject === undefined && prompt )
			data.subject = window.prompt( "Please enter SubjectID" );
		if( data.task === undefined && prompt )
			data.task = window.prompt( "Please enter Task" );
		callback( new BCI2K.Config( data ) );
	}

	$.getJSON( "/web/localconfig.json", function( data ) {
		if( data.subject === undefined ) data.subject = input.subject;
		if( data.task === undefined ) data.task = input.task;
		if( data.session === undefined ) data.session = input.session;
		if( data.sourceConfig === undefined ) data.sourceConfig = input.sourceConfig;
		if( data.procConfig === undefined ) data.procConfig = input.procConfig;
		if( data.appConfig === undefined ) data.appConfig = input.appConfig;
		if( data.startPort === undefined ) data.startPort = input.startPort || 4000;
		doPrompt( data );
	} ).fail( function( data ) {
		doPrompt( input );
	} );
}