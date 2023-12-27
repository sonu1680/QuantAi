import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Clipboard,
  Alert,
  StatusBar,
  StyleSheet,
  TextInput,
  LogBox,
  ImageBackground,
  PermissionsAndroid,
} from 'react-native';
import background from '../../assets/images/background.jpg';
import Voice from '@react-native-community/voice';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {apiCall} from '../api/openAI';
import Features from '../components/features';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const HomeScreen = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [users, setUsers] = useState('');
  const scrollViewRef = useRef();

  // ----------------------------------------------------

  const requestStoragePermission = async () => {
    console.log('sonu');
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'QuantAi Storage Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        Alert.alert('permisiion granted');
      } else {
        console.log('Camera permission denied');
        Alert.alert('permisiion denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // ----------------------------------------------------

  const speechStartHandler = e => {
    // console.log('speech start event', e);
  };
  const speechEndHandler = e => {
    setRecording(false);
    //// console.log('speech stop event ', e);
  };
  const speechResultsHandler = e => {
    // console.log('speech event: ', e);
    const text = e.value[0];
    setResult(text);
  };

  const speechErrorHandler = e => {
    // console.log('speech error: ', e);
  };

  const startRecording = async () => {
    setRecording(true);
    Tts.stop();
    try {
      await Voice.start('en-US'); // en-US
    } catch (error) {
      //   console.log('error sonu', error);
    }
  };
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      fetchResponse();
    } catch (error) {
      // console.log('error', error);
    }
  };
  const clear = () => {
    Tts.stop();
    setSpeaking(false);
    setLoading(false);
    setMessages([]);
  };

  const fetchResponse = async () => {
    if (result.trim().length > 0) {
      setLoading(true);
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      setMessages([...newMessages]);

      // scroll to the bottom of the view
      updateScrollView();

      // fetching response from chatGPT with our prompt and old messages
      apiCall(result.trim(), newMessages).then(res => {
        //  console.log(result);

        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);

          setResult('');

          updateScrollView();

          setTimeout(() => {
            fireChatUpdate();
          }, 1000);

          startTextToSpeach(res.data[res.data.length - 1]);

          // now play the response to user
        } else {
          Alert.alert('Sorry but i can not give answer for this question.');
        }
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd(
        {
          animated: true,
        },
        200,
      );
    });
  };

  const startTextToSpeach = message => {
    if (!message.content.includes('https')) {
      setSpeaking(true);
      // playing response with the voice id and voice speed
      Tts.speak(message.content, {
        iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
        rate: 0.7,
      });
    }
  };

  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };

  useEffect(() => {
    getLocalStorageUserName();

    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    // text to speech events
    Tts.setDefaultLanguage('en-IE');
    Tts.addEventListener('tts-start', event => console.log('start', 'event'));
    Tts.addEventListener('tts-finish', event => {
      //console.log('finish', event);
      setSpeaking(false);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', 'event'));

    return () => {
      // destroy the voice instance after component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const fireChatHistory = localUsers => {
    database()
      .ref(`/QuantAi Users/${localUsers}/Chats`)
      .once('value')
      .then(snapshot => {
        let fetchChats = snapshot.val();
        let chatss = JSON.parse(fetchChats.Chats);
        setMessages(chatss);
        // console.log(chatss);
        //console.log('User data: ',chatss);
      });
  };

  const fireChatUpdate = () => {
    let localChat = JSON.stringify(messages);
    // console.log(`/QuantAi Users/${users}`);
    database()
      .ref(`/QuantAi Users/${users}/Chats`)
      .update({
        Chats: localChat,
      })
      .then(() => console.log('Chats updated.'));
  };

  const getLocalStorageUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('name');
      let localUsers = JSON.parse(name);
      setUsers(localUsers);
      fireChatHistory(localUsers);
    } catch (e) {
      //console.log(e);
    }
  };

  const logout = async () => {
    console.log('logout');
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }
    navigation.navigate('Info');
  };

  return (
    <View className="flex-1 bg-dark" style={{backgroundColor: 'transparent'}}>
      <ImageBackground source={background} style={{flex: 1}}>
        <StatusBar translucent backgroundColor="transparent" />
        <SafeAreaView className="flex-1 flex mx-3 ">
          {/* bot icon */}
          <View className="flex-row justify-center">
            <Image
              source={require('../../assets/images/abc.gif')}
              style={{
                height: hp(8),
                width: hp(8),
                marginTop: 25,
                marginBottom: 40,
              }}
            />
          </View>

          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={() => logout()}
              style={{
                height: 40,
                width: 40,
                marginTop: -100,
              }}>
              <Image
                source={require('../../assets/images/logout.png')}
                style={{
                  height: 30,
                  width: 30,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* features || message history */}
          {messages.length > 0 ? (
            <View
              className="space-y-3 flex-1 "
              style={{marginTop: -30, borderRadius: 20}}>
              <View
                style={{
                  height: '100%',
                  backgroundColor: 'transparent',
                  paddingBottom: 160,
                }}
                className="bg-neutral-200 rounded-4xl p-2">
                <ScrollView
                  ref={scrollViewRef}
                  bounces={false}
                  className="space-y-4"
                  showsVerticalScrollIndicator={false}>
                  {messages.map((message, index) => {
                    if (message.role == 'assistant') {
                      if (message.content.includes('https')) {
                        // result is an ai image
                        return (
                          <View key={index} className="flex-row justify-start">
                            <View className="p-0.5 flex rounded-2xl bg-emerald-100 rounded-tl-none">
                              <TouchableOpacity>
                                <Image
                                  source={{uri: message.content}}
                                  className="rounded-2xl"
                                  resizeMode="contain"
                                  style={{height: wp(55), width: wp(73)}}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      } else {
                        // chat gpt response
                        return (
                          <View className="flex-row justify-start">
                            <View
                              key={index}
                              style={{
                                width: wp(70),
                                backgroundColor: '#00DBD9',
                              }}
                              className="bg-emerald-100 p-2 rounded-xl rounded-tl-none">
                              <Image
                                style={{height: 50, width: 50, marginLeft: -8}}
                                source={require('../../assets/images/abc.gif')}
                              />

                              <TouchableOpacity
                                onPress={() =>
                                  Clipboard.setString(message.content)
                                }>
                                <Text
                                  className="text-neutral-800"
                                  style={{fontSize: wp(4)}}>
                                  {message.content}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      }
                    } else {
                      // user input text
                      return (
                        <View key={index} className="flex-row justify-end">
                          <View
                            style={{width: wp(60)}}
                            className="bg-white p-2 rounded-xl rounded-tr-none">
                            <Text style={{fontSize: wp(4), color: 'black'}}>
                              {message.content}
                            </Text>
                          </View>
                        </View>
                      );
                    }
                  })}
                </ScrollView>
              </View>

              {/* ---------------------------------------------------------------------------- */}
              {/* text input fro question and handler*/}
              <View style={styles.mic_input_Container}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.questionInput}
                    onChangeText={text => setResult(text)}
                    value={result}
                    placeholder="ASK ME A QUESTION...."
                    placeholderTextColor="black"
                    returnKeyType="done"
                    onSubmitEditing={() => fetchResponse()}
                  />
                  <TouchableOpacity
                    style={styles.sendBtn}
                    onPress={() => fetchResponse()}>
                    <Image
                      className="rounded-full"
                      source={require('../../assets/images/send.png')}
                      style={{width: 30, height: 30}}
                    />
                  </TouchableOpacity>
                </View>

                {/* recording, clear and stop buttons */}

                <View className="flex justify-center items-center">
                  {loading ? (
                    <Image
                      source={require('../../assets/images/loading.gif')}
                      style={{width: hp(8), height: hp(8)}}
                    />
                  ) : recording ? (
                    <TouchableOpacity
                      className="space-y-2"
                      onPress={stopRecording}>
                      {/* recording stop button */}
                      <Image
                        className="rounded-full"
                        source={require('../../assets/images/voiceLoading.gif')}
                        style={{width: hp(8), height: hp(8)}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={startRecording}>
                      {/* recording start button */}
                      <Image
                        className="rounded-full"
                        source={require('../../assets/images/recordingIcon.png')}
                        style={{width: hp(8), height: hp(8)}}
                      />
                    </TouchableOpacity>
                  )}
                  {messages.length > 0 && (
                    <TouchableOpacity
                      onPress={clear}
                      className="bg-neutral-400 rounded-3xl p-2 absolute right-10">
                      <Text className="text-white font-semibold">Clear</Text>
                    </TouchableOpacity>
                  )}
                  {speaking && (
                    <TouchableOpacity
                      onPress={stopSpeaking}
                      className="bg-red-400 rounded-3xl p-2 absolute left-10">
                      <Text className="text-white font-semibold">Stop</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View style={{height: '100%'}}>
              <Features />

              <View style={{position: 'relative', bottom: 130}}>
                <View style={styles.mic_input_Container}>
                  <ImageBackground source={background} style={{flex: 1}}>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.questionInput}
                        onChangeText={text => setResult(text)}
                        value={result}
                        placeholder="ASK ME A QUESTION...."
                        returnKeyType="done"
                        onSubmitEditing={() => fetchResponse()}
                      />
                      <TouchableOpacity
                        style={styles.sendBtn}
                        onPress={() => fetchResponse()}>
                        <Image
                          className="rounded-full"
                          source={require('../../assets/images/send.png')}
                          style={{width: 30, height: 30}}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* recording, clear and stop buttons */}

                    <View className="flex justify-center items-center">
                      {loading ? (
                        <Image
                          source={require('../../assets/images/loading.gif')}
                          style={{width: hp(10), height: hp(10)}}
                        />
                      ) : recording ? (
                        <TouchableOpacity
                          className="space-y-2"
                          onPress={stopRecording}>
                          {/* recording stop button */}
                          <Image
                            className="rounded-full"
                            source={require('../../assets/images/voiceLoading.gif')}
                            style={{width: hp(10), height: hp(10)}}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={startRecording}>
                          {/* recording start button */}
                          <Image
                            className="rounded-full"
                            source={require('../../assets/images/recordingIcon.png')}
                            style={{width: hp(10), height: hp(10)}}
                          />
                        </TouchableOpacity>
                      )}
                      {messages.length > 0 && (
                        <TouchableOpacity
                          onPress={clear}
                          className="bg-neutral-400 rounded-3xl p-2 absolute right-10">
                          <Text className="text-white font-semibold">
                            Clear
                          </Text>
                        </TouchableOpacity>
                      )}
                      {speaking && (
                        <TouchableOpacity
                          onPress={stopSpeaking}
                          className="bg-red-400 rounded-3xl p-2 absolute left-10">
                          <Text className="text-white font-semibold">Stop</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </ImageBackground>
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mic_input_Container: {
    height: 150,
    width: '100%',
    backgroundColor: 'transparent',
    paddingTop: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  inputContainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
  },
  questionInput: {
    height: 50,
    width: '85%',
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 10,
    fontSize: 17,
    paddingRight: 10,
    color: 'black',
    backgroundColor: 'white',
  },
  sendBtn: {
    height: 45,
    width: 45,
    marginLeft: 6,
    backgroundColor: '#00dbd9',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
