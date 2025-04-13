import { supabase } from '@/services/initSupabase';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function () {
  const [isDarkmode, setIsDarkmode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkmode(!isDarkmode);
  };

  async function forget() {
    setLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (!error) {
      setLoading(false);
      alert('Check your email to reset your password!');
    }
    if (error) {
      setLoading(false);
      alert(error.message);
    }
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <View style={isDarkmode ? styles.darkContainer : styles.lightContainer}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkmode ? '#17171E' : '#FFFFFF',
            }}>
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require('../../../assets/images/forget.png')}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? '#17171E' : '#FFFFFF',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                padding: 30,
                fontSize: 24,
                fontWeight: 'bold',
              }}>
              Forget Password
            </Text>
            <Text>Email</Text>
            <TextInput
              style={{
                marginTop: 15,
                borderWidth: 1,
                borderColor: '#CCCCCC',
                borderRadius: 5,
                padding: 10,
              }}
              placeholder="Enter your email"
              value={email}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={text => setEmail(text)}
            />
            <Pressable
              onPress={forget}
              style={{
                marginTop: 20,
                backgroundColor: '#000000',
                padding: 15,
                borderRadius: 5,
                alignItems: 'center',
              }}
              disabled={loading}>
              <Text style={{ color: '#FFFFFF' }}>{loading ? 'Loading' : 'Send email'}</Text>
            </Pressable>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 16 }}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  router.push('(auth)/login');
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginLeft: 5,
                  }}>
                  Login here
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 30,
                justifyContent: 'center',
              }}>
              <TouchableOpacity onPress={toggleTheme}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginLeft: 5,
                  }}>
                  {isDarkmode ? '☀️ light theme' : '🌑 dark theme'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#17171E',
  },
});
