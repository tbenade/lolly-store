var request = require('request')
  , FeedParser = require('feedparser'),
  AWS = require('aws-sdk'),
  uuid = require('node-uuid'),
  DOC = require("dynamodb-doc");

AWS.config.region = 'ap-southeast-2';
var db = new AWS.DynamoDB();
docClient = new DOC.DynamoDB(db);

var tableParams = {
  TableName: 'profile',
  ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
  },
  KeySchema: [
      {AttributeName: 'id', KeyType: 'HASH'}
  ],
  AttributeDefinitions: [
      {AttributeName: 'id', AttributeType: 'S'},
  ]
}

function addProfile(profile, callback){
  var itemData = {id:profile.id, name:"Terrence Benade",phone:232323, address:"21 hell drive", kids:{kidone:"Emily", kidtwo:"Hannah"}};
  var itemParams = {TableName:"profile",Item:itemData};
  docClient.putItem(itemParams, pfunc);
}

var pfunc = function(err, data) { 
    if (err) {
        console.log(err, err.stack);
    } else {
        console.log(data);
    }
}

addProfile({id:uuid.v1()},function(){
  console.log("All done!!");
});


