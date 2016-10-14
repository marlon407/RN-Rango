import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Alert, } from "react-native";
import Button from "react-native-button";
import base64 from 'base-64';
import t from 'tcomb-form-native';
import {Actions} from "react-native-router-flux";
import store from 'react-native-simple-store';
var Form = t.form.Form;
console.ignoredYellowBox = true;
var Person = t.struct({
  username: t.String,
  password: t.String
});

const options = {};
const REQUEST_URL = 'https://salty-escarpment-46306.herokuapp.com/api';
const STORAGE_KEY = 'id_token';

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    //backgroundColor: '',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30,
    color: '#009999',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
    fontSize: 18,
    color:'white'
  },
  button: {
    backgroundColor: '#009999', color:'white', borderRadius:3, margin:15, width:130, padding:20
  }
});

export default class extends React.Component {
    constructor(props){
      super(props);
      this._userLogin = this._userLogin.bind(this);
      this._userSignup = this._userSignup.bind(this);
    }

    _userLogin() {
      var value = this.refs.form.getValue();
      if (value) { // if validation fails, value will be null
        var headers = new Headers();
  	    headers.append("Authorization", "Basic " + base64.encode(value.username+":"+value.password));
        fetch(REQUEST_URL+"/token", {
          method: "GET",
          headers: headers
        })
        .then((response) => {
          if(response.status > 400)
              return response
          return response.json()
        })
        .then((responseData) => {
          if(responseData.status > 400){
            alert("user or password does not match")
          }
          else store.save(STORAGE_KEY, responseData.token).then(() => Actions.tabbar())
        })
        .done();
      }
    }

    _userSignup() {
      var value = this.refs.form.getValue();
      if (value) { // if validation fails, value will be null
        var headers = new Headers();
  	    headers.append("Content-Type", "application/json");
        fetch(REQUEST_URL+"/users", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({username:value.username, password:value.password})
        })
        .then((response) => {
          console.log(response);
          if(response.status >= 400)
              return response
          return response.json()
        })
        .then((responseData) => {
          if(responseData.status > 400){
            alert(responseData.status+ "  err")
          }
          else alert("User registred! Click on 'Let me in' to explore the app");
        })
        .done();
      }
    }

    render(){
        return (
          <View style={styles.container}>
            <View style={styles.row}>
              <Text style={styles.title}>Signup/Login below!</Text>
            </View>
            <View style={styles.row}>
              <Form
                ref="form"
                type={Person}
                options={options}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableHighlight style={styles.button} onPress={this._userSignup} underlayColor='#99d9f4'>
                <Text style={styles.buttonText}>Signup</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.button} onPress={this._userLogin} underlayColor='#99d9f4'>
                <Text style={styles.buttonText}>Let Me In</Text>
              </TouchableHighlight>
            </View>
          </View>
        );
    }
}
