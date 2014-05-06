require.config({
    // alias libraries paths
    paths: {
        'domReady': 'libs/requirejs-domready/domReady',
		'jquery' : 'libs/jquery/dist/jquery',
		'handlebars' : 'libs/handlebars/handlebars',
		'ember' : 'libs/ember/ember',
        'socket.io': '/socket.io/socket.io.js',
		'app' : 'app'		
    },
	shim: { 
		'app' : {
			deps : ['ember', 'socket.io']
		},
		'ember' : {
			deps : ['jquery', 'handlebars']
		}
	}
});

require(["app"], function(a){
	
})