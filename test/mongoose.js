
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var kittySchema = mongoose.Schema({
    name: String
  });

kittySchema.statics.findss = function(){
    this.model('Kitten').find({},function (err, kittens) {
        if (err) return console.error(err);
        console.log(kittens);
      })
}
kittySchema.statics.findByName = function(){
  this.model('Kitten').find({name:"Felynes"},function(err, kittens){
    if (err) return console.error(err);
    console.log(kittens);
  })
}
kittySchema.statics.insert = function(names){
  this.model('Kitten').create({name: names},function(err,kittens){
    if (err) return console.error(err);
     console.log(kittens);
  })
}
  var Kitten = mongoose.model('Kitten', kittySchema);

  /*
  var felyne = new Kitten({ name: 'Felynes' });
  felyne.save(function (err, Kitten) {
    if (err) return console.error(err);
    console.log("插入成功！")
  });
*/
/*
  Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
  })
*/
Kitten.findss()
//Kitten.insert("ouzilin")
//Kitten.findByName()