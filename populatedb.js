#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/inventory-app?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

var async =  require('async');
var Item =   require('./models/item');
var Category = require('./models/category');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];
var categories = [];

function itemCreate(name, description, category, price, count, cb) {
    itemdetail = {name: name, description: description, price: price, count: count}
 if (category != false) itemdetail.category = category;

 var item = new Item(itemdetail);
 item.save(function(err) {
     if (err) {
         cb(err, null)
         return
     }
     console.log('New Item: ' + item);
     items.push(item)
     cb(null, item)
 });
 }

 function categoryCreate(name, description, cb) {
     categorydetail = {name: name, description: description};

     var category = new Category(categorydetail);
     category.save(function(err) {
         if(err) {
             cb(err, null)
             return
         }
         console.log('New Category: ' + category);
         categories.push(category);
         cb(null, category);

     });
 }


function createCategories(cb){

    async.series([
        function(callback){
            categoryCreate('Tools', 'Items that assist with completing tasks.', callback);
        },
        function(callback){
            categoryCreate('Food', "It's food.", callback);
        },
        function(callback){
            categoryCreate('Entertainment', 'Leisure items that are used for recreational purposes', callback);
        },
        function(callback){
            categoryCreate('Furniture', 'Stuff you sit on.',callback);
        },
        function(callback){
            categoryCreate('Stationery', 'Office Supplies', callback);
        },
    ],
    cb);

}



function createItems(cb) {

    async.parallel([
        function(callback) {
            itemCreate('Hammer', "Good for pounding on stuff", [categories[0], ], 22.35 , 17 , callback);
        },
        function(callback) {
            itemCreate('Screwdriver', "For when you need to assemble a desk", [categories[0], ], 12.22 , 526 , callback);
        },
        function(callback) {
            itemCreate('Donuts', "mmmmmm", [categories[1], ], 1.25 , 730 , callback);
        },
        function(callback) {
            itemCreate('Pizza Slices', "Mama mia!", [categories[1], ], 1.50 , 300 , callback);
        },
        function(callback) {
            itemCreate('Flatscreen TV', "For when you're feeling extra lazy", [categories[2], ], 175 , 22 , callback);
        },
        function(callback) {
            itemCreate('Playstation 5', "It's funny that you think we actually have any of these", [categories[2], ], 450 , 0 , callback);
        },
        function(callback) {
            itemCreate('Desk', "For working", [categories[3], ], 200 , 17 , callback);
        },
        function(callback) {
            itemCreate('Office Chair', "Built with extra lumbar support", [categories[3], ], 138 , 6 , callback);
        },
        function(callback) {
            itemCreate('Tape', "A roll of Scotch tape for when Jerry inevitably accidentally rips up that important PTS report", [categories[4], ], 0.75 , 522 , callback);
        },
    ],
    cb);
}



async.series([
    createCategories,
    createItems
],

function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    } 
    else {
        console.log('Items: ' + items)
    }
    mongoose.connection.close();
});


