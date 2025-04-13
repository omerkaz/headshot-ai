import { supabase } from '@/services/initSupabase';
import { typography } from '@/theme/typography';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function register() {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (!error && !data.user) {
      setLoading(false);
      alert('Check your email for the login link!');
    }
    if (error) {
      setLoading(false);
      alert(error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>
            Your digital presence is your leverage. Transform it with AI.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
          />

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

          <Text style={styles.label}>Password</Text>
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

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="********"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}>
              <Ionicons
                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="#666"
              />
            </Pressable>
          </View>

          <Pressable onPress={register} style={styles.signUpButton} disabled={loading}>
            <Text style={styles.signUpButtonText}>{loading ? 'Loading...' : 'Sign Up'}</Text>
          </Pressable>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Have an Account? </Text>
            <Pressable onPress={() => router.push('(auth)/login')}>
              <Text style={styles.signInLink}>Sign in</Text>
            </Pressable>
          </View>

          <Pressable style={styles.googleButton}>
            <View style={styles.googleButtonContent}>
              <AntDesign name="google" size={24} color="#000" />
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.googleButton, styles.appleButton]}>
            <View style={styles.googleButtonContent}>
              <AntDesign name="apple1" size={24} color="#000" />
              <Text style={styles.googleButtonText}>Sign up with Apple</Text>
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
    marginBottom: 10,
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
  signUpButton: {
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
  signUpButtonText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.semiBold,
    color: '#000',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  signInText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: '#666',
  },
  signInLink: {
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
  appleButton: {
    marginTop: 12,
  },
});
