import { View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import React, { Component } from 'react';
import {Actions} from "react-native-router-flux";
import store from 'react-native-simple-store';
import t from 'tcomb-form-native';
import base64 from 'base-64';
import Button from 'apsl-react-native-button'
var Form = t.form.Form;
var Page = t.struct({
  title: t.String,
  url: t.String,
  views: t.Number,
  category: t.Number
});
const REQUEST_URL = 'https://salty-escarpment-46306.herokuapp.com/api';
const STORAGE_KEY = 'id_token';

var styles = StyleSheet.create({
  buttonsView: {
    backgroundColor: '#009999', color:'white', borderRadius:3, margin:15, width:130
  }
});

class PageCreate extends Component {

  constructor(props){
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      store.get(STORAGE_KEY).then((token) => {
        let headers = new Headers();
        headers.append("Authorization", "Basic " + base64.encode(token+":x"));
        headers.append("Content-Type", "application/json");
        fetch(REQUEST_URL+"/pages", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(value)
        })
        .then((response) => {
          if(response.status > 400){
            return response;
          }
          return response.json()
        })
        .then((responseData) => {
          if(responseData.status > 400){
            alert(responseData.status);
          }else{
            Alert.alert('Nice','You created a new page! Good job',
            [
              {text: 'OK', onPress: () => {this.props.category ? Actions.categoryDetail({category:this.props.category}) : Actions.pages()}},
            ]
          )}
        })
        .done();
      })
    }
  }

	render() {
		return (
      <View style={{flex:1, backgroundColor: '#f3f3f3', padding:20}}>
        <Form
          ref="form"
          value={{category:this.props.category.id}}
          type={Page}/>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={Actions.categories} style={styles.buttonsView} textStyle={{fontSize: 18, color:'white'}}>
              Take me back
            </Button>
            <Button onPress={this.onPress} style={styles.buttonsView} textStyle={{fontSize: 18, color:'white'}}>
              Save
            </Button>
          </View>
      </View>
		);
	}
}
export default PageCreate;
