import React from "react";
import {
    StyleSheet,
    Text,
    Font,
    TouchableOpacity,
    Image,
    navigation,
    View,
    TextInput,
    Alert, 
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as firebase from 'firebase';

import bg from '../bg.png'
import { onChange } from "react-native-reanimated";


export default class Login2 extends React.Component
{
  constructor(props){
      super(props);
      this.state = {
          username:"",
          password:""
      }
  }

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerLeft: (<TouchableOpacity onPress={() => navigation.goBack()}> 
                      <Icon name="arrow-back" size={32} color="#eedede" style={{marginLeft: 20}}/>
                  </TouchableOpacity>),
      headerStyle: {
        backgroundColor: '#0e4d92',
        height: 70
      }, 
      title: "Login as a Doctor",
      headerTitleStyle: {
        color:"#eedede",
        fontSize:20, 
        fontWeight:"bold"
      }
    }
    };

  render() 
  {
    return (
      <View style={{flex:1, flexDirection:"column", height:'100%',width:'100%',backgroundColor:'#0e4d92',aligntItems:'center'}}>
        <View style={{height:"15%"}}></View>
        <Image source={bg} style={{height:170,width:300,alignSelf:'center'}}/>
        <View style={{height:"3%"}}></View>
        <View style={{height:"10%"}}>
            <TextInput
                placeholder="Username"
                placeholderTextColor="grey"  
                underlineColorAndroid='transparent'
                keyboardType='default'
                style={{textAlign: 'center', width:"90%",  height: 60,  borderRadius: 10,  borderWidth: 2,  borderColor: '#0e4d92',  color: '#0e4d92', marginBottom: 10, alignSelf:"center", backgroundColor:"#eedede" }}
                onChangeText={(text)=>{this.setState({username:text})}}
            />
        </View>
        <View style={{height:"3%"}}></View>
        <View style={{height:"10%"}}>
            <TextInput
                placeholder="Password"
                placeholderTextColor="grey"  
                underlineColorAndroid='transparent'
                keyboardType='default'
                secureTextEntry={true}
                style={{textAlign: 'center', width:"90%",  height: 60,  borderRadius: 10,  borderWidth: 2,  borderColor: '#0e4d92',  color: '#0e4d92', marginBottom: 10, alignSelf:"center", backgroundColor:"#eedede" }}
                onChangeText={(text)=>{this.setState({password:text})}}
            />
        </View>
        <View style={{height:"3%"}}></View>
        <View style={{height:"5%", justifyContent:"center", alignItems:"center"}}>
            <TouchableOpacity style={{flex:1, backgroundColor:"#0e4d92", width:"20%", height:"100%", alignItems:"center", justifyContent:"center", elevation:10, shadowOpacity:0.3, borderRadius:5}} 
            onPress={async ()=>{
                var pw = null;
                var ref = firebase.database().ref("doctors");
                var query = ref.orderByChild("username").equalTo(this.state.username);
                await query.once("value", function(snapshot) {
                    snapshot.forEach(function(child) {
                        pw = child.val().password
                        console.log(pw)
                    });
                });
                if (pw == this.state.password){
                    const navigateAction =  StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({routeName: 'Feed', params: {Phone:this.state.phone}})]
                    });
                    this.props.navigation.dispatch(navigateAction)
                } else {
                    Alert.alert("Incorrect username and password!")
                }
            }}>
                <Text style={{color:"#eedede",fontSize:16, fontWeight:"bold",textAlignVertical:"center"}}>Login</Text>
            </TouchableOpacity>
        </View>
      </View>
      )
  }
}