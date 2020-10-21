import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import Post from '../components/Post/Post'
import Profile from '../components/Profile/Profile'
import PropTypes from 'prop-types'


import {connect} from 'react-redux'
import {getPosts} from '../redux/actions/dataActions'

class home extends Component {


    componentDidMount(){
        this.props.getPosts()
    }
    render() {
        const {posts, loading} = this.props.data
        let recentPostMarkUp = !loading ? (
        posts.map((post) => <Post key={post.postId} post={post}/>)
        ) : <p>Loading....</p>
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                  {recentPostMarkUp}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile/>
                </Grid>
            </Grid>
        )
    }
}
home.propTypes = {
    getPosts:PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    data: state.data
})

export default connect(mapStateToProps,{getPosts})(home)
