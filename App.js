import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerItems} from "react-navigation-drawer";
import { Avatar } from 'react-native-paper';
import {Dimensions} from 'react-native';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  ScrollView, 
  Text,
  Alert,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';
import Home from './components/Home'
import SplashScreen from './components/SplashScreen'
import MyPosts from './components/MyPosts'
import Feed from './components/Feed'
import Login1 from './components/Login1'
import Login2 from './components/Login2'


const AppNavigator = createStackNavigator({
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: {
        header: null
      }
    },
    Home: {
      screen: Home,
      navigationOptions: {
        title : null,
      }
    },
    MyPosts : {
      screen: MyPosts,
    },
    Feed : {
      screen: Feed,
      navigationOptions: {
        title : null,
      }
    },
    Login1 : {
      screen: Login1,
      navigationOptions: {
        header: null
      }
    },
    Login2 : {
      screen : Login2
    }
  },{
    initialRouteName : "SplashScreen",
  }
);





// const MyApp = createAppContainer(MyDrawerNavigator);
// console.disableYellowBox = true;
const MyApp = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <MyApp />;
  }
}