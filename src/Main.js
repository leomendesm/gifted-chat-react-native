import React,{ Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer'
const USER_ID = '@userId';

export default class Main extends Component {
  static navigationOptions = {
    title: 'Chat'
  }

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userId: null
    };
    this.determineUser = this.determineUser.bind(this);
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessages = this._storeMessages.bind(this);
    this.socket = SocketIOClient('http://192.168.11.40:3000', { timeout: 30000 });
    this.socket.on('message', this.onReceivedMessage);
  }

  componentWillMount(){
    this.determineUser();
  }
  
  determineUser() {
    AsyncStorage.getItem(USER_ID)
      .then( userId => {
          this.socket.emit('userJoined', userId)
          this.setState({ userId })
      })
      .catch((e) => alert(e))
  }

  onReceivedMessage(messages) {
    this._storeMessages(messages);
  }

  onSend(messages=[]) {
    this.socket.emit('message', messages[0]);
    this._storeMessages(messages);
  }
  
  _storeMessages(messages) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  render() {
    var user = { _id: this.state.userId || -1 };
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={user}
          showUserAvatar={true}
          renderAvatarOnTop={true}
          keyboardShouldPersistTaps={'never'}
        />
        <KeyboardSpacer />
      </View>
    )
  }

}