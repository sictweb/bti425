const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

let mongoDBConnectionString = "Enter your MongoDB Connection String Here";

let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: {
    type: String,
    unique: true
  },
  password: String,
  fullName: String,
  role: String
});

let User;

module.exports.connect = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString, {useNewUrlParser: true});

        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });

        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser =  function (userData) {
    return new Promise(function (resolve, reject) {

        if (userData.password != userData.password2) {
            reject("Passwords do not match");
        } else {

            bcrypt.hash(userData.password, 10).then(hash=>{ // Hash the password using a Salt that was generated using 10 rounds
                
                userData.password = hash;

                let newUser = new User(userData);

                newUser.save((err) => {
                    if (err) {
                        if (err.code == 11000) {
                            reject("User Name already taken");
                        } else {
                            reject("There was an error creating the user: " + err);
                        }

                    } else {
                        resolve("User " + userData.userName + " successfully registered");
                    }
                });
            })
            .catch(err=>reject(err));
        }
    });      
};

module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {

        User.find({ userName: userData.userName })
        .limit(1)
        .exec()
        .then((users) => {

            if (users.length == 0) {
                reject("Unable to find user " + userData.userName);
            } else {
                bcrypt.compare(userData.password, users[0].password).then((res) => {
                    if (res === true) {
                        resolve(users[0]);
                    } else {
                        reject("Incorrect password for user " + userData.userName);
                    }
                });
            }
        }).catch((err) => {
            reject("Unable to find user " + userData.userName);
        });
    });
};