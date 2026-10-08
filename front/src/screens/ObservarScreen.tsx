import { useState } from 'react';
import { TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { MenuBar } from '../utilidade/MenuBar';
import { ScreenBackground } from './ScreenBackground';
import { screenStyles } from './screenStyles';

import { ChatMensagens } from '../utilidade/ChatMensagens';
import { useAgente } from '../utilidade/useAgent';

type ObservarScreenProps = {
  onBack: () => void;
  token: string | null;
};

export function ObservarScreen({ onBack, token }: ObservarScreenProps) {
  const [text, setText] = useState('');
  const { mensagens, enviando, enviarTexto } = useAgente(token);

  const handleSend = () => {
    if (text.trim() === '' || enviando) return;

    enviarTexto(text);
    setText('');
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={screenStyles.keyboardContainer}
      >
        <MenuBar onBack={onBack} title="Escrever" />

        <View style={screenStyles.areaMensagens}>
          <ChatMensagens
            mensagens={mensagens}
            digitando={enviando}
            espacoInferior={180}
          />
        </View>

        <View style={screenStyles.messageContainer}>
          <TextInput
            multiline
            maxLength={500}
            onChangeText={setText}
            placeholder="Digite seu texto..."
            placeholderTextColor="#8A8178"
            style={screenStyles.textInput}
            textAlignVertical="top"
            value={text}
          />

          {/* Botão de enviar */}
          <TouchableOpacity
            style={[screenStyles.sendButton, enviando && { opacity: 0.5 }]}
            onPress={handleSend}
            disabled={enviando}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/icone 7.png')}
              style={screenStyles.sendButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}