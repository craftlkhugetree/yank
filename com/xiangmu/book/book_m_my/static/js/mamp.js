;(function(){
  function injectScript(url) {
    var script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
  };
  function init(){
    var pathPrefix = "https://injectionmamp/";
    if (pathPrefix === null) {
        console.log('Could not find mamp.js script tag. Plugin loading may fail.');
        pathPrefix = '';
    }
    injectScript(pathPrefix + 'cordova.js');
  }
  
  init();
  
  window.mamp = {};
  window.mamp.initEnv = function(callback){
  document.addEventListener("deviceready", callback, false);
  };
  
})();