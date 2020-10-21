import React from 'react'
import { Route } from 'react-router-dom'
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
class chessgame extends React.Component {
  state = {
    redirect: false
  }
  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return   <Route exact path="/" render={() => (window.location = "http://localhost/chessMult/index.php")} />

    }
  }
  render () {
    return (
       <div>
        {this.renderRedirect()}
        <VideogameAssetIcon onClick={this.setRedirect}>Redirect</VideogameAssetIcon>
       </div>
    )
  }
}

export default chessgame