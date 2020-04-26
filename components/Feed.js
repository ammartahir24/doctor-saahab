import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  TouchableHighlight,
  Dimensions,
  Linking,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationActions, StackActions } from 'react-navigation';
import * as firebase from 'firebase';
import {Audio} from 'expo-av';


function compare (a,b){
    if ( a._date < b._date ){
        return 1;
      }
      return -1;
}

function compareDates(date1, date2){
    console.log(date1, date2)
    date1 = Date.parse(date1)
    date2 = Date.parse(date2)
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date2)
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date2)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date2)    
    const tm = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(date2)    
    const wk = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date2)    
    if (diffDays < 2){
        return "Today "+tm
    }
    else if(diffDays < 3){
        return "Yesterday "+tm
    }
    else if(diffDays < 7){
        return wk+" "+tm
    }
    else {
        return mo+" "+da+", "+ye
    }
}

export default class Feed extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            playbackInstance: null,
            playing: null,
            posts: []
        }
    }

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        // console.log("Hello")
        return {
            headerLeft: (<View style={{alignContent:"center", justifyContent:"center"}}> 
                            <Text style={{marginLeft:20, color:"#eedede",fontSize:30, fontWeight:"bold"}}>
                                Feed
                            </Text>
                        </View>),
            headerStyle: {
              backgroundColor: '#0e4d92',
              height: 70
            }, 
            headerRight: (<View style={{height:40,width: Math.round(Dimensions.get('window').width)*0.10,alignSelf:'center',flex:1,flexDirection:'row', marginRight:10}}>
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

    async componentDidMount() {
        var posts = []
        await firebase.database().ref("posts").once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                posts.push({"Image": child.val().image, "Audio": child.val().audio, "Text": child.val().text, "Phone": child.val().phone, "Date": child.val().date, "_date":  Date.parse(child.val().date)})
                console.log(posts)
            });
        });
        posts = posts.sort(compare)
        console.log("this",posts)
        this.setState({
            posts:posts
        })
    }

    render() {
      const {navigate} = this.props.navigation;
      return (
        <View style={{ flex:0,width:"100%", height:"100%",marginTop:0, backgroundColor:"#eedede"}}>
            {}
            <ScrollView persistentScrollbar = {true} style = {{flex: 1, width: '97%', height: '55%', alignSelf: 'center',marginTop: 5}}>
                {
                    this.state.posts.map((item, index) =>{
                        var date = new Date().toString()
                        var timeString = compareDates(date, item.Date)
                        var volumeIcon = "volume-mute"
                        if (this.state.playing == index){
                            volumeIcon = "volume-up"
                        }
                        return(
                            <View underlayColor="#439889" key = {index} style={{borderWidth:2,alignSelf: 'center',width: "100%", backgroundColor:"#eedede",flex:1, flexDirection:'row',paddingTop:2, paddingBottom:2, paddingLeft:5, borderRadius: 10, marginBottom: 5, borderColor: "#0e4d92"}}>
                                <Image source = {{uri:item.Image}} style={{borderColor:"#eedede",borderRadius:5 ,width: 70, height: 70, overflow: "hidden", borderWidth: 1, margin:3, alignSelf:"center"}}/>
                                <View style={{flex:6, flexDirection:'column', margin:5}}>
                                <Text style={{textAlign:"center", color:"#0e4d92", fontWeight:"bold", fontStyle:"italic"}}>{timeString}</Text>
                                <Text textBreakStrategy={'balanced'} style={{flex:1, flexWrap:'wrap', color:"#0e4d92",height:"37%",fontSize:16,textAlignVertical: "center",marginLeft:15}}>{item.Text}</Text>
                                {/* <View style={{height:"12%", backgroundColor: "transparent"}}></View> */}
                                </View>
                                <View style={{flex: 1, justifyContent:"center",alignItems:"center"}}>
                                    <TouchableOpacity onPress={
                                        () => {
                                            Linking.openURL(`tel:${item.Phone}`)
                                        }
                                    } style={{width:40, height:40}}>
                                         <Icon name='call' size={32} color="#0e4d92" style={{marginTop:7}}/>
                                    </TouchableOpacity>
                                    {item.Audio != "" && <TouchableOpacity onPress={
                                        async() => {
                                            if (item.Audio) {
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
                                                        { uri: item.Audio },
                                                        { shouldPlay:true, position: 0, duration: 1, progressUpdateIntervalMillis: 50 },
                                                        (state)=>{
                                                            if (!state.shouldPlay){
                                                                this.setState({playing: null})
                                                            }
                                                        },
                                                    );
                                                    this.setState({playbackInstance:sound, playStatus:"pause", playing:index});
                                                } catch (err){
                                                    console.log(err)
                                                }
                                                this.state.playbackInstance.loadPlaybackInstance(true);
                                            }
                                            console.log("Here")
                                        }
                                    } style={{width:40, height:40}}>
                                         <Icon name={volumeIcon} size={32} color="#0e4d92" style={{marginTop:7}}/>
                                    </TouchableOpacity>}
                                    {item.Audio == "" && <TouchableOpacity style={{width:40, height:40}} activeOpacity={1}>
                                         <Icon name={volumeIcon} size={32} color="grey" style={{marginTop:7}}/>
                                    </TouchableOpacity>}
                                    </View>
                            </View>
                        );
                    })
                }
            </ScrollView>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  