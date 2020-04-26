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
    Alert
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import bg from '../bg.png'
import { onChange } from "react-native-reanimated";


export default class Login1 extends React.Component
{
  constructor(props){
      super(props);
      this.state = {
          phone:""
      }
  }

  render() 
  {
    return (
      <View style={{flex:1, flexDirection:"column", height:'100%',width:'100%',backgroundColor:'#0e4d92',aligntItems:'center'}}>
        <View style={{height:"15%"}}></View>
        <Image source={bg} style={{height:170,width:300,alignSelf:'center'}}/>
        <View style={{height:"3%"}}></View>
        <View style={{height:"10%"}}>
            <TouchableOpacity style={{ alignSelf:"center"}} onPress={() => {this.props.navigation.navigate("Login2")}}>
                <Text style={{textDecorationLine:"underline",color:"#eedede",fontSize:16, fontWeight:"bold",textAlign:"center"}}>Login as a Doctor</Text>
            </TouchableOpacity>
        </View>
        <View style={{height:"10%"}}>
            <TextInput
                placeholder="Enter Your Mobile Number"
                placeholderTextColor="grey"  
                underlineColorAndroid='transparent'
                keyboardType='numeric'
                style={{textAlign: 'center', width:"90%",  height: 60,  borderRadius: 10,  borderWidth: 2,  borderColor: '#0e4d92',  color: '#0e4d92', marginBottom: 10, alignSelf:"center", backgroundColor:"#eedede" }}
                onChangeText={(text)=>{this.setState({phone:text})}}
            />
        </View>
        <View style={{height:"3%"}}></View>
        <View style={{height:"5%", justifyContent:"center", alignItems:"center"}}>
            <TouchableOpacity style={{flex:1, backgroundColor:"#0e4d92", width:"20%", height:"100%", alignItems:"center", justifyContent:"center", elevation:10, shadowOpacity:0.3, borderRadius:5}} 
            onPress={()=>{
                if (this.state.phone.length == 11){
                    const navigateAction =  StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({routeName: 'Home', params: {Phone:this.state.phone}})]
                    });
                    this.props.navigation.dispatch(navigateAction)
                } else {
                    Alert.alert("This phone number does not look correct!")
                }
            }}>
                <Text style={{color:"#eedede",fontSize:16, fontWeight:"bold",textAlignVertical:"center"}}>Login</Text>
            </TouchableOpacity>
        </View>
      </View>
      )
  }
}