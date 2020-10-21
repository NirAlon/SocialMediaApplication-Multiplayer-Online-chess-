const mysql = require('mysql')
const connection = mysql.createConnection({
    host : 'localhost',
    port: '3306',
    user: 'root',
    password: '123123',
    database: 'chessmult'
})

const {admin, db} = require('../util/admin')
const config = require('../util/config');


const firebase = require('firebase');
firebase.initializeApp(config)

const {validateSignupData, validateLoginData, reduceUserDetails} = require('../util/validators');

exports.signup = (req, res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };


    const {valid, errors} = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);

    const noImg = 'noface.jpg'

    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
    .then(doc =>{
        if(doc.exists){
            return res.status(400).json({ handle: 'this handle is already taken'})
        }
        else{

            return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken =>{
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            userId
        }
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(()=>{
        return res.status(201).json({token})
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).json({genral: 'Something happened please try again!'})
        
    });
}

exports.login = (req, res)=>{
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const {valid, errors} = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);

    mysqlLogIn(user.email)

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data =>{
        return data.user.getIdToken();
    })
    .then(token=> {
        return res.json({token})
    })
    .catch((err)=>{
        console.error(err);
        if(err.code === 'auth/wrong-password'){
            return res.status(403).json({general: 'Wrong credentials, please try again'})
        }else return res.status(500).json({error: err.code});
    });
}

//Add user details
exports.addUserDetails = (req, res) => {

    let userDetails = reduceUserDetails(req.body)
    
    db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(()=>{
        return res.json({message: 'Details added successfully'})
    })
    .catch(err =>{
        console.error(err)
        return res.status(500).json({error: err.code})
    })
}
/*
exports.showUsersList = (req, res) => {
    db
    .collection('users')
    .orderBy('handle', 'asc')
    .get()
    .then((data) => {
        let users = [];
        data.forEach((doc) => {
            users.push({
                user: doc.data().handle
            });
        });
        return res.json(users);
    })
    .catch((err) => console.error(err))
}
*/

function mysqlLogIn(param) {

    var userNameEnd = param.search("@")
    var username = param.substring(0, userNameEnd);
    console.log(username)
    connection.connect(err => {
        let sql = "UPDATE `users` SET `userauth` = '1' WHERE `users`.`UserName` = ?"
        connection.query(sql,username,(error, rows) => {
            console.log(rows)
        })        
    })
}
exports.showUsersList = (req, res) => {
    connection.connect(err => {
        connection.query("SELECT `UserName` FROM `users`",(error, rows) => {
            console.log(rows)
            if(!error) return res.json(rows);
            else 
        return res.json(error);
        })
        
        
    })
}


exports.getAuthenticatedUser = (req, res) =>{
    let userData = {}
    db.doc(`/users/${req.user.handle}`).get()
    .then(doc => {
        if(doc.exists){
            userData.credentials = doc.data()
            return db.collection('likes').where('userHandle','==', req.user.handle).get()
        }
    })
    .then(data =>{
        userData.likes = []
        data.forEach(data =>{
            userData.likes.push(doc.data())
        })
        return res.json(userData)
    })
    .catch((err)=>{
        console.error(err)
        return res.status(500).json({error: err.code})
    })
}


// Upload a profile image for user
exports.uploadUserImage = (req, res) => {
    
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");
  
    const busboy = new BusBoy({ headers: req.headers });
  
    let imageToBeUploaded = {};
    let imageFileName;
    // String for image token
    //let generatedToken = uuid();
  
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      //console.log(fieldname, file, filename, encoding, mimetype);
      if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        return res.status(400).json({ error: "Wrong file type submitted" });
      }
      // my.image.png => ['my', 'image', 'png']
      const imageExtension = filename.split(".")[filename.split(".").length - 1];
      // 32756238461724837.png
      imageFileName = `${Math.round(
        Math.random() * 1000000000000
      ).toString()}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on("finish", () => {
      admin
        .storage()
        .bucket()
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype,
              //Generate token to be appended to imageUrl
              //firebaseStorageDownloadTokens: generatedToken,
            },
          },
        })
        .then(() => {
          // Append token to url
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
          console.log(imageUrl)
          return imageUrl
        })
        .then(() => {
          return res.json({ message: "image uploaded successfully" });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: "something went wrong" });
        });
    });
    busboy.end(req.rawBody);
  };