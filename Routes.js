import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Login from './components/Login';

import Category from './components/category/Category';
import CategoryCreate from './components/category/CategoryCreate';
import CategoryDetail from './components/category/CategoryDetail'
import Page from './components/Page';
import PageCreate from './components/PageCreate'

import {
  Scene,
  Reducer,
  Router,
  Switch,
  Modal,
  Actions,
  ActionConst,
} from 'react-native-router-flux';

import TabView from './components/TabView';
import TabIcon from './components/TabIcon';
import NavigationDrawer from './components/NavigationDrawer';
import Button from 'react-native-button';

console.disableYellowBox = true
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    backgroundColor: '#009999',
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#ddd',
  },
  backButtonImage: {
    width: 20,
    height: 21,
  },
});

const reducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    console.log('ACTION:', action);
    return defaultReducer(state, action);
  };
};

// define this based on the styles/dimensions you use
const getSceneStyle = (/* NavigationSceneRendererProps */ props, computedProps) => {
  const style = {
    flex: 1,
    backgroundColor: '#f3f3f3',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
  };
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64;
    style.marginBottom = computedProps.hideTabBar ? 0 : 50;
  }
  return style;
};


class Routes extends Component {
  render() {
    return (
      <Router createReducer={reducerCreate} getSceneStyle={getSceneStyle}>
        <Scene key="modal" component={Modal} >
          <Scene key="root" hideTabBar>
            <Scene key="login" initial hideNavBar component={Login} />
            <Scene
              navigationBarStyle={styles.tabBarStyle}
              key="categoriesCreate"
              component={CategoryCreate}
              hideNavBar={false}
              duration={1}
              leftButtonIconStyle={styles.backButtonImage}
              title="New Category"
              titleStyle={{ color: 'white' }}
              hideTabBar/>
            <Scene
              navigationBarStyle={styles.tabBarStyle}
              key="categoryDetail"
              component={CategoryDetail}
              title="Category Detail"
              leftButtonIconStyle={styles.backButtonImage}
              titleStyle={{ color: 'white' }}
              hideNavBar={false}
              duration={1}
              hideTabBar/>
            <Scene
              key="pagesCreate"
              navigationBarStyle={styles.tabBarStyle}
              component={PageCreate}
              title="New Page"
              leftButtonIconStyle={styles.backButtonImage}
              titleStyle={{ color: 'white' }}
              hideNavBar={false}
              duration={1}
              hideTabBar/>
            <Scene key="tabbar" component={NavigationDrawer}>
              <Scene
                key="main"
                tabs
                tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}>
                  <Scene
                    navigationBarStyle={styles.tabBarStyle}
                    key="categories"
                    type={ActionConst.REPLACE}
                    component={Category}
                    title="Categories"
                    titleStyle={{ color: 'white' }}
                    onRight={() => alert('Right button')}
                    rightTitle="Right"
                    rightButtonTextStyle={{color:"white"}}
                    hideTabBar/>

                  <Scene
                    key="pages"
                    navigationBarStyle={styles.tabBarStyle}
                    component={Page}
                    title="Pages"
                    titleStyle={{ color: 'white' }}
                    rightButtonTextStyle={{color:"white"}}
                    onRight={() => alert('Right button')}
                    rightTitle="Right"
                    hideTabBar/>

              </Scene>
            </Scene>
          </Scene>
        </Scene>
      </Router>
    );
  }
}

export default Routes;
