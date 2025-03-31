import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Layout, Text, TextInput, themeColor, useTheme } from 'react-native-rapi-ui';
import { supabase } from '../../../services/initSupabase';

export default function () {
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      iosClientId: '944022490155-ergkv14r7tt585kvvjmg4d3b6sucagp7.apps.googleusercontent.com',
    });
  }, []);

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

  async function loginWithProvider(provider: 'google' | 'apple') {
    setLoading(true);
    try {
      if (provider === 'google') {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        if (userInfo.data?.idToken) {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: userInfo.data.idToken,
          });
          if (error) {
            console.log('Google login error:', error);
            alert(`Error during Google login: ${error.message}`);
          } else {
            console.log('Google login success:', data);
            router.replace('/(main)/(tabs)/dashboard');
          }
        } else {
          throw new Error('No ID token present!');
        }
      }
      // Handle Apple sign-in similarly
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      alert(`An error occurred during ${provider} login`);
    } finally {
      setLoading(false);
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
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={() => loginWithProvider('google')}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />
            <Button
              text={loading ? 'Loading' : 'Continue with Apple'}
              onPress={() => loginWithProvider('apple')}
              style={{
                marginTop: 10,
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
