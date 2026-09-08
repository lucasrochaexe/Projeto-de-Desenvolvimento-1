import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginStyles } from './loginStyles';

type LoginScreenProps = {
  onLogin: () => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obrigatorios', 'Informe seu email e sua senha para continuar.');
      return;
    }

    onLogin();
  };

  const handleRegister = () => {
    Alert.alert('Cadastro', 'A area de cadastro sera disponibilizada em breve.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={loginStyles.container}
    >
      <StatusBar style="light" />
      <Image source={require('../../assets/2.png')} style={loginStyles.background} resizeMode="cover" />

      <View style={loginStyles.content}>
        <Image source={require('../../assets/logoBranco - Copia.png')} style={loginStyles.logo} resizeMode="contain" />
        <Text style={loginStyles.heading}>Entrar</Text>
        <Text style={loginStyles.subtitle}>Acesse sua conta Dexter</Text>

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#9A9A9A"
          style={loginStyles.input}
          value={email}
        />
        <TextInput
          onChangeText={setPassword}
          placeholder="Senha"
          placeholderTextColor="#9A9A9A"
          secureTextEntry
          style={loginStyles.input}
          value={password}
        />

        <TouchableOpacity onPress={handleLogin} style={loginStyles.primaryButton}>
          <Text style={loginStyles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegister} style={loginStyles.secondaryButton}>
          <Text style={loginStyles.secondaryButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}