import { StatusBar } from 'expo-status-bar';
import { use, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import { styles } from './src/style';
import { LoginScreen } from './src/screens/LoginScreen';
import { Cadastrar } from './src/screens/Cadastrar';
import { SobreDexter } from './src/screens/SobreDexter';
import { MenuScreen } from './src/screens/MenuScreen';
import { RecuperarSenha } from './src/screens/RecuperarSenha';
import {
  configurarToqueNaNotificacao,
  obterExpoPushToken,
} from './src/services/notifications';
import {
  registrarErroNoServidor,
  registrarPushToken,
  verificarNotificacoesDiarias,
} from './src/services/api';
import * as SecureStore from 'expo-secure-store';
import { buscarTarefas, ApiError } from './src/services/api';


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
  const [tarefaNotificadaId, setTarefaNotificadaId] = useState<string | null>(null);
  const rotacao = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return configurarToqueNaNotificacao(setTarefaNotificadaId);
  }, []);

  /* Restaura o token de autenticação do usuário ao iniciar o aplicativo */
  useEffect(() => {
    async function restaurarLogin() {
      const tokenSalvo = await SecureStore.getItemAsync('dexter_auth_token');
      if (!tokenSalvo) {
        return;
      }
      try {
        await buscarTarefas(tokenSalvo);
        setToken(tokenSalvo);
        setIsLoggedIn(true);

        const expoPushToken = await obterExpoPushToken();
        await registrarPushToken(tokenSalvo, expoPushToken);
        await verificarNotificacoesDiarias(tokenSalvo);
      } catch (error) {
        if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        await SecureStore.deleteItemAsync('dexter_auth_token');
        setToken(null);
        setIsLoggedIn(false);
      } else {
        console.error('Não foi possível validar a sessão:', error);
      }
    }
  }


    restaurarLogin();
  }, []);

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
    onLogin={async (novoToken) => {
      setToken(novoToken);
      setIsLoggedIn(true);

      try {
        const expoPushToken = await obterExpoPushToken();
        await registrarPushToken(novoToken, expoPushToken);
        await verificarNotificacoesDiarias(novoToken);
      } catch (error) {
        console.error('Erro ao registrar notificações push:', error);

        try {
          await registrarErroNoServidor(novoToken, {
            mensagem: error instanceof Error
              ? error.message
              : String(error),
            onde: 'front/App.tsx:108 - registro de notificações push',
            stack: error instanceof Error ? error.stack : undefined,
          });
        } catch (erroAoRegistrar) {
          console.error('Erro ao salvar histórico do erro:', erroAoRegistrar);
        }
      }
    }}
    onRegister={() => setShowAbout(true)}
    onRecoverPassword={() => setShowRecoverPassword(true)}
  />
);
    }

    return (
      <MenuScreen
        token={token}
        tarefaNotificadaId={tarefaNotificadaId}
        onLogout={async () => {
          await SecureStore.deleteItemAsync('dexter_auth_token');


          setToken(null);
          setIsLoggedIn(false);
          setTarefaNotificadaId(null);
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
