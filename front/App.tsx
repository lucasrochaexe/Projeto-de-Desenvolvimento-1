import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { styles } from './src/style';
import { LoginScreen } from './src/screens/LoginScreen';
import { Cadastrar } from './src/screens/Cadastrar';
import { MenuScreen } from './src/screens/MenuScreen';


const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';


const backgroundImage = require('./assets/2.png');
const logoImage = require('./assets/logoBranco - Copia.png');

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const logoScale = useRef(new Animated.Value(1.25)).current;
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    Animated.timing(logoScale, {
      toValue: 0.9,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const splashTimer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(splashTimer);
  }, [logoScale]);

  if (!showSplash) {
    if (!isLoggedIn) {
      if (showRegister) {
        return <Cadastrar 
        onCadastrar={() => setShowRegister(false)}
        onCancelar={() => setShowRegister(false)} />;
      }

      return (

        <LoginScreen
            onLogin={(novoToken) => {
              setToken(novoToken);
              setIsLoggedIn(true);
            }}
            onRegister={() => setShowRegister(true)}
          /> 
      );
    }

    return (
      <MenuScreen
        token={token}
        onLogout={() => {
          setToken(null);
          setIsLoggedIn(false);
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Image source={backgroundImage} style={styles.background} resizeMode="cover" />

      <View style={styles.content}>
        <Animated.View
          style={[styles.logoWrapper, { transform: [{ scale: logoScale }] }]}
        >
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        </Animated.View>
        <Text style={styles.title}>Dexter</Text>
      </View>

      <StatusBar style="light" />
    </View>
  );
}




