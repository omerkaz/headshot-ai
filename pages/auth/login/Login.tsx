import { supabase } from '@/services/initSupabase';
import { typography } from '@/theme/typography';
import config from '@/utils/config';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
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
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkmode(!isDarkmode);
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      iosClientId: config.google.iosClientId,
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
              source={require('../../../assets/images/login.png')}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? '#17171E' : '#FFFFFF',
            }}>
            <Text style={styles.headerText}>Login</Text>
            <Text style={styles.labelText}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={text => setEmail(text)}
            />

            <Text style={[styles.labelText, { marginTop: 15 }]}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity onPress={login} style={styles.loginButton} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
            </TouchableOpacity>

            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity
                onPress={() => {
                  router.push('/forgetPassword');
                }}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  router.push('/register');
                }}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.socialButtonsContainer}>
              <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => loginWithProvider('google')}
                disabled={loading}
                style={{ width: 192, height: 48 }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    backgroundColor: '#17171E',
  },
  lightContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    alignSelf: 'center',
    padding: 30,
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: '#000000',
  },
  labelText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.medium,
    color: '#000000',
  },
  input: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.base,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semiBold,
  },
  forgotPasswordContainer: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: '#000000',
  },
  registerContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: '#000000',
  },
  registerLink: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semiBold,
    color: '#000000',
  },
  socialButtonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
