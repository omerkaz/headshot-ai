import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Layout, Text, TextInput, themeColor, useTheme } from 'react-native-rapi-ui';
import { supabase } from '../../../services/initSupabase';

export default function () {
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function login() {
    setLoading(true);
    try {
      console.log('Attempting login with:', { email });

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      console.log('Login response:', {
        success: !error,
        data,
        errorMessage: error?.message,
      });

      if (error) {
        setLoading(false);
        console.log('Login error:', JSON.stringify(error, null, 2));
        if (error.message === 'Network request failed') {
          alert('Connection error. Please check your internet and try again.');
        } else if (error.message.includes('Invalid login credentials')) {
          alert('Invalid email or password. Please try again.');
        } else {
          alert(error.message);
        }
        return;
      }

      if (!data?.user) {
        setLoading(false);
        alert('Check your email for the login link!');
        return;
      }

      // Success case
      setLoading(false);
      router.replace('/(main)/(tabs)/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setLoading(false);
      if (
        error.message?.includes('Network request failed') ||
        error.message?.includes('internet connection')
      ) {
        alert('Connection error. Please check your internet connection and try again.');
      } else {
        alert(error.message || 'An error occurred during login');
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isDarkmode ? '#17171E' : themeColor.white100,
            }}>
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require('../../../assets/images/login.png')}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}>
            <Text
              fontWeight="bold"
              style={{
                alignSelf: 'center',
                padding: 30,
              }}
              size="h3">
              Login
            </Text>
            <Text>Email</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your email"
              value={email}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={text => setEmail(text)}
            />

            <Text style={{ marginTop: 15 }}>Password</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your password"
              value={password}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
            />
            <Button
              text={loading ? 'Loading' : 'Continue'}
              onPress={() => {
                login();
              }}
              style={{
                marginTop: 20,
              }}
              color={themeColor.black}
              disabled={loading}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 15,
                justifyContent: 'center',
              }}>
              <Text size="md">Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  router.push('(auth)/register');
                }}>
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}>
                  Register here
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                justifyContent: 'center',
              }}>
              <TouchableOpacity onPress={() => {}}>
                <Text size="md" fontWeight="bold">
                  Forget password
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
              <TouchableOpacity
                onPress={() => {
                  isDarkmode ? setTheme('light') : setTheme('dark');
                }}>
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}>
                  {isDarkmode ? '☀️ light theme' : '🌑 dark theme'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
