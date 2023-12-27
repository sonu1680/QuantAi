import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  LogBox,
} from 'react-native';



LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Features() {


  return (
    <ScrollView
      style={{height: '100%', backgroundColor: 'transparent'}}
      bounces={false}
      showsVerticalScrollIndicator={false}
      className="space-y-4">
      <Text style={{fontSize: wp(5.5),color:'white'}} className="font-semibold text-gray-700">
        Your Personal AI Assistant
      </Text>
      <View
        className="bg-emerald-200 p-4 rounded-xl space-y-2"
        style={{backgroundColor: '#00DBD9'}}>
        <View className="flex-row items-center space-x-1">
          <Text
            style={{fontSize: wp(4.8)}}
            className="font-semibold text-gray-700">
            Your AI
          </Text>
        </View>

        <Text style={{fontSize: wp(3.8)}} className="text-gray-700 font-medium">
          I am a personal AI build by{' '}
          <Text style={{fontWeight: 'bold'}}>SONU KUMAR PANDIT</Text> a
          React-Native Developer. I can answer your all Questions and I can also
          generate IMAGES for your content.
        </Text>
      </View>

      <View
        className="bg-emerald-200 p-4 rounded-xl space-y-2"
        style={{backgroundColor: '#00DBD9'}}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              'https://www.linkedin.com/in/sonu-kumar-pandit-563a6b254/',
            );
          }}>
          <View className="flex-row items-center space-x-1">
            <Text
              style={{fontSize: wp(4.8)}}
              className="font-semibold text-gray-700">
              Follow Me
            </Text>
          </View>

          <Text
            style={{fontSize: wp(3.8)}}
            className="text-gray-700 font-medium">
            You can follow me on my LinkedIn Profile.
          </Text>
         
          <Image
            style={{height: 40, width: 40,marginTop:9}}
            source={require('../../assets/images/linkedin.png')}
          />
        </TouchableOpacity>
      </View>

      <View
        className="bg-emerald-200 p-4 rounded-xl space-y-2"
        style={{backgroundColor: '#00DBD9'}}>
        <View className="flex-row items-center space-x-1">
          <Text
            style={{fontSize: wp(4.8)}}
            className="font-semibold text-gray-700">
            Let's Explore
          </Text>
        </View>

        <Text style={{fontSize: wp(3.8)}} className="text-gray-700 font-medium">
          Start by asking me a Question{' '}
          <Text style={{fontWeight: 'bold'}}>
            "What is Artificial Intelligance ?"
          </Text>
          Or Say me to{' '}
          <Text style={{fontWeight: 'bold'}}>"Draw a image of Dog"</Text>.
        </Text>
      </View>
     
    </ScrollView>
  );
}
