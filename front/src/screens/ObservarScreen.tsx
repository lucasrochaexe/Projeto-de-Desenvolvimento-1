import { useState } from 'react';
import { TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { MenuBar } from '../utilidade/MenuBar';
import { ScreenBackground } from './ScreenBackground';
import { screenStyles } from './screenStyles';


type ObservarScreenProps = {
  onBack: () => void;
};

export function ObservarScreen({ onBack }: ObservarScreenProps) {
  const [text, setText] = useState('');

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={screenStyles.keyboardContainer}
      >
        <MenuBar onBack={onBack} />

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
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}