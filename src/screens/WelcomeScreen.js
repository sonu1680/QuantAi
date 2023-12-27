import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  LogBox,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function WelcomeScreen({navigation}) {
  let name1;
  const getData = async () => {
    try {
      const name = await AsyncStorage.getItem('name');
      const phone = await AsyncStorage.getItem('phone');
      const gender = await AsyncStorage.getItem('gender');

      name1 = JSON.parse(name);
      const phone1 = JSON.parse(phone);
      const gender1 = JSON.parse(gender);
      //console.log(name1, phone1, gender1);
    } catch (e) {
      console.log(e);
    }
    if (name1 != null) {
      setTimeout(() => {
        navigation.navigate('Home');
      }, 2000);
    } else {
      navigation.navigate('Info');
    }
  };

  useEffect(() => {
    getData();
  });

  return (
    <SafeAreaView className="flex-1 flex justify-around bg-white">
      <StatusBar translucent backgroundColor="transparent" />

      {/* title */}
      <View className="space-y-2">
        <Text
          style={{fontSize: wp(15), color: '#00dbd9', marginTop: 10}}
          className="text-center font-bold text-gray-500">
          QuantAi
        </Text>
        <Text
          style={{fontSize: 12, color: '#00dbd9'}}
          className="text-center font-bold text-gray-300">
          Powered by OpeanAi
        </Text>
      </View>

      {/* assistant image */}
      <View className="flex-row justify-center">
        <Image
          source={require('../../assets/images/3.png')}
          style={{height: 400, width: 400, marginLeft: '10%'}}
        />
      </View>

      {/* start button */}
      {/* <TouchableOpacity
        style={{backgroundColor: '#00dbd9'}}
        onPress={() => navigation.navigate('Info')}
        className="bg-emerald-600 mx-5 p-4 rounded-2xl">
        <Text
          style={{fontSize: wp(6)}}
          className="text-center font-bold text-white">
          Get Started
        </Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}
