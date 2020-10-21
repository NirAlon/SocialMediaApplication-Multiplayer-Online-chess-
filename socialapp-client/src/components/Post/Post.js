import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Typography } from '@material-ui/core';
import dayjs from 'dayjs'
import PostDialog from './PostDialog'
import relativeTime from 'dayjs/plugin/relativeTime';
import MyButton from '../../util/MyButton';
import PropTypes from 'prop-types'

import ChatIcon from '@material-ui/icons/Chat'
import Gallery from 'react-grid-gallery';

import LikeButton from './LikeButton'
import {connect} from 'react-redux'
import DeletePost from './DeletePost'
const styles  = {
    card: {
        position: 'relative',
        dispaly: 'flex',
        marginBottom: 20,
    },
    image:{
        minWidth: 200,
    },
    content:{
        padding: 25,
        objectFit: 'cover'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9,
        marginTop:'30'
      }
}



 class Post extends Component {
    
    openWindow = (event) => {

        console.log(document.getElementById('img').value)
        window.open(event.target.value)
    }
    render() {
        
        dayjs.extend(relativeTime)
        const {classes, post : {body, postImage, userHandle,createdAt, postId, likeCount, commentCount, pub}
    ,user:{
        authenticated, credentials: {handle}}} = this.props
        
        let IMAGES = [{

            src: null,
            thumbnail: null,
            thumbnailWidth: null,
            thumbnailHeight: null,
            caption: null

        }]
        if(postImage !== null){
        IMAGES = [{

            src: postImage,
            thumbnail: postImage,
            thumbnailWidth: 320,
            thumbnailHeight: 174,
            caption: body

        }]
    }
        const deleteButton = authenticated && userHandle === handle ? (
            <DeletePost postId={postId}/>
        ): null
        const showPostImage = IMAGES[0].src[0] === 'h' ? (<Gallery  images={IMAGES} > </Gallery>) : null
        
        const showPublicPosts = pub ? ( 
        <Card className={classes.card}>
             
        <CardContent className={classes.content}>
        {showPostImage} 
        <Typography variant='h5' component={Link} to={`/users/${userHandle}`} color="primary">{userHandle}</Typography>
        {deleteButton}
        <Typography variant='body2' color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
        <Typography variant='body1'>{body}</Typography>
        <LikeButton postId={postId}/>
        <span>{likeCount}Likes</span>
        <MyButton tip='comments'>
            <ChatIcon color='primary'/>
        </MyButton>
        <span>{commentCount} comments</span>
        <PostDialog postId={postId} userHandle={userHandle}/>
                </CardContent>
                
            </Card>

        ): (userHandle === handle ? (<Card className={classes.card}>
             
        <CardContent className={classes.content}>
        {showPostImage} 
        <Typography variant='h5' component={Link} to={`/users/${userHandle}`} color="primary">{userHandle}</Typography>
        {deleteButton}
        <Typography variant='body2' color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
        <Typography variant='body1'>{body}</Typography>
        <LikeButton postId={postId}/>
        <span>{likeCount}Likes</span>
        <MyButton tip='comments'>
            <ChatIcon color='primary'/>
        </MyButton>
        <span>{commentCount} comments</span>
        <PostDialog postId={postId} userHandle={userHandle}/>
                </CardContent>
                
            </Card>) : null)
        
        
        return showPublicPosts
    }
}

Post.propTypes = {
    post: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };
  
  const mapStateToProps = (state) => ({
    user: state.user
  });


  
  export default connect(mapStateToProps)(withStyles(styles)(Post));
