import axios from 'axios';
import {Text} from 'react-native';
const apiKey = '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';
const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  },
});

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dalleUrl = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt, messages) => {
  // Logic 2 : sometimes chatgpt does not understand the art messages but thats fine, you can use this approach :)
  prompt = prompt.toLowerCase();
  let isArt =
    prompt.includes('image') ||
    prompt.includes('sketch') ||
    prompt.includes('art') ||
    prompt.includes('picture') ||
    prompt.includes('photograph') ||
    prompt.includes('drawing');
  if (isArt) {
    // console.log('dalle api call');
    return dalleApiCall(prompt, messages);
  } else {
    //console.log('chatgpt api call');
    return chatgptApiCall(prompt, messages);
  }
};

const chatgptApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatgptUrl, {
      model: 'gpt-3.5-turbo',
      messages,
    });

    let answer = res.data?.choices[0]?.message?.content;

    if (
      prompt == 'who is your founder' ||
      prompt == 'founder' ||
      prompt == 'who made you' ||
      prompt == 'who develop you' ||
      prompt == 'who invented you' ||
      prompt == 'who invent you' ||
      prompt == 'who is your father'
    ) {
      messages.push({
        role: 'assistant',
        content:
          'I am pesonal Ai developed by SONU KUMAR PANDIT. He is a React Native Developer. You can follow him on his LinkedIn profile',
      });
    } else {
      messages.push({role: 'assistant', content: answer.trim()});
    }

    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    //console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};

const dalleApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(dalleUrl, {
      model:'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality:"standard",
    });

    let url = res?.data?.data[0]?.url;
    // console.log('got image url: ',url);
    messages.push({role: 'assistant', content: url});
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    //console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};
