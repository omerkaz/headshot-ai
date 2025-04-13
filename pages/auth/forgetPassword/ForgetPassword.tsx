import { supabase } from '@/services/initSupabase';
import { typography } from '@/theme/typography';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
            style={[
              styles.imageContainer,
              { backgroundColor: isDarkmode ? '#17171E' : '#FFFFFF' },
            ]}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={require('../../../assets/images/forget.png')}
            />
          </View>
          <View
            style={[styles.formContainer, { backgroundColor: isDarkmode ? '#17171E' : '#FFFFFF' }]}>
            <Text style={styles.title}>Forget Password</Text>
            <Text style={styles.label}>Email</Text>
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
            <TouchableOpacity onPress={forget} style={styles.button} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Send email'}</Text>
            </TouchableOpacity>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  router.push('(auth)/login');
                }}>
                <Text style={styles.loginLink}>Login here</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.themeContainer}>
              <TouchableOpacity onPress={toggleTheme}>
                <Text style={styles.themeText}>
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
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 220,
    width: 220,
  },
  formContainer: {
    flex: 3,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    alignSelf: 'center',
    padding: 30,
    fontSize: typography.sizes['2xl'],
    fontFamily: typography.fonts.bold,
    color: '#000000',
  },
  label: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.medium,
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
  },
  button: {
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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'center',
  },
  loginText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: '#000000',
  },
  loginLink: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.bold,
    marginLeft: 5,
    color: '#000000',
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'center',
  },
  themeText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.bold,
    marginLeft: 5,
    color: '#000000',
  },
});
