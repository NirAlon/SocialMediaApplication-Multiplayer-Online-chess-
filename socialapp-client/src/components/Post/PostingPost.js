import React, { Component,Fragment } from 'react'
import {postPost,clearErrors,uploadImage} from '../../redux/actions/dataActions'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
// Redux stuff
import { connect } from 'react-redux';
// MUI Stuff
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress'
import Switch from '@material-ui/core/Switch';


// Icons


const styles={

    submitButton:{
        possition: 'relative',
        float: 'right',
        marginTop: 10
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '6%'
    }
}

class PostingPost extends Component {
    state = {
        open: false,
        body: '',
        errors: {},
        imageUrl:'',
        pub: true
    }




    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            })
        }
        if(nextProps.data.imageUrl){
            this.setState({imageUrl:nextProps.data.imageUrl})
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({body: ' ',open: false, errors:{}})
        }
    }
    handleOpen = () => {
        this.setState({open: true})
    }
    handleClose = () => {
        this.props.clearErrors()
        this.setState({open: false, errors:{}})
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }
    handleChangeSwitch = (event) => {
        this.setState({[event.target.name]: event.target.checked})
    }
    handleSubmit = (event) =>{
        event.preventDefault()
        console.log(this.state)
        this.props.postPost({body: this.state.body ,postImage: this.state.imageUrl, pub: this.state.pub})
    }
    handleImageChange = (event) =>{
        let image = event.target.files[0]
        const formData = new FormData()
        formData.append('image', image, image.name)
        this.props.uploadImage(formData)
    }
    handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput')
        fileInput.click()
    }
    render(){
        const {errors} = this.state
        const {classes, UI: {loading}} = this.props
        return (
            <Fragment>
                <MyButton onClick={this.handleOpen} tip="Post something">
                    <AddIcon></AddIcon>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.state.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon/>
                    </MyButton>
                    <DialogTitle>Post something</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                           <TextField name="body" type="text" lable="Post" multiline rows="3" placeholder="Post something" error={errors.body ? true : false}
                           helperText={errors.body} className={classes.TextField} onChange={this.handleChange} fullWidth/>
                           <input
                type="file"
                id="imageInput"
                hidden="hidden"
                onChange={this.handleImageChange}
              />
              <MyButton
                tip="Upload image to your post"
                onClick={this.handleEditPicture}
                btnClassName="button"
              >
                <AddIcon color="primary" />
                
              </MyButton>

              <MyButton
                tip="Public?"
                btnClassName="button">
              <Switch
               lable="Public/Private" checked={this.state.pub} onChange={this.handleChangeSwitch} name="pub" inputProps={{ 'aria-label': 'primary checkbox' }}>
                   Private?</Switch></MyButton>
                           <Button type="submit" variant="contained" color="primary" className={classes.submitButton} disabled={loading}>
                               Submit {loading && (
                               <CircularProgress size={30} className={classes.progressSpinner}/>)}
                           </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostingPost.propTypes = {
    postPost: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,

}
const mapStateToProps = (state) =>({
    UI: state.UI,
    data: state.data
})
export default connect(mapStateToProps, {postPost,clearErrors,uploadImage})(withStyles(styles)(PostingPost))

