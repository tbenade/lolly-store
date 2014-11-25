var request = require('request')
  , FeedParser = require('feedparser'),
  AWS = require('aws-sdk');

AWS.config.region = 'ap-southeast-2';
var db = new AWS.DynamoDB();
var tableParams = {
    TableName: 'new_table',
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    KeySchema: [
        {AttributeName: 'primary_key', KeyType: 'HASH'}
    ],
    AttributeDefinitions: [
        {AttributeName: 'primary_key', AttributeType: 'S'},
    ]
}

//db.createTable(tableParams, function(err, data) {
//  if (err) console.log(err, err.stack); // an error occurred
//  else     console.log(data);           // successful response
//});

//db.listTables(function(err, data) {
//  console.log(data.TableNames);
//});

function fetch(feed, callback){
  var req = request(feed, {timeout:10000, pool: false});
  var parser = new FeedParser();
  
  //define req handlers
  req.on('error',function(error){
    return console.error(error);
    })
  .on('response', function(response){
    if(response.statusCode != 200) return console.error((new Error('Bad status code ' + response.statusCode)));
    response.pipe(parser);
    });
  
  //define parser handlers
  parser.on('error', function(error){
    })
  .on('readable',function(){
    var stream = this,
        meta = this.meta,
        item;

    while (item = stream.read()) {
      var itemData = {"primary_key":{"S":item.guid}}
      var itemParams = {TableName:"new_table",Item:itemData};
      db.putItem(itemParams, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
      console.log(item.guid);
      }
    })
  .on('end',function(){
    });  
}

fetch('http://192.168.59.103:2113/streams/newstream');


