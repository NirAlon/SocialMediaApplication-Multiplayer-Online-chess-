import React, { Component } from 'react'
import axios from 'axios'
import Autosuggest from 'react-autosuggest';

import './Search.css'




let userList = [];
let hasList=false // load user list boolean

const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : (inputValue !== '*' ? (userList.filter(lang =>
      lang.user.toLowerCase().slice(0, inputLength) === inputValue)) : (userList)
    );
  };

const getSuggestionValue = suggestion => suggestion.user;


const renderSuggestion = suggestion => (
    <div>
      {suggestion.user}
    </div>
  );
/*
const fatchSearchResults = () =>{
    hasList = true
    axios.get('/users')
    .then(res=>{
        
        res.data.forEach(user => {
            userList.push({user:user.user})
        });

    })
    .catch(error =>{
        if(axios.isCancel(error) || error){
            this.setState({loading: false, message: 'Failed to fatch data'})
        }
    })
    
}
*/
const fatchSearchResults = () =>{
  hasList = true
  axios.get('/users')
  .then(res=>{
      res.data.forEach(user => {
          
          userList.push({user:user.UserName})
      });

  })
  .catch(error =>{
      if(axios.isCancel(error) || error){
          this.setState({loading: false, message: 'Failed to fatch data'})
      }
  })
  
}




export class search extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: '',
            suggestions: [],
            loading: false,
            message: '',
        }
        this.cancel=''
    }

    onChange = (event, { newValue }) => {
        this.setState({
          value: newValue
        });
      };
      onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestions: getSuggestions(value)
        });
      };
      onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
      };


    render() {
        const { value, suggestions } = this.state;
        if(!hasList){
        fatchSearchResults()
        this.setState({hasList: true})
    }
        
        // Autosuggest will pass through all these props to the input.
        const inputProps = {
          placeholder: 'Search for users',
          value,
          onChange: this.onChange,
        };
    
        // Finally, render it!
        return (
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        );
      }
    }

export default search
