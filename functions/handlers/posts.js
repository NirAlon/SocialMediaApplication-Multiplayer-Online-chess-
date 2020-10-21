const {db, admin} = require('../util/admin')
const config = require('../util/config');

exports.getAllPosts = (req, res) => {
    db
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
        let posts = [];
        data.forEach((doc) => {
            posts.push({
                postId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
                commentCount: doc.data().commentCount,
                likeCount: doc.data().likeCount,
                postImage: doc.data().postImage,
                pub: doc.data().pub
            });
        });
        return res.json(posts);
    })
    .catch((err) => console.error(err))
}


exports.postOnePost =  (req, res) => {
    if (req.body.body.trim() === ''){
        return res.status(400).json({body: `Body must not be empty`})
    }

   const newPost = {
       body: req.body.body,
       userHandle: req.user.handle,
       createdAt: new Date().toISOString(),
       postImage: req.body.postImage,
       pub: req.body.pub,
       likeCount: 0,
       commentCount: 0
   };

   db
   .collection('posts')
   .add(newPost)
   .then(doc => {
       const resPost = newPost
       resPost.postId = doc.id;
       res.json({resPost})
   })
   .catch((err)=>{
       res.status(500).json({error: 'something went wrong'})
       console.error(err);
   });
}

exports.getPost = (req, res) =>{
    let postData = {}
    db.doc(`/posts/${req.params.postId}`).get()
    .then(doc =>{
        if(!doc.exists){
            return res.status(404).json({error: 'Post not found'})
        }
        postData = doc.data()
        postData.postId = doc.id
        return db.collection('comments').orderBy('createdAt','desc').where('postId', '==', req.params.postId).get()
    })
    .then(data =>{
            postData.comments = []
            data.forEach(doc => {
                postData.comments.push(doc.data())
            })
        return res.json(postData)
    })
    .catch(err =>{
        console.error(err);
        res.status(500).json({error: err.code})
    })
}

exports.commentOnPost = (req, res) =>{
    if (req.body.body.trim() === '') {
        return res.status(400).json({ comment: 'Body must not be empty' });}

        const newComment = {
            body: req.body.body,
            createdAt: new Date().toISOString(),
            postId: req.params.postId,
            userHandle: req.user.handle,
          };
        
         db.doc(`/posts/${req.params.postId}`).get()
         .then(doc =>{
             if(!doc.exists){
                 return res.status(404).json({error: 'Post not found'})
             }
             return doc.ref.update({commentCount: doc.data().commentCount + 1})
         })
         .then(()=>{
            return db.collection('comments').add(newComment)
         })
         .then(()=>{
             res.json(newComment)
         })
            .catch((err) => {
                console.log(err)
              res.status(500).json({ error: 'something went wrong' });
            });
}

exports.likePost = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('postId', '==', req.params.postId).limit(1)

    const postDocument = db.doc(`/posts/${req.params.postId}`)

    let postData
    
    postDocument.get()
    .then(doc =>{
        if(doc.exists){
            postData = doc.data()
            postData.postId = doc.id
            return likeDocument.get()
        }else{
            return res.status(404).json({error: 'Post not found'})
        }
    })
    .then(data =>{
        if(data.empty){
            return db.collection('likes').add({
                postId: req.params.postId,
                userHandle: req.user.handle
            })
            .then(()=>{
                postData.likeCount++
                return postDocument.update({likeCount: postData.likeCount})
            })
            .then(()=>{
                return res.json(postData)
            })
        }else{
            return res.status(400).json({error: 'Post already liked'})
        }
    })
    .catch(err=>{
        console.error(err)
        res.status(500).json({error: err.code})
    })
}

exports.unlikePost = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('postId', '==', req.params.postId).limit(1)

    const postDocument = db.doc(`/posts/${req.params.postId}`)

    let postData
    
    postDocument.get()
    .then(doc =>{
        if(doc.exists){
            postData = doc.data()
            postData.postId = doc.id
            return likeDocument.get()
        }else{
            return res.status(404).json({error: 'Post not found'})
        }
    })
    .then(data =>{
        if(data.empty){
            return res.status(400).json({error: 'Post not liked'})

            }else{
                return db.doc(`/likes/${data.docs[0].id}`).delete()
                .then(()=>{
                    postData.likeCount--
                    return postDocument.update({likeCount: postData.likeCount})
                })
                .then(()=>{
                    return res.json(postData)
                })
        }
    })
    .catch(err=>{
        console.error(err)
        res.status(500).json({error: err.code})
    }) 
}

exports.deletePost = (req, res) => {
    const document = db.doc(`/posts/${req.params.postId}`)
    document.get()
    .then(doc=>{
        if(!doc.exists){
            return res.status(404).json({error: 'Post not found'})
        }
        if(doc.data().userHandle !== req.user.handle){
            return res.status(403).json({error: 'Unauthorized'})
        }else{
            return document.delete()
        }
    })
    .then(()=>{
        res.json({message: 'Post deleted successfully'})
    })
    .catch(err =>{
        console.error(err)
        return res.status(500).json({error: err.code})
    })
}

exports.uploadPostImage = (req, res) => {
    
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
          return imageUrl
        })
        .then(() => {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
          return res.json({ message: imageUrl });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: "something went wrong" });
        });
    });
    busboy.end(req.rawBody);
  };
