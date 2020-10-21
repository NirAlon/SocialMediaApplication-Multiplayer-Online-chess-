const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth')

const {getAllPosts,uploadPostImage, postOnePost,getPost,commentOnPost,likePost,unlikePost,deletePost} = require('./handlers/posts')
const {signup, login, uploadUserImage, addUserDetails, getAuthenticatedUser,showUsersList} = require('./handlers/users')

const { user } = require('firebase-functions/lib/providers/auth');



// https://us-central1-faceafeka-71da5.cloudfunctions.net/api/


// Psts Routs
app.get('/post', getAllPosts )



//post one post
app.post('/post', FBAuth, postOnePost);
app.get('/post/:postId', getPost);
app.post('/post/:postId/comment',FBAuth, commentOnPost)
app.get('/post/:postId/like',FBAuth, likePost)
app.get('/post/:postId/unlike',FBAuth, unlikePost)
app.delete('/post/:postId', FBAuth, deletePost)

// Signup Route

app.post('/signup', signup);
app.post('/user',FBAuth, addUserDetails);
app.get('/user',FBAuth,getAuthenticatedUser)
app.get('/users',FBAuth,showUsersList)



app.post('/login', login);

app.post('/user/image',FBAuth,uploadUserImage)
app.post('/post/image',FBAuth,uploadPostImage)

exports.api = functions.https.onRequest(app);