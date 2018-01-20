const request = require('request');
const { forEach } = require('p-iteration');
const fs = require('fs')

var online = "<span style='color: " + "#70ff8a" + "'>Online</span>";
var offline = "<span style='color: " + "#ff7070" + "'>Offline</span>";
var disrupted = "<span style='color: " + "#f2e05c" + "'>Disrupted</span>";


var servers = [["https://fivem.net/", "Main Webserver"], ["https://servers.fivem.net/", "Server List"], ["https://servers-live.fivem.net/api/servers/proto", "Server API"], ["https://runtime.fivem.net/", "Runtime"], ["https://metrics.fivem.net/", "Metrics"], ["https://forum.fivem.net/", "Forums"], ["https://wiki.fivem.net/", "Wiki"], ["https://keymaster.fivem.net/", "Keymaster Server"], ["https://lambda.fivem.net/", "Lambda"], ["http://crashes.fivem.net/", "Crash server"]];
function poll() {
  var tmpstatus = []

  forEach(servers, async (server, i) => {

 request(server[0], {timeout: 5000, time : true}, function (error, response) {
      var json = JSON.parse(fs.readFileSync("./public/"+server[1] + '_time.json'))
      var json2 = JSON.parse(fs.readFileSync("./public/"+server[1] + '_up.json'))
      if (!error && (response.statusCode == 200 || response.statusCode == 404)) {
      
        
          if (response.elapsedTime >= 2000){
            tmpstatus.push({name:server[1], status:disrupted, time: response.elapsedTime });
          } else {
          tmpstatus.push({name:server[1], status:online, time: response.elapsedTime });
        }
          json.push(response.elapsedTime)
          json2.push(1)
          fs.writeFile("./public/"+server[1] + '_time.json', JSON.stringify(json), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
          fs.writeFile("./public/"+server[1] + '_up.json', JSON.stringify(json2), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });

        
          
        
      }else {
        tmpstatus.push({name:server[1], status:offline, time: "--" });
          json.push(null)
          json2.push(0)
          fs.writeFile("./public/"+server[1] + '_time.json', JSON.stringify(json), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
          fs.writeFile("./public/"+server[1] + '_up.json', JSON.stringify(json2), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
      }
      if (tmpstatus.length == servers.length) {
        tmpstatus = tmpstatus.sort((a, b) => {
          if (a[2] > b[2]) {
            return 1;
          } else {
            return -1;
          }
        })
        status = tmpstatus;
        ready = true;
      }
    });
  })
  
}

function start() {
  poll();
  
  setInterval(poll, 60000);
}

function getStatus() {
  if (ready) {
    return status;
  } else {
    return [];
  }
}

module.exports = {start, getStatus};
