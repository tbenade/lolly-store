var request = require('request')
  , FeedParser = require('feedparser'),
  AWS = require('aws-sdk'),
  uuid = require('node-uuid');

AWS.config.region = 'ap-southeast-2';
var db = new AWS.DynamoDB();
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
  var itemData = {"id":{"S":profile.id}, "document":{"M":JSON.stringify({dog:"cat"})}}
  var itemParams = {TableName:"profile",Item:itemData};
  db.putItem(itemParams, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
};

addProfile({id:uuid.v1()},function(){
  console.log("All done!!");
});


