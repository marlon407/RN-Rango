import { View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Linking } from 'react-native';
import React, { Component } from 'react';
import {Actions} from "react-native-router-flux";
import store from 'react-native-simple-store';
import base64 from 'base-64';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';

var REQUEST_URL = 'https://salty-escarpment-46306.herokuapp.com/api/categories';
const STORAGE_KEY = 'id_token';

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
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
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

class CategoryDetail extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			loaded: false,
		};
	}

	componentDidMount() {
    this.fetchData(this.props.category.id);
	}

  componentWillReceiveProps(nextProps){
    this.setState({
      dataSource: [],
      loaded: true,
    });
    this.fetchData(this.props.category.id);
  }

	  fetchData(id) {
      store.get(STORAGE_KEY).then((token) => {
        let headers = new Headers();
        headers.append("Authorization", "Basic " + base64.encode(token+":x"));
        headers.append("Content-Type", "application/json");
  	    fetch(REQUEST_URL+'/'+id, {
          method: "GET",
          headers: headers
        })
  	      .then((response) => response.json())
  	      .then((responseData) => {
  	        this.setState({
  	          dataSource: this.setImage(responseData.pages),
              category: responseData.category,
  	          loaded: true,
  	        });
  	      })
  	      .done();
        });
	  }

	setImage(data){
		data.map(d => Object.assign(d, {
			image: {uri: 'http://facebook.github.io/react/img/logo_og.png'}
		}));
		return data;
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

	renderLoadingView() {
	    return (
	      <View style={styles.container}>
	        <Text>
	          Loading categories...
	        </Text>
	      </View>
	    );
	  }

	render() {
		if (!this.state.loaded) {
	      return this.renderLoadingView();
	    }
		const generateItem = (i) => (
			<View style={styles.cell} key={i.key}>
				<TouchableHighlight onPress={()=> this._onSelectItem(i.url)}>
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
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="Create Page" onPress={() => Actions.pagesCreate({category:this.state.category})}>
            <Icon name="create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
        </View>
		);
	}
}
export default CategoryDetail;
