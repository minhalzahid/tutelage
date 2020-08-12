const mongoose = require('mongoose');
// var firebase = require('firebase');
// require('firebase/auth');
// require('firebase/database');


// var config = {
//     apiKey: "AIzaSyAcm5RBag7_nxdPcXocQ9yy7NPVqBnVe4c",
//     authDomain: "tutelage-bcef8.firebaseapp.com",
//     databaseURL: "https://tutelage-bcef8.firebaseio.com",
//     projectId: "tutelage-bcef8",
//     storageBucket: "tutelage-bcef8.appspot.com",
//     messagingSenderId: "581404448839",
//     appId: "1:581404448839:web:2d92fd911347540b317962"
// };

// firebase.initializeApp(config);

module.exports = function () {
    const db = 'mongodb://minhal:qwertyuiop@cluster0-shard-00-00-ydra5.mongodb.net:27017,cluster0-shard-00-01-ydra5.mongodb.net:27017,cluster0-shard-00-02-ydra5.mongodb.net:27017/tutelage?replicaSet=Cluster0-shard-0&ssl=true&authSource=admin';
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log(`Connected to ${db}...`))
        .catch((err) => console.log('Not connected' + err));
};