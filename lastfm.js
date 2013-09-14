var datetime = require('./datetime.js');
var request  = require('request'); 
var http     = require('http');
var url      = require('url');
var timeago  = require('timeago');

var response = "";
var ready = false;
var lastfmLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAFxFAABcRQG5LWIsAAAB7klEQVQ4T7VTTUjUURB/q2gQBhGVmdnuxqp1sDx4qIMfp6CDUFBSJLGHZMsOaywLEYmCGEEKCh4EEVmhm+BhD9alg0EXYSFCKnX/H7uV7ae7sG3uurs/583/D25RhxAfDG/ezJvfzJv5PaE1V2I/IvYTLGMPAqACWqMFWhPtfz6viezSV2bfq+B8JdQGAaVOQD1HIvVTwgAikbpqI7Gb9kbyUYwBQIpyRuDbtRZk3/qxE9pAbjWA+DMX22VgYvQx8l8+Iq98RnpmDNqFw9AcFQaAarcg1FaLYiqB/PoqIq5epH2TkCs6cBubty6zHn96n4Xt/Te4WgZQTlKGoYfs+Nplw0aNYMkuv6Zqgoh57rIv5r0HveUo9ItHqIJD3AsGCB4XSM+OA8UiOaqhOuidBBpxdXPg5p12pOemUMrn+PxzaQF66zHqlcUEOCGQfOFhZ7jTytmDZNMv1QCFAjKL81gT1AurBT+cV/ne1sQg3zF6YBUId9hQ2s5yD6LuPmT8r5Cafo74YD8HZBZ9iPT1IDHi5nNi+BGCtSYAT6Fe4PvNK8i+e8NT+LWyjMiD65wl5nViO/AeO/o6cp8+IPnyCfGhisScQvkoldPmrGmXoFqzwQGpMz/Okk6Ztd94UM44SZy/MfEf9oP4C//3vXcB/nZZlpVZrGoAAAAASUVORK5CYII=";
var eqimg = "data:image/gif;base64,R0lGODlhDAAMALMAAP///9bW1s7Ozr29vbW1ta2traWlpZycnJSUlIyMjAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQEBQD/ACwAAAAADAAMAAAEORAEQisNQJRdKDeCIXKbKB7oYQBAiiIwcrAxnCB0DiR8wvq7X+9H3A2DSB6ix+whBs3mADBYNp+ACAAh+QQEBQD/ACwAAAAADAAMAAAEOBAEQisNQJRdKDeCIXKbKB7oYaYoggDAAbt08gJ3nexw0vc7H0BIDP6GQERwGUQMmMwBYKBkOgERACH5BAQFAP8ALAAAAAAMAAwAAAQ3EARCKw1AlF0oN4IhcpsoHuhhAECKIjBysDGc1LSd7GzS70AfQEgE9o7DW3B5GzCDA8AAwUREIwAh+QQEBQD/ACwAAAAADAAMAAAEOBAEQisNQJRdKDeCIW4AUIjioR5GuapIjBylHCd2XSZ8n+y7HhDwIwqJQx7Cx8QNmr4BYLBkIqQRACH5BAQFAP8ALAAAAAAMAAwAAAQ4EARCKw1AlF0oN4IhcpsoHuhhAECKIjBysDGc1LSd7GzS9zsfQEgM/oZARHAZRAyYzAFgoGQ6AREAIfkEBAUA/wAsAAAAAAwADAAABDgQBEIrDUCUXSg3giFymyge6GGmKOIiBwC8boLI91wnvJz4vOAPMCwGfUiiTci0DZrCAWCAaCKkEQAh+QQEBQD/ACwAAAAADAAMAAAENxAEQisNQJRdKDeCIXKbKB7oYaYoggBA6s7JC9h0osMJz+s9QHAI9Al/CKASiBgslwPAILlsAiIAIfkEBAUA/wAsAAAAAAwADAAABDYQBEIrDUCUXSg3giFymygeBwCYaIsgqqu+CQy8r5rsie4DvB7wFyTqasFkbaAMDgADhBLxjAAAIfkEBAUA/wAsAAAAAAwADAAABDcQBEIrDUCUXSg3giFymyge6GGmKIIAQOrOyQvMdKLDCc/rPUBwCPQJfwigEogYLJcDwCC5bAIiACH5BAQFAP8ALAAAAAAMAAwAAAQ3EARCKw1AlF0oN4IhcpsoHuhhpiiCAEDqzskL2HaiJzAP+Dtgr7cb/oiIoLI2WAYHgEFSiYBGAAAh+QQEBQD/ACwAAAAADAAMAAAENxAEQisNQJRdKDeCIXKbKB7oYaYo4iIHALxuQstvoicyD/g7YK+3G/6IiKDSNlgGB4BBUomARgAAOw==";

function getLastFMData(user,res) {
  console.log('getting last.fm data');
  res.writeHead(200, {'Content-Type': 'text/html','Access-Control-Allow-Origin':'*'});
  requrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+user+'&api_key=59fb3f19e8b0666ec80b6284b055ac9e&format=json&limit=1';
  request(requrl,
      function(e,r,b){
       try{
        var laststatus,lasttime,lasttrack;
        data = JSON.parse(b);
        var recent = [].concat(data.recenttracks.track)[0];
   	if("@attr" in recent && recent["@attr"]["nowplaying"]=="true"){
   	        laststatus = ' is listening:';
   		lasttime = 'right now  <img src="'+eqimg+'"></img>';
   	}else{
   		laststatus = "'s last track:";
   		lasttime = " " + timeago(new Date(parseInt(recent["date"]["uts"])*1000));
   	}
	lasttrack = recent.artist['#text'] + ' - ' + recent.name;
        html = '<p class="view"><img src="'+lastfmLogo+'"> </img>  <a hred="http://last.fm/user/'+user+'">'+user+'</a><span id="laststatus">'+laststatus+'</span><br><span class="last-track" id="lasttrack">'+lasttrack+'</span> <span class="last-time" id="lasttime">'+lasttime+'</span></p>';
        res.end(html);
       }catch(err){res.end('<p class="error">Error: User "'+user+'" not found!</p>');}
    }
  );
}

function getArtworkURL(query,res) {
  console.log('getting last.fm data');
  res.writeHead(200, {'Content-Type': 'text/html','Access-Control-Allow-Origin':'*'});
  requrl = 'http://ws.audioscrobbler.com/2.0/?method=track.search&track='+query.replace(/ /g,'+')+'&api_key=59fb3f19e8b0666ec80b6284b055ac9e&format=json&limit=1';
  request(requrl,
      function(e,r,b){
       try{
        var laststatus,lasttime,lasttrack;
        data = JSON.parse(b);
        artwork = data.results.trackmatches.track.image[3]["#text"]; 
        res.end(artwork);
       }catch(err){res.end('ERROR!');}
    }
  );
}

http.createServer(function (req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query; 
  console.log(query)
  res.writeHead(200, {'Content-Type': 'text/html'});
  if('user' in query){
     request('http://nightbla.de/appcounter/add/'+req.connection.remoteAddress+'/lastTrack/');
    getLastFMData(query['user'],res);
  }else if('artwork' in query){
    getArtworkURL(query['artwork'],res);
  }else{
    res.end('Key "user" not found in request.');
  }
}).listen(8431,'10.211.42.119');
console.log('Server running at http://52.235.72.44:8431/');
