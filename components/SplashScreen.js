import React from "react";
import {
    StyleSheet,
    Text,
    Font,
    TouchableOpacity,
    Image,
    navigation,
    View,
  
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';

import bg from '../bg.png'

export default class SplashScreen extends React.Component
{
  componentDidMount() {
    setTimeout(()=>{
        const navigateAction =  StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Login1'})]
        });
        this.props.navigation.dispatch(navigateAction)
    },2000)
  }
  render() 
  {
    return (
      <View style={{flex:1, height:'100%',width:'100%',backgroundColor:'#0e4d92',justifyContent:'center',aligntItems:'center'}}>
      <Image source={bg} style={{height:170,width:300,alignSelf:'center'}}/>
      </View>
      )
  }
}