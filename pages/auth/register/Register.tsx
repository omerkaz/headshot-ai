import { supabase } from '@/services/initSupabase';
import { colors } from '@/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkmode(!isDarkmode);
  };

  async function register() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
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
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.text, colors.accent2]}
        start={{ x: 0, y: 1.8 }}
        end={{ x: 1.8, y: 1 }}
        style={{ flex: 1 }}>
        <View>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                resizeMode="contain"
                style={{
                  height: 220,
                  width: 220,
                }}
                source={require('../../../assets/images/register.png')}
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
                Register
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

              <Text style={{ marginTop: 15 }}>Password</Text>
              <TextInput
                style={{
                  marginTop: 15,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 5,
                  padding: 10,
                }}
                placeholder="Enter your password"
                value={password}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
              />
              <Pressable
                onPress={register}
                style={{
                  marginTop: 20,
                  backgroundColor: '#000000',
                  padding: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                disabled={loading}>
                <Text style={{ color: '#FFFFFF' }}>
                  {loading ? 'Loading' : 'Create an account'}
                </Text>
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
      </LinearGradient>
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
