import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {loginStyles} from './loginStyles';
import {recuperarSenha} from '../services/api';


type RecuperarSenhaProps = {
    onVoltar: () => void;
};

export function RecuperarSenha({onVoltar}: RecuperarSenhaProps) {
    const [email, setEmail] = useState('');
    const [enviando, setEnviando] = useState(false);
    const rotacao = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animacaoOrbita = Animated.loop(
            Animated.timing(rotacao, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        );
        animacaoOrbita.start();
        return () => animacaoOrbita.stop();
    }, [rotacao]);
    async function handleRecuperarSenha() {
        if (!email.trim()) {
            Alert.alert('E-mail obrigatório', 'Informe o e-mail da sua conta.');
            return;
        }

        setEnviando(true);
        try {
            await recuperarSenha(email.trim());
            Alert.alert('Verifique seu e-mail', 'Se o endereço estiver cadastrado, enviaremos um link para criar uma nova senha.', [
                { text: 'Voltar para o login', onPress: onVoltar },
            ]);
        } catch (error) {
            Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível enviar o e-mail de recuperação de senha.');
        } finally {
            setEnviando(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={loginStyles.container2}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <StatusBar style="light" />
            <Image source={require('../../assets/2.png')} style={loginStyles.background} resizeMode="cover" />
            <View style={loginStyles.logoContainer}>
                <View style={loginStyles.orbita} />
                <Animated.View
                    style={[loginStyles.pontoOrbitaContainer, {
                        transform: [{ rotate: rotacao.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
                    }]}
                >
                    <View style={loginStyles.pontoOrbita} />
                </Animated.View>
                <Image source={require('../../assets/logoBranco - Copia.png')} style={loginStyles.logo} resizeMode="contain" />
            </View>
            <Text style={[loginStyles.heading, { marginLeft: 55 }]}>Recuperar senha</Text>
            <Text style={[loginStyles.subtitle, { marginLeft: 35, fontSize: 14 }]}>Enviaremos um link seguro para seu e-mail</Text>
            <TextInput
                placeholder="Digite seu e-mail"
                value={email}
                onChangeText={setEmail}
                style={[loginStyles.input, { width: '90%', marginLeft: 20, marginTop: 10 }]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TouchableOpacity
                style={[loginStyles.button, { width: '90%', marginLeft: 20, marginTop: 10 }]}
                disabled={enviando}
                onPress={handleRecuperarSenha}
            >
                <Text style={loginStyles.buttonText}>{enviando ? 'Enviando...' : 'Enviar link de recuperação'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onVoltar} style={loginStyles.secondaryButton}>
                <Text style={loginStyles.secondaryButtonText}>Voltar para o login</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}
