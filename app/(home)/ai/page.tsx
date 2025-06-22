'use client';
import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';

export default function Page() {
  const [input, setInput] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [results, setResults] = useState<string[] | null>(null);
  const [loading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const handleSubmitEditingStream = async () => {
    try {
      handleStart();
      setContent('...');
      const response = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/event-stream',
        },
        body: JSON.stringify({input: input.trim()}),
      });
      setContent('something happened');
      if (!response.body) {
        return;
      }
      // To decode incoming data as a string
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

      while (true) {
        const {value, done} = await reader.read();
        if (done) {
          break;
        }
        if (value) {
          setContent(prev => prev + value);
        }
      }
    } catch (e) {
      setContent(e);
    } finally {
      handleStop();
      // setLoading(false);
    }
  };

  const handleSubmitEditing = async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    try {
      handleStart();
      setContent('...');
      const response = await fetch(`http://localhost:3000/api/ai/suggest`, {
        method: 'POST',
        body: JSON.stringify({
          input: e.nativeEvent.text.trim(),
          genre: '',
          rhyme: '',
          topic: '',
        }),
      });

      if (response.status === 201) {
        const json = await response.json();
        setResults(json);
      } else {
        const txt = await response.text();
        throw new Error(txt);
      }
    } catch (e) {
      console.log(e);
      setContent(e);
    } finally {
      setContent('');
      handleStop();
      // setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;

    if (isActive) {
      // Set up an interval to increment the seconds count every second
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else {
      // Clean up the interval if the timer is stopped
      clearInterval(intervalId);
    }

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  return (
    <View>
      <Text>Time: {seconds}</Text>
      <Text>send something</Text>
      <TextInput
        defaultValue={input}
        onChangeText={setInput}
        onSubmitEditing={handleSubmitEditingStream}
        placeholder={'Message'}
        placeholderTextColor={'gray'}
      />
      <TextInput
        defaultValue={input}
        onChangeText={setInput}
        onSubmitEditing={handleSubmitEditing}
        placeholder={'Message'}
        placeholderTextColor={'gray'}
      />
      {loading ? <ActivityIndicator size={20} /> : <Text>{content ? content : 'Need help?'}</Text>}
      {results ? results.map(res => <Text>{res}</Text>) : null}
    </View>
  );
}
