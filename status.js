const request = require('request');
const { forEach } = require('p-iteration');
const fs = require('fs')

var online = "<span style='color: " + "#70ff8a" + "'>Online</span>";
var offline = "<span style='color: " + "#ff7070" + "'>Offline</span>";
var disrupted = "<span style='color: " + "#f2e05c" + "'>Disrupted</span>";


var servers = [["https://fivem.net/", "Main Webserver"], ["https://servers.fivem.net/", "Server List"], ["https://servers-live.fivem.net/", "Server API", (e, r, b) => {return(!e && !b.includes("Error") && !b.includes("a padding to disable MSIE and Chrome friendly error page"))}], ["https://runtime.fivem.net/", "Runtime"], ["https://metrics.fivem.net/", "Metrics", (e, r, b) => {return(!e && b.includes("Matomo"))}], ["https://forum.fivem.net/", "Forums", (e, r, b) => {return(!e && b.includes("hidden-login-form"))}], ["https://wiki.fivem.net/", "Wiki"], ["https://keymaster.fivem.net/", "Keymaster Server"], ["https://lambda.fivem.net","Lambda Server"]];
function poll() {
  var tmpstatus = []

  forEach(servers, async (server, i) => {

    await request({url:server[0], time : true}, function (error, response, body) {
      var json = JSON.parse(fs.readFileSync("./public/"+server[1] + '_time.json'))
      var json2 = JSON.parse(fs.readFileSync("./public/"+server[1] + '_up.json'))
      
      if (server[2]) {
        if (server[2](error, response, body)) {
          if (response.elapsedTime >= 5000){
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

        } else {
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
      } else {
        if (!error && !body.includes("Error")) {
          if (response.elapsedTime >= 5000){
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
        } else {
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
