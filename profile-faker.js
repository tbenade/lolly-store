var dummyjson = require('dummy-json');
var fs = require('fs');

// var template = '{ "name": {{firstName}}, "age": {{number 18 65}} }';

function generateProfileAddRequest(){
  var template = fs.readFileSync('data-templates/profile-add.hbs', {encoding: 'utf8'});
  var result = dummyjson.parse(template);
  return result;
  }

console.log(generateProfileAddRequest());
