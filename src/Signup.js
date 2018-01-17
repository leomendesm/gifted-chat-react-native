import React,{ Component } from 'react';
import { View, Text, AsyncStorage, TextInput, Button, Keyboard, Alert } from 'react-native';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import KeyboardSpacer from 'react-native-keyboard-spacer'
const USER_ID = '@userId';

export default class Signup extends Component {
  static navigationOptions = {
    title: 'Signup'
  }
  constructor(props) {
    super(props);
    this.state = {
      verified: false,
      username: '',
      password: '',
      email: ''
    };

    //navigation prop
    const { navigate } = this.props.navigation
    
    //binding variables    
    this.keyboard = Keyboard
    this.navigate = navigate
    
    //initialize socket
    this.socket = SocketIOClient('http://192.168.11.40:3000', { timeout: 30000 });
    this.socket.on('message', this.onReceivedMessage);

    //bind this
    this.determineUser = this.determineUser.bind(this)
    this.verifyLogin = this.verifyLogin.bind(this)
    this.signup = this.signup.bind(this)
  }
  
  componentWillMount(){
    //verify if the user is already logged in
    this.verifyLogin()
  }

  verifyLogin() {
    AsyncStorage.getItem(USER_ID)
      .then( userId => {
        if (userId) {
          // this.navigate('Chat')
          this.setState({verified: true})          
        }else{
          this.setState({verified: true})
        }
      })
      .catch((e) => alert(e));
  }

  determineUser() {
    this.keyboard.dismiss()
    this.socket.emit('signup', this.state);
    this.socket.on('signupConfirmed', userId => {
      this.navigate('Home')
      Alert.alert('Sign-up Sucessful', 'You can login now', [{text: 'OK'}])
    })
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
            <TextInput onChangeText={username => this.setState({username})} value={this.state.username} />

            <Text style={{alignSelf: 'center', marginTop: 20}}> Email </Text>        
            <TextInput onChangeText={email => this.setState({email})}value={this.state.email} keyboardType='email-address' />

            <Text style={{alignSelf: 'center', marginTop: 20}} > Password </Text>        
            <TextInput onChangeText={password => this.setState({password})} secureTextEntry={true} visible-password={true}
            value={this.state.password} />

            <Button
              onPress={this.determineUser}
              title="Signup"
              color="#841584"
              style={{marginTop: 20}}
            />

            <Text style={{alignSelf: 'center', marginTop: 20, marginBottom: 20}}>or</Text>

            <Button
              onPress={this.signup}
              title="Login"
              color="#841584"
            />
            <KeyboardSpacer />
          </View>
        }  
      </View>
    )
  }

}