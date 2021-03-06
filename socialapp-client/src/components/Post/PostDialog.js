import React, { Component,Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
import dayjs from 'dayjs'
import {Link} from 'react-router-dom'

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import LikeButton from './LikeButton'
import Comments from './Comments'
import ChatIcon from '@material-ui/icons/Chat'
import CommentForm from './CommentForm'

import CloseIcon from '@material-ui/icons/Close'
import UnfoldMore from '@material-ui/icons/UnfoldMore'


import { connect } from 'react-redux';

import {getPost,clearErrors} from '../../redux/actions/dataActions'

const styles=({
    invisibleSeparator: {
        border: 'none',
        margin: 4
    },
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    dialogContent:{
        paddibg: 20
    },
    closeButton: {
        position: 'absolute',
        left: "90%"
    },
    expandButton: {
        position: 'absolute',
        left: "90%"
    }
})

class PostDialog extends Component{
    state = {
        open: false
    }
    handleOpen = () => {
        this.setState({open: true})
        this.props.getPost(this.props.postId)
    }
    handleClose = () => {
        this.setState({open: false})
        this.props.clearErrors()
    }
    render(){
        const {classes, post:{postId,body,createdAt,likeCount,commentCount, postImage, userHandle,comments}
        ,UI: {loading}
    }= this.props
    const dialogMarkup = loading ? (
        <CircularProgress size={200}/>) : (<Grid container spacing={16}>
            <Grid item sm={5}>
                <img src={postImage} alt="Profile" className={classes.profileImage}/>
            </Grid>
            <Grid item sm={7}>
                <Typography component={Link} color="primary" varient="h5" to={`/users/${userHandle}`}>
                    @{userHandle}
                </Typography>
                <hr className={classes.invisibleSeparator}/>
                <Typography varient="body2" color="textSecondary">
                    {dayjs(createdAt).format('h:mm a, MMM DD YYYY')}
                </Typography>
                <hr className={classes.invisibleSeparator}/>
                <Typography varient="body1">
                    {body}
                </Typography>
                <LikeButton postId={postId}/>
                <span>{likeCount}likes</span>
                <MyButton tip='comments'>
            <ChatIcon color='primary'/>
        </MyButton>
        <span>{commentCount} comments</span>
            </Grid>
            <hr className={classes.invisibleSeparator}/>
            <CommentForm postId={postId}/>
            <Comments comments={comments}/>
        </Grid>)

    
    return (
        <Fragment>
            <MyButton onClick={this.handleOpen} tip="Expand Post" tipClassName={classes.expandButton}>
                <UnfoldMore color='primary'/>
            </MyButton>
            <Dialog open={this.state.open} onClose={this.state.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                    </Dialog>
            </Fragment>

    )
} 

}

PostDialog.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    getPost: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,

}

const mapStateToProps = state => ({
    post: state.data.post,
    UI: state.UI
})

const mapActionsToProps = {
    getPost,
    clearErrors
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PostDialog))
