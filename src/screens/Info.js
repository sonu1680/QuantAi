//import liraries
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
// create a component
const Info = ({navigation}) => {
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const fireUsersDetails = () => {
    const newReference = database().ref('/QuantAi Users/' + name);
    newReference
      .set({
        Chats: 'hello',
        Gender: gender,
        Phone: phone,
        Name: name,
      })
      .then(() => console.log('User Added in Firebase.'));

    const newReference1 = database().ref(`/QuantAi Users/${name}/Chats`);
    newReference1
      .set({
        Chats: 'hello',
      })
      .then(() => console.log('User Added in Firebase.'));

    // auth()
    //   .createUserWithEmailAndPassword(
    //     name,
    //    phone,
    //   )
    //   .then(() => {
    //     console.log('User account created & signed in!');
    //   })
    //   .catch(error => {
    //     if (error.code === 'auth/email-already-in-use') {
    //       console.log('That email address is already in use!');
    //     }

    //     if (error.code === 'auth/invalid-email') {
    //       console.log('That email address is invalid!');
    //     }

    //     console.error(error);
    //   });
  };

  const user = async () => {
    if (gender == '' || name == '' || phone == '') {
      console.log('Please fill Details');
      Alert.alert('Please fill Details');
    } else {
      if (phone.length == 10) {
        fireUsersDetails();
        // console.log(name, phone, gender);

        //Alert.alert('Success');
        try {
          const name1 = JSON.stringify(name);
          const phone1 = JSON.stringify(phone);
          const gender1 = JSON.stringify(gender);

          await AsyncStorage.setItem('name', name1);
          await AsyncStorage.setItem('phone', phone1);
          await AsyncStorage.setItem('gender', gender1);
        } catch (e) {
          console.log('error', e);
        }

        navigation.navigate('Home');
      } else {
        Alert.alert('Fill Phone!');
      }
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/3.png')}
        style={{height: 200, width: 200}}
      />

      <Text
        style={{
          fontSize: 30,
          color: 'white',
          fontWeight: 'bold',
        }}>
        Enter Your Details
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.name}
          placeholder="Enter Name"
          placeholderTextColor="black"
          onChangeText={text => setName(text)}
          maxLength={20}
        />
        <TextInput
          style={styles.phone}
          placeholder="Enter Phone No."
          placeholderTextColor="black"
          keyboardType="numeric"
          onChangeText={text => setPhone(text)}
          maxLength={10}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(value, index) => setGender(value)}
            mode="dropdown" // Android only
            style={styles.picker}>
            <Picker.Item
              label="Select Gender"
              value="Unknown"
              style={{
                color: 'black',
                fontWeight: 'bold',
                backgroundColor: 'white',
              }}
            />
            <Picker.Item
              label="Male"
              value="Male"
              style={{
                color: 'black',
                fontWeight: 'bold',
                backgroundColor: 'white',
              }}
            />
            <Picker.Item
              label="Female"
              value="Female"
              style={{
                color: 'black',
                fontWeight: 'bold',
                backgroundColor: 'white',
              }}
            />
            <Picker.Item
              label="Others"
              value="Others"
              style={{
                color: 'black',
                fontWeight: 'bold',
                backgroundColor: 'white',
              }}
            />
          </Picker>
        </View>
      </View>
      <TouchableOpacity style={styles.submit} onPress={() => user()}>
        <Text style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}>
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  inputContainer: {
    height: 280,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  name: {
    height: 50,
    width: '80%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    height: 50,
    width: '80%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
  },
  pickerContainer: {
    height: 50,
    width: '80%',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 30,
    overflow: 'hidden',
  },
  picker: {
    height: 30,
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
    color: 'black',
    backgroundColor: 'white',
  },
  submit: {
    height: 60,
    width: '85%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    marginTop: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//make this component available to the app
export default Info;
