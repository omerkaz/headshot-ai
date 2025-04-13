import { supabase } from '@/services/initSupabase';
import { typography } from '@/theme/typography';
import config from '@/utils/config';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

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
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      alert(`An error occurred during ${provider} login`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            Ready to hit the state of the art? Log in to get started.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="johndoe02@gmail.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
          />

          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>
            <Pressable onPress={() => router.push('/forgetPassword')}>
              <Text style={styles.forgotPasswordText}>Forgot Password</Text>
            </Pressable>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="#666"
              />
            </Pressable>
          </View>

          <View style={styles.rememberMeContainer}>
            <Pressable style={styles.checkbox}>{/* Add checkbox logic here */}</Pressable>
            <Text style={styles.rememberMeText}>Keep me signed in</Text>
          </View>

          <Pressable onPress={login} style={styles.signInButton} disabled={loading}>
            <Text style={styles.signInButtonText}>{loading ? 'Loading...' : 'Sign In'}</Text>
          </Pressable>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an Account? </Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>Sign up</Text>
            </Pressable>
          </View>

          <Pressable style={styles.googleButton} onPress={() => loginWithProvider('google')}>
            <View style={styles.googleButtonContent}>
              <AntDesign name="google" size={24} color="#000" />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.medium,
    color: '#000',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    marginBottom: 16,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.medium,
    color: '#5FE3C4',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
  },
  eyeIcon: {
    padding: 10,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
  },
  rememberMeText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: '#666',
  },
  signInButton: {
    height: 48,
    backgroundColor: '#5FE3C4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#559E8D',
    shadowRadius: 0,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 2,
    elevation: 5,
  },
  signInButtonText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semiBold,
    color: '#000',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: '#666',
  },
  registerLink: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semiBold,
    color: '#000',
  },
  googleButton: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    marginLeft: 12,
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.medium,
    color: '#000',
  },
});
