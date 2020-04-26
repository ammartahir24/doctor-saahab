import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Audio} from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { min } from 'react-native-reanimated';
import { NavigationActions, StackActions } from 'react-navigation';
import * as firebase from 'firebase';
import uuid from 'uuid';


const firebaseConfig = {
    apiKey: "AIzaSyDaz7LoLOQmtrcsaZ2ohJ37X9kEYosRde8",
    authDomain: "doctorsaahab-38da4.firebaseapp.com",
    databaseURL: "https://doctorsaahab-38da4.firebaseio.com/",
    projectId: "doctorsaahab-38da4",
    storageBucket: "doctorsaahab-38da4.appspot.com"
};

firebase.initializeApp(firebaseConfig);


export default class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            recording : null,
            fileURL : null,
            playbackInstance: null,
            recordtime: "00:00",
            micSize: 64,
            status: "Record",
            playStatus: "play-arrow",
            imageURL: "https://firebasestorage.googleapis.com/v0/b/doctorsaahab-38da4.appspot.com/o/no.png?alt=media&token=82a3fe4c-2b96-4522-b211-b36e50aa0f11",
            imageuri:"",
            text: "",
            imageUploading: false,
            uploading: false
        }
    }
    recordingCallback ({ durationMillis, isRecording, isDoneRecording }){
        console.log(durationMillis, isRecording, isDoneRecording);
        var seconds = Math.floor(durationMillis/1000);
        var minutes = Math.floor(seconds/60).toString();
        seconds = (seconds % 60).toString();
        if (minutes.length == 1){
            minutes = "0"+minutes;
        }
        if (seconds.length == 1){
            seconds = "0"+seconds;
        }
        this.setState({recordtime:minutes+":"+seconds})
        
    }
    soundCallback ( state ){
        console.log(state);
    }

    static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;

    return {
      headerLeft: (<View style={{alignContent:"center", justifyContent:"center"}}> 
                      <Text style={{marginLeft:20, color:"#eedede",fontSize:30, fontWeight:"bold"}}>
                          Home
                      </Text>
                  </View>),
      headerStyle: {
        backgroundColor: '#0e4d92',
        height: 70
      }, 
      headerRight: (<View style={{height:40,width: Math.round(Dimensions.get('window').width)*0.20,alignSelf:'center',flex:1,flexDirection:'row', marginRight:10}}>
                        <View style={{height:40,width:Math.round(Dimensions.get('window').width)*0.10,alignItems: 'center', justifyContent:"center"}}>
                        <TouchableOpacity style={{justifyContent:'center',alignSelf:'center', alignItems:'center'}} onPress={() => {navigation.navigate("MyPosts",{Phone: navigation.state.params.Phone})}} > 
                            <Icon name='menu' size={32} color="#eedede" style={{marginTop:7}}/>
                        </TouchableOpacity>
                        </View>
                        <View style={{height:40,width:Math.round(Dimensions.get('window').width)*0.10,alignItems: 'center', justifyContent:"center"}}>
                        <TouchableOpacity style={{justifyContent:'center',alignSelf:'center', alignItems:'center'}} onPress={() => {
                            const navigateAction =  StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({routeName: 'Login1'})]
                            });
                            navigation.dispatch(navigateAction)
                        }} > 
                            <Icon name='exit-to-app' size={32} color="#eedede" style={{marginTop:7}}/>
                        </TouchableOpacity>
                        </View>
                    </View>)
    }
  };
  async  uploadImage(uri){
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
    
      const ref = firebase
        .storage()
        .ref()
        .child(uuid.v4());
      const snapshot = await ref.put(blob);
    
      // We're done with the blob, close and release it
      blob.close();
    
      return await snapshot.ref.getDownloadURL();
  }
    render() {
      const {navigate} = this.props.navigation;
      var iconColor = "grey";
      var opacity = 1;
      if (this.state.fileURL){
        iconColor = "#eedede"
        opacity = 0.2;
      }
      var camColor = "grey";
      var camOpacity = 1;
      if (this.state.imageuri !== ""){
        camColor = "#eedede"
        camOpacity = 0.2;
      }
      
      return (
        <View style={styles.container}>
            {/* <Text>Home</Text>, */}
            {/* <View style={{height:"5%"}}></View> */}
            <View style={{flexDirection:'row', height:'30%',width:'100%', backgroundColor: '#eedede'}}>
                <View style={{width:'50%',height:'100%',justifyContent:"center",alignItems: 'center'}}>
                    <TouchableOpacity style={{backgroundColor:"#0e4d92", width:"99%", height:"99%", alignContent:"center", alignItems:"center", borderRadius:10,borderWidth:2,borderColor:"#0e4d92",elevation:10}} 
                        onPress={async () => {
                            if (this.state.recording) {
                                console.log("Recording")
                                try {
                                    await this.state.recording.stopAndUnloadAsync()
                                    await Audio.setAudioModeAsync({
                                        allowsRecordingIOS: false,
                                        playsInSilentModeIOS: false
                                    });
                                } catch (err){
                                    console.log(err)
                                }
                                const fileURL = this.state.recording.getURI();
                                this.state.recording.setOnRecordingStatusUpdate(null)
                                console.log(fileURL);
                                this.setState({recording:null, fileURL, recordtime:"00:00", micSize:64, status:"Record"})
                            }
                            else {
                                const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
                                if (status === "granted") {
                                    console.log("granted")
                                    this.state.recording = new Audio.Recording();
                                    this.state.recording.setOnRecordingStatusUpdate(({ durationMillis, isRecording, isDoneRecording })=>{
                                        console.log(durationMillis, isRecording, isDoneRecording);
                                        var seconds = Math.floor(durationMillis/1000);
                                        var minutes = Math.floor(seconds/60).toString();
                                        seconds = (seconds % 60).toString();
                                        if (minutes.length == 1){
                                            minutes = "0"+minutes;
                                        }
                                        if (seconds.length == 1){
                                            seconds = "0"+seconds;
                                        }
                                        this.setState({recordtime:minutes+":"+seconds})
                                    });
                                    this.setState({micSize:128, status:"Recording"})
                                    this.state.recording.setProgressUpdateInterval(200);
                                    await Audio.setAudioModeAsync({
                                        allowsRecordingIOS: true,
                                        playsInSilentModeIOS: true
                                    });
                                    try {
                                        await this.state.recording.prepareToRecordAsync(
                                            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
                                        );
                                        console.log("ready to record.")
                                        await this.state.recording.startAsync();
                                        console.log("Recording started.")
                                        // You are now recording!
                                    } catch (error) {
                                        throw new Error(error);
                                    }
                                }
                            }
                        }}>
                        <View style={{flex:1,flexDirection:"column",justifyContent:"center", alignItems:"center"}}>
                            <Icon name="mic" size={this.state.micSize} color="#eedede" />
                            <Text style={{color:"#eedede",fontSize:20, fontWeight:"bold",textAlign:"center"}}>{this.state.status}</Text>
                            <Text style={{color:"#eedede",fontSize:20, fontWeight:"bold",textAlign:"center"}}> {this.state.recordtime}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{width:'50%',height:'100%',justifyContent:"center",alignItems: 'center'}}>
                    <TouchableOpacity style={{backgroundColor:"#0e4d92", width:"99%", height:"99%", alignContent:"center", alignItems:"center", borderRadius:10,borderWidth:2,borderColor:"#0e4d92",elevation:10}} 
                        onPress={async () => {
                            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                            if (status !== 'granted') {
                                alert('Sorry, we need camera roll permissions to make this work!');
                            }
                            try {
                                let result = await ImagePicker.launchImageLibraryAsync({
                                  mediaTypes: ImagePicker.MediaTypeOptions.All,
                                  allowsEditing: true,
                                  aspect: [4, 3],
                                  quality: 1,
                                });
                                if (!result.cancelled) {
                                  this.setState({imageuri:result.uri, imageUploading:true });
                                  imageURL = await this.uploadImage(result.uri)
                                  this.setState({ imageURL: imageURL, imageUploading: false});
                                }
                            } catch(err){
                                console.log(err)
                            }
                        }}>
                        <View style={{flex:1,flexDirection:"column",justifyContent:"center", alignItems:"center"}}>
                            <Icon name="image" size={64} color="#eedede" />
                            <Text style={{color:"#eedede",fontSize:20, fontWeight:"bold",textAlign:"center"}}>Pick Image</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flexDirection:'row', height:'10%',width:'99.5%', backgroundColor: '#0e4d92',alignSelf:"center",borderRadius:10,borderWidth:2,borderColor:"#0e4d92",elevation:10 }}>
                <View style={{width:'50%',height:'100%',justifyContent:"center",alignItems: 'center', backgroundColor:"#0e4d92"}}>
                    <View style={{flex:1, flexDirection:"row", alignItems:"center",justifyContent:"center"}}>
                        <TouchableOpacity style={{height:"100%", width:"30%", alignContent:"center", alignItems:"center"}}
                            onPress={async () => {
                                if (this.state.fileURL) {
                                    console.log("Playing")
                                    try {
                                        await Audio.setAudioModeAsync({
                                            allowsRecordingIOS: false,
                                            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                                            playsInSilentModeIOS: true,
                                            shouldDuckAndroid: true,
                                            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                                        });
                                        if (this.state.playbackInstance !== null) {
                                            await this.state.playbackInstance.unloadAsync();
                                            this.state.playbackInstance.setOnPlaybackStatusUpdate(null);
                                            this.setState({ playbackInstance: null });
                                        }
                                        const {sound} = await Audio.Sound.create(
                                            { uri: this.state.fileURL },
                                            { shouldPlay:true, position: 0, duration: 1, progressUpdateIntervalMillis: 50 },
                                            (state)=>{
                                                if (!state.shouldPlay){
                                                    this.setState({playStatus:"play-arrow"})
                                                }
                                            },
                                        );
                                        this.setState({playbackInstance:sound, playStatus:"pause"});
                                    } catch (err){
                                        console.log(err)
                                    }
                                    this.state.playbackInstance.loadPlaybackInstance(true);
                                }
                                console.log("Here")
                            }}
                            activeOpacity={opacity}>
                            <View style={{flex:1,flexDirection:"column",justifyContent:"center", alignItems:"center"}}>
                                <Icon name={this.state.playStatus} size={32} color={iconColor} />
                            </View>
                        </TouchableOpacity>
                        <View style={{height:"100%", width:"40%"}}>

                        </View>
                        <TouchableOpacity style={{height:"100%", width:"30%", alignContent:"center", alignItems:"center"}} 
                            onPress = {()=>{
                                this.setState({fileURL:null, recording: null, playbackInstance: null})
                            }}
                            activeOpacity={opacity}>
                            <View style={{flex:1,flexDirection:"column",justifyContent:"center", alignItems:"center"}}>
                                <Icon name="delete" size={32} color={iconColor} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{width:'50%',height:'100%',justifyContent:"center",alignItems: 'center', backgroundColor:"#0e4d92"}}>
                    <View style={{flex:1, flexDirection:"row", alignItems:"center",justifyContent:"center"}}>
                        <View style={{height:"100%", width:"30%", alignContent:"center", alignItems:"center"}}>
                            <Image source={{uri: this.state.imageuri}} style={{width:"100%", height:"100%",borderRadius:10,borderWidth:2,borderColor:"#0e4d92"}}/>
                        </View>
                        <View style={{height:"100%", width:"10%",}}></View>
                        <View style={{height:"100%", width:"20%", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
                            {this.state.imageUploading && <ActivityIndicator color={"#fff"} />}
                        </View>
                        <TouchableOpacity style={{height:"100%", width:"30%", alignContent:"center", alignItems:"center"}} 
                            onPress = {()=>{
                                this.setState({imageURL: "https://firebasestorage.googleapis.com/v0/b/doctorsaahab-38da4.appspot.com/o/no.png?alt=media&token=82a3fe4c-2b96-4522-b211-b36e50aa0f11", imageuri: ""})
                            }}
                            activeOpacity={camOpacity}>
                            <View style={{flex:1,flexDirection:"column",justifyContent:"center", alignItems:"center"}}>
                                <Icon name="delete" size={32} color={camColor} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{height:"5%"}}></View>
            <View style={{flexDirection:'row', height:'10%',width:'99.5%', backgroundColor: '#eedede',alignItems:"center",alignSelf:"center",borderRadius:10,borderWidth:2,borderColor:"#0e4d92",elevation:10 }}>
                <View style={{width:"100%", height:"100%", alignItems:"center"}}>
                    <TextInput
                        style={{color: '#0e4d92',fontSize:14, width:"90%", borderColor: '#eedede', borderBottomWidth: 1, alignSelf:"center", paddingTop:25}}
                        underlineColorAndroid="transparent"
                        placeholder={" Write something.. "}
                        onChangeText={(text) => this.setState({text})}
                    />
                </View>
            </View>
            <View style={{height:"5%"}}></View>
            <View style={{flexDirection:'row', height:'5%',width:'99.5%', backgroundColor: '#eedede' }}>
                <View style={{flex:1, width:"100%", height:"100%", alignItems:"center", justifyContent:"center"}}>
                   <TouchableOpacity style={{flex:1, backgroundColor:"#0e4d92", width:"20%", height:"100%", alignItems:"center", justifyContent:"center"}}
                   onPress = { async ()=>{
                        if(this.state.text == "" && this.state.imageURL == "" && this.state.fileURL == null){
                            Alert.alert("You cannot submit empty post ")
                        }
                        else if (!this.state.uploading){
                            console.log(this.state.text)
                            console.log(this.state.imageURL)
                            console.log(this.state.fileURL)
                            this.setState({uploading: true})
                            var audURL = "";
                            const date = new Date().toString()
                            const postID = "post"+date
                            if (this.state.fileURL){
                                const blob = await new Promise((resolve, reject) => {
                                    const xhr = new XMLHttpRequest();
                                    xhr.onload = function() {
                                        resolve(xhr.response);
                                    };
                                    xhr.onerror = function(e) {
                                        console.log(e);
                                        // reject(new TypeError('Network request failed'));
                                    };
                                    xhr.responseType = 'blob';
                                    xhr.open('GET', this.state.fileURL, true);
                                    xhr.send(null);
                                });
                                filename = this.state.fileURL.split('/')[this.state.fileURL.split('/').length-1]
                                var ref = firebase.storage().ref().child(filename);
                                const snapshot = await ref.put(blob);
                                blob.close();
                                audURL = await snapshot.ref.getDownloadURL();
                            }
                            firebase.database().ref('posts/' + postID).set({
                                text: this.state.text,
                                audio: audURL,
                                image: this.state.imageURL,
                                phone: this.props.navigation.state.params.Phone,
                                date:date
                            });
                            this.setState({uploading: false, fileURL:null, recording: null, playbackInstance: null, imageURL: "https://firebasestorage.googleapis.com/v0/b/doctorsaahab-38da4.appspot.com/o/no.png?alt=media&token=82a3fe4c-2b96-4522-b211-b36e50aa0f11", imageuri: ""})
                            Alert.alert("Your post has been submitted. ")
                        }
                    }}>
                           {this.state.uploading && <ActivityIndicator color={"#fff"} />}
                           {!this.state.uploading && <Text style={{color:"#eedede",fontSize:16, fontWeight:"bold",textAlignVertical:"center"}}>Post</Text>}
                    </TouchableOpacity> 
                </View>
            </View>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eedede',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    },
  });
  