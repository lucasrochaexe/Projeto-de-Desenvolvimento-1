import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginStyles } from './loginStyles';
import { fazerLogin } from '../services/api';

type LoginScreenProps = {
  onLogin: (token: string) => void;
  onRegister: () => void;
};


export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);

  useEffect(() => {
    async function loadSavedLogin() {
      const savedEmail = await SecureStore.getItemAsync('dexter_login_email');
      const savedPassword = await SecureStore.getItemAsync('dexter_login_password');

      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberLogin(true);
      }
    }

    loadSavedLogin();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Campos obrigatorios',
        'Informe seu email e sua senha para continuar.'
      );
      return;
    }

    try {
      const resposta = await fazerLogin(email.trim(), password);

      if (rememberLogin) {
        await SecureStore.setItemAsync('dexter_login_email', email.trim());
        await SecureStore.setItemAsync('dexter_login_password', password);
      } else {
        await SecureStore.deleteItemAsync('dexter_login_email');
        await SecureStore.deleteItemAsync('dexter_login_password');
      }

      onLogin(resposta.token);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : 'Não foi possível realizar o login';

      Alert.alert('Erro no login', mensagem);
    }
};

  const handleRegister = () => {
    onRegister();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
      style={loginStyles.container}
    >
      <StatusBar style="light" />
      <Image source={require('../../assets/2.png')} style={loginStyles.background} resizeMode="cover" />

      <ScrollView
        contentContainerStyle={loginStyles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
        <View style={loginStyles.passwordWrapper}>
          <TextInput
            onChangeText={setPassword}
            placeholder="Senha"
            placeholderTextColor="#9A9A9A"
            secureTextEntry={!showPassword}
            style={loginStyles.passwordInput}
            value={password}
          />
          <Pressable
            accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            onPress={() => setShowPassword((visible) => !visible)}
            style={loginStyles.passwordToggle}
          >
            <Text style={loginStyles.passwordToggleText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => setRememberLogin((remembered) => !remembered)} style={loginStyles.rememberRow}>
          <View style={[loginStyles.checkbox, rememberLogin && loginStyles.checkboxSelected]}>
            {rememberLogin && <Text style={loginStyles.checkboxMark}>✓</Text>}
          </View>
          <Text style={loginStyles.rememberText}>Lembrar meus dados</Text>
        </Pressable>

        <TouchableOpacity onPress={handleLogin} style={loginStyles.primaryButton}>
          <Text style={loginStyles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegister} style={loginStyles.secondaryButton}>
          <Text style={loginStyles.secondaryButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}