
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginStyles } from "./loginStyles";

type CadastrarProps = {
    onCadastrar: () => void;
    onCancelar: () => void;
};

export function Cadastrar({ onCadastrar, onCancelar }: CadastrarProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nome, setNome] = useState('');
    

    const hamdleCancelar = () => {
        Alert.alert('Cancelar Cadastro', 'Tem certeza que deseja cancelar o cadastro?', [
            { text: 'Não', style: 'cancel' },
            { text: 'Sim', onPress: onCancelar },
        ]);
    }

    const handleCadastrar = () => {
        if (!email.trim() || !password.trim() || !confirmPassword.trim() || !nome.trim()) {
            Alert.alert('Campos obrigatorios', 'Preencha todos os campos para continuar.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Senhas não coincidem', 'As senhas digitadas não coincidem. Por favor, tente novamente.');
            return;
        }
        onCadastrar();
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
                <Text style={loginStyles.heading}>Cadastrar</Text>
                <Text style={loginStyles.subtitle}>Crie sua conta Dexter</Text>
                                <TextInput
                    onChangeText={setNome}
                    placeholder="Nome - usuário"
                    placeholderTextColor="#9A9A9A"
                    style={loginStyles.input}
                    value={nome}
                />
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
                    secureTextEntry
                    onChangeText={setPassword}
                    placeholder="Senha"
                    placeholderTextColor="#9A9A9A"
                    style={loginStyles.input}
                    value={password}
                />
                <TextInput
                    secureTextEntry
                    onChangeText={setConfirmPassword}
                    placeholder="Confirmar Senha"
                    placeholderTextColor="#9A9A9A"
                    style={loginStyles.input}
                    value={confirmPassword}
                />
                <TouchableOpacity onPress={handleCadastrar} style={loginStyles.primaryButton}>
                    <Text style={loginStyles.primaryButtonText}>Cadastrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={hamdleCancelar} style={loginStyles.secondaryButton}>
                    <Text style={loginStyles.secondaryButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}