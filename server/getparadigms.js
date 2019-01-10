// Requires

var process         = require( 'process' );
var path            = require( 'path' );
var fs              = require( 'fs' );
var childProcess    = require('child_process' );

// var GitHub          = require( 'github-api' );
var GitHub          = require( 'github-api-node' );
var prompt          = require( 'prompt' );


// Globals

var promptSchema = {
    properties: {
        username: {
            required: true,
        },
        password: {
            required: true,
            hidden: true
        }
    }
};

var paradigmsPath = path.join( process.cwd(), 'web', 'paradigms' );


// Logic

var appendUsername = function( username, url ) {
    urlParts = url.split( '://' );
    return ( urlParts[0] + '://' + username + '@' + urlParts[1] );
};

var checkOperation = function( repoPath ) {

    return new Promise( function( resolve, reject ) {

        fs.stat( repoPath, function( err, stats ) {

            if ( err ) {
                if ( err.code == 'ENOENT' ) {
                    // Folder doesn't exist, so direct clone
                    resolve( 'clone' );
                    return;
                } else {
                    reject( JSON.stringify( 'Error retrieving repo path stats: ' + err.code ) );
                    return;
                }
            }

            // Entity exists at repoPath

            if ( stats.isFile() ) {
                reject( JSON.stringify( 'Repo path is a file' ) );
                return;
            }

            if ( ! stats.isDirectory() ) {
                // TODO Are file and directory only two choices?
                reject( JSON.stringify( 'Repo path is a non-directory entity' ) );
                return;
            }

            // Is a directory; check for .git

            fs.stat( path.join( repoPath, '.git' ), function( err, stats ) {

                if ( err ) {
                    if ( err.code == 'ENOENT' ) {
                        // .git file doesn't exist, so still clone
                        resolve( 'clone' );
                        return;
                    } else {
                        reject( JSON.stringify( 'Error retrieving repo .git stats: ' + err.code ) );
                        return;
                    }
                }

                // Entity exists at repoPath/.git

                if ( stats.isFile() ) {
                    reject( JSON.stringify( 'Repo .git is a file; weird' ) );
                    return;
                }

                if ( ! stats.isDirectory() ) {
                    // TODO Are file and directory only two choices?
                    reject( JSON.stringify( 'Repo .git is a non-directory entity; super weird' ) );
                    return;
                }

                // Is a directory; we can (relatively) safely call pull
                resolve( 'pull' );
                return;

            } );

        } );

    } );

};

var checkNPM = function( repoPath ) {

    return new Promise( function( resolve, reject ) {

        // Check if this repo is also a NPM module
        fs.stat( path.join( repoPath, 'package.json' ), function( err, stats ) {

            if ( err ) {
                if ( err.code == 'ENOENT' ) {
                    // File doesn't exist, not a module
                    resolve( false );
                    return;
                } else {
                    // TODO Should reject, but that'll break the chain
                    resolve( false );
                    // reject( JSON.stringify( 'Error retrieving package.json path stats: ' + err.code ) );
                    return;
                }
            }

            if ( stats.isFile() ) {
                // File *does* exist, so module
                resolve( true );
                return;
            }

            // Something weird
            resolve( false );
            return;

        } );

    } );

};

var handleRepo = function( repo, operation ) {

    return new Promise( function( resolve, reject ) {

        var gitVerb = null;
        var gitArgs = null;
        var gitCwd = null;

        if ( operation == 'clone' ) {
            gitVerb = 'Cloning';
            gitArgs = ['clone', repo.url];
            gitCwd = paradigmsPath;
        } else if ( operation == 'pull' ) {
            gitVerb = 'Pulling';
            gitArgs = ['pull'];
            gitCwd = repo.path;
        } else {
            reject( 'Unrecognized git operation: ' + operation );
            return;
        }

        console.log( '** ' + gitVerb + ' ' + repo.name );

        var git = childProcess.spawn( 'git', gitArgs, {
            cwd: gitCwd,
            stdio: 'inherit'
        } );

        git.on( 'close', function( code ) {

            var finishUp = function() {
                console.log();
                resolve( code );
            }

            /*
            checkNPM( repo.path ).then( function( isModule ) {

                if ( !isModule ) {
                    finishUp();
                    return;
                }

                console.log( '* Updating Node module' );

                var npm = childProcess.spawn( 'npm', ['install'], {
                    cwd: repo.path,
                    stdio: 'inherit'
                } );

                npm.on( 'close', function( code ) {
                    finishUp();
                } );

            } );
            */

            // TODO Above code is broken on some Windows versions
            finishUp();

        } );

    } );

};

var accessGH = function( username, password ) {

    var gh = new GitHub( {
        username: username,
        password: password,
        auth: 'basic'
    } );

    var me = gh.getUser();
    me.orgRepos( 'cronelab', function( err, repos ) {

        if ( err ) {
            console.log( 'Could not get cronelab repos:' );
            console.log( JSON.stringify( err ) );
            return;
        }

        var goodRepos = [];
        repos.filter( function( repo ) {
          //Unity project seems to break paradigm pull. No idea, fix later.
          
          if(repo.name!="webFM_Unity"){
            return repo.description.search( '\\[Paradigm\\]' ) == 0;
          }
          } ).forEach( function( repo ) {
            goodRepos.push( {
                name: repo.name,
                "path": path.join( paradigmsPath, repo.name ),
                url: appendUsername( username, repo.clone_url )
            } );
        } );

        console.log( 'Found ' + goodRepos.length + ' paradigm repos on cronelab' );
        console.log();

        goodRepos.reduce( function( curPromise, repo ) {
            return curPromise.then( function() {
                return checkOperation( repo.path )
                        .then( function( operation ) {
                            return handleRepo( repo, operation );
                        } )
                        .catch( function( reason ) {
                            console.log( 'Could not ' + operation + ' repo ' + repo.name + ': ' + reason );
                        } );
            } );
        }, Promise.resolve() ).then( function() {
            console.log( '** Done.' );
        } );

    } );

};

/* github-api based
var accessGH = function( username, password ) {

    var gh = new GitHub( {
        username: username,
        password: password
    } );

    var cronelab = gh.getOrganization( 'JHUBMEBuilds' );
    cronelab.getRepos( function( err, repos ) {

        if ( err ) {
            console.log( 'ERR' );
            console.log( JSON.stringify( err ) );
            return;
        }

        var goodRepos = [];

        repos.filter( function( repo ) {
            return repo.description.search( '\\[Paradigm\\]' ) >= 0;
        } ).forEach( function( repo ) {
            goodRepos.push( {
                name: repo.name,
                "path": path.join( paradigmsPath, repo.name ),
                url: appendUsername( repo.git_url )
            } );
        } );

        console.log( 'Found ' + goodRepos.length + ' paradigm repos on cronelab' );

        goodRepos.reduce( function( curPromise, repo ) {
            return curPromise.then( function() {
                return checkOperation( repo.path )
                        .then( function( operation ) {
                            return handleRepo( repo, operation );
                        } )
                        .catch( function( reason ) {
                            console.log( 'Could not ' + operation + ' repo ' + repo.name + ': ' + reason );
                        } );
            } );
        }, Promise.resolve() ).then( function() {
            console.log( 'Done.' );
        } );

    } );

};
*/


console.log( 'Enter GitHub credentials:' );

prompt.start();

prompt.get( promptSchema, function( err, result ) {

    if ( err ) {
        console.log( 'error: Could not get credentials' );
        process.exit( 1 );
    }

    accessGH( result.username, result.password );

} );
