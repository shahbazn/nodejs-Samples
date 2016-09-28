var http = require("http"),
https = require("https"),
express = require("express"),
cheerio = require("cheerio"),
app = express();


app.get('/I/want/title/', function (req, res) {
  var addresses = req.query.address;
  var arr = [], html ='',count = 0;

  if(!Array.isArray(addresses)){
      addresses = [addresses];
  }

  addresses.forEach(function(address){
        addr_arr = address.split('/');
        var opts = {
        host: addr_arr[0],
        path: '/' + addr_arr.slice(1).join('/')
      };
      https.get(opts, function(resp){
          var data ="";
        resp.on("data", function(body){
          data += body;
        });
        resp.on("end", function(){
          count++;
          var $ = cheerio.load(data);
          var title = $("title").text();
          var temp = '<li>' + opts["host"] + " - " + title + '</li>';
          arr.push(temp);
          html = "<html><head></head><body><h1> Following are the titles of given websites: </h1> <ul>" + arr.join("") + "</ul></body></html>";
          if(count === addresses.length){
            res.send(html);
          }
        }).end();
      }).on("error", function(err){
          resp.send(err)
            count++
            html = "<li>" + opts["host"] +  " - NO RESPONSE " + "</li>"
            arr.push(html);
          });
  });
});

app.get('*', function(req, res){
  res.status(404).send('<html><head></head><body><h1>Page Not Found </he></body></html>');
});

app.listen(8080, function () {
  console.log('Example app listening on port 3000!');
});
