var dummyjson = require('dummy-json');
var fs = require('fs');
var faker = require('faker');
var request = require('request');
var uuid = require('node-uuid');

function generateAddProfileRequest(){
  var template = fs.readFileSync('data-templates/profile-add.hbs', {encoding: 'utf8'});
  var result = dummyjson.parse(template, {helpers:getTemplateHelpers()});
  return result;
}

function getTemplateHelpers(){
  var helpers = {
    jobTitle: function(options) {
                return "Chief " + faker.hacker.noun() + " installer";
              },
    organisation: function(options){
                    return faker.company.companyName();
                  },
    firstName: function(options){return faker.name.firstName();},
    lastName: function(options){return faker.name.lastName();},
    number: function(options){return faker.random.number({min:19,max:75}) },
    email: function(options){return faker.internet.email()},
    guid: function(options){return uuid.v1()
     }
  };
  return helpers;
}

function createAddProfileEvent(callback){
    request.post(
    {
      url:'http://192.168.59.103:2113/streams/profile', 
      body:generateAddProfileRequest(),
      headers:{
        "Content-Type":"application/json", 
        "ES-EventType": "ProfileAdded",
        "ES-EventId":uuid.v1()
      }
    }
    , function(err, response, body) {
        //console.log(body);
        //console.log(response);
        if (err) {
          return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', response.statusCode);
        callback();
      });
}

function createAddProfileEvents(numberOfEvents, callback){
  var created = 0;
  for(var i=0;i<numberOfEvents;i++){
    process.nextTick(function() {
      createAddProfileEvent(function(){
        created = created + 1;
        if(created == numberOfEvents){
          callback();
        }
      });
    })
  };
}


console.time('events');
createAddProfileEvents(10,function(){
  console.log('Completed event creation')
  console.timeEnd('events');
});

