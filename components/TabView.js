import React from 'react';
import {PropTypes} from "react";
import {StyleSheet, Text, View} from "react-native";
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import store from 'react-native-simple-store';

const STORAGE_KEY = 'id_token';

const contextTypes = {
  drawer: React.PropTypes.object,
};

const propTypes = {
  name: PropTypes.string,
  sceneStyle: View.propTypes.style,
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#8E8E8E',
    marginTop: 13,
    color: '#8E8E8E',
  },
  user: {
    padding: 5,
    paddingLeft: 15,
    marginTop: 10,
    color: '#8E8E8E',
  },
  container:{
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    marginTop: 55,
    backgroundColor: '#fff',
  }
});

const TabView = (props, context) => {
  const drawer = context.drawer;

  return (
      <View style={styles.container}>
        <Button style={styles.row} onPress={() => { drawer.close(); Actions.categories(); }}>Categories</Button>
        <Button style={styles.row} onPress={() => { drawer.close(); Actions.pages(); }}>Pages</Button>
        <Button style={styles.row} onPress={() => {
          store.delete(STORAGE_KEY).then(() => {
            Actions.login();
          })
         }}>Logout</Button>
      </View>
  );
};

TabView.contextTypes = contextTypes;
TabView.propTypes = propTypes;

export default TabView;
