import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import { styles } from './src/style';
import { LoginScreen } from './src/screens/LoginScreen';
import { Cadastrar } from './src/screens/Cadastrar';
import { SobreDexter } from './src/screens/SobreDexter';
import { MenuScreen } from './src/screens/MenuScreen';
import { RecuperarSenha } from './src/screens/RecuperarSenha';



const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';


const backgroundImage = require('./assets/2.png');
const logoImage = require('./assets/logoBranco - Copia.png');

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const logoScale = useRef(new Animated.Value(1.25)).current;
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showRecoverPassword, setShowRecoverPassword] = useState(false);
  const rotacao = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animacaoOrbita = Animated.loop(
      Animated.timing(rotacao, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animacaoOrbita.start();

    Animated.timing(logoScale, {
      toValue: 0.9,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const splashTimer = setTimeout(() => setShowSplash(false), 2000);
    return () => {
      clearTimeout(splashTimer);
      animacaoOrbita.stop();
    };
  }, [logoScale, rotacao]);

  if (!showSplash) {
    if (!isLoggedIn) {
if (showRegister) {
  return (
    <Cadastrar
      onCadastrar={() => {
        setShowRegister(false);
        setShowAbout(false);
      }}
      onCancelar={() => {
        setShowRegister(false);
        setShowAbout(false);
      }}
    />
  );
}

if (showAbout) {
  return (
    <SobreDexter
      onCriarConta={() => setShowRegister(true)}
      onVoltar={() => setShowAbout(false)}
    />
  );
}

if (showRecoverPassword) {
  return (
    <RecuperarSenha
      onVoltar={() => setShowRecoverPassword(false)}
    />
  );
}

return (
  <LoginScreen
    onLogin={(novoToken) => {
      setToken(novoToken);
      setIsLoggedIn(true);
    }}
    onRegister={() => setShowAbout(true)}
    onRecoverPassword={() => setShowRecoverPassword(true)}
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
          style={[
            styles.logoWrapper,
            { transform: [{ scale: logoScale }] },
          ]}
        >
          <View style={styles.logoContainer}>
            <View style={styles.orbita} />

            <Animated.View
              style={[
                styles.pontoOrbitaContainer,
                {
                  transform: [
                    {
                      rotate: rotacao.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.pontoOrbita} />
            </Animated.View>

            <Image
              source={logoImage}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        <Text style={styles.title}>Dexter</Text>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

