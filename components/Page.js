import { View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Linking } from 'react-native';
import React, { Component } from 'react';
import {Actions} from "react-native-router-flux";
import store from 'react-native-simple-store';
import ActionButton from 'react-native-action-button';
import base64 from 'base-64';
import Icon from 'react-native-vector-icons/MaterialIcons';

var REQUEST_URL = 'https://salty-escarpment-46306.herokuapp.com/api/pages';
const STORAGE_KEY = 'id_token';

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
    marginBottom: 3,
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 60,
    marginRight: 10,
    width: 60,
  },
  cell: {
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

class Page extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			loaded: false,
		};
	}

  componentDidMount() {
    this.fetchData();
	}

  componentWillReceiveProps(nextProps){
    this.setState({
      dataSource: [],
      loaded: true,
    });
    this.fetchData();
  }

	  fetchData() {
      store.get(STORAGE_KEY).then((token) => {
        let headers = new Headers();
        headers.append("Authorization", "Basic " + base64.encode(token+":x"));
        headers.append("Content-Type", "application/json");
  	    fetch(REQUEST_URL,{
          method: "GET",
          headers: headers
        }).then((response) => response.json())
  	      .then((responseData) => {
  	        this.setState({
  	          dataSource: this.setImage(responseData.json_list),
  	          loaded: true,
  	        });
  	      })
  	      .done();
        })
	  }

	setImage(data){
		data.map(d => Object.assign(d, {
			image: {uri: 'http://facebook.github.io/react/img/logo_og.png'}
		}));
		return data;
	}

	renderLoadingView() {
	    return (
	      <View style={styles.container}>
	        <Text>
	          Loading pages...
	        </Text>
	      </View>
	    );
	  }

    _onSelectItem(url){
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          alert('Don\'t know how to open URI: ' + url);
        }
      });
    }

	render() {
		if (!this.state.loaded) {
	      return this.renderLoadingView();
	    }
		const generateItem = (i) => (
      <View style={styles.cell} key={i.key}>
				<TouchableHighlight onPress={()=>this._onSelectItem(i.url)}>
					<View style={styles.row}>
						<Image source={i.image} style={styles.cellImage} />
						<View style={styles.textContainer}>
							<Text style={styles.title} numberOfLines={2}>
								{i.title}
							</Text>
							<Text numberOfLines={1}>
								{i.url}
							</Text>
						</View>
					</View>
				</TouchableHighlight>
			</View>
		);
		return (
      <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
        <ScrollView automaticallyAdjustContentInsets={false}>
  				{this.state.dataSource.map(generateItem)}
        </ScrollView>
      </View>
		);
	}
}
export default Page;
