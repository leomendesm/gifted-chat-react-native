import React,{ Component } from 'react';
import { View, Text, AsyncStorage, TextInput, Button, Keyboard, Alert } from 'react-native';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import KeyboardSpacer from 'react-native-keyboard-spacer'
const USER_ID = '@userId';

export default class Login extends Component {

  static navigationOptions = {
    title: 'Login'
  }

  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      username: '',
      password: ''
    };

    //navigation prop
    const { navigate } = this.props.navigation
    
    //binding variables    
    this.keyboard = Keyboard
    this.navigate = navigate
    this.alert = Alert
    
    
    //bind this
    this.signin = this.signin.bind(this)
    this.verifyLogin = this.verifyLogin.bind(this)
    this.signup = this.signup.bind(this)
    this.signinCallback = this.signinCallback.bind(this)
    
    //initialize socket
    this.socket = SocketIOClient('http://192.168.11.40:3000', { timeout: 30000 });
    this.socket.on('signinConfirmed', this.signinCallback)
  }

  componentWillMount(){
    //verify if the user is already logged in
    this.verifyLogin()
  }

  verifyLogin() {
    AsyncStorage.getItem(USER_ID)
      .then( userId => {
        if(userId) this.navigate('Chat')  
        else this.setState({verified: true})
      })
      .catch((e) => alert(e));
  }

  signin() {
    this.keyboard.dismiss()
    this.socket.emit('signin', this.state);
  }

  signinCallback(userId) {
    if(userId > 0){
      AsyncStorage.setItem(USER_ID, userId).then(() => {
        this.navigate('Chat')
      })
    }else{
      Alert.alert('Login Failed', 'Incorrect username or password', [{text: 'OK'}])
    }
  }

  signup() {
    this.keyboard.dismiss()
    this.navigate('Signup')
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', paddingLeft: 20, paddingRight: 20}}>
        { this.state.verified &&
          <View>
          <Text style={{alignSelf: 'center'}}>Username</Text>
            <TextInput
              onChangeText={username => this.setState({username})}
              value={this.state.username}
            />
            <Text style={{alignSelf: 'center', marginTop: 20}} >Password</Text>        
            <TextInput
              onChangeText={password => this.setState({password})} secureTextEntry={true} visible-password={true}
              value={this.state.password}
            />
            <Button
              onPress={this.signin}
              title="Login"
              color="#841584"
              style={{marginTop: 20}}
              />
            <Text style={{alignSelf: 'center', marginTop: 20, marginBottom: 20}}>or</Text> 
            <Button
              onPress={this.signup}
              title="Signup"
              color="#841584"
              />
            <KeyboardSpacer />
          </View>
        }  
      </View>
    )
  }

}