import { MenuBar } from "../utilidade/MenuBar";
import { ChatMensagens } from "../utilidade/ChatMensagens";
import { useAgente } from "../utilidade/useAgent";
import { ScreenBackground } from "./ScreenBackground";
import React, { useRef, useState } from "react";
import {
  Alert,
  Text,
  Animated,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  View,
} from "react-native";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";

type OuvirScreenProps = {
  onBack: () => void;
  token: string | null;
};

type Estado = "parado" | "gravando" | "enviando";

export function OuvirScreen({ onBack, token }: OuvirScreenProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const gravador = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const gravandoRef = useRef(false);

  const [estado, setEstado] = useState<Estado>("parado");
  const { mensagens, enviando, enviarAudio } = useAgente(token);

  async function pedirPermissao() {
    const { granted } = await AudioModule.requestRecordingPermissionsAsync();
    return granted;
  }

  async function iniciarGravacao() {
    if (!(await pedirPermissao())) {
      Alert.alert(
        "Permissão negada",
        "Libere o microfone nas configurações para falar com o Dexter.",
      );
      return;
    }

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await gravador.prepareToRecordAsync();
    gravador.record();
    gravandoRef.current = true;
    setEstado("gravando");
  }

  async function finalizarGravacao() {
    if (!gravandoRef.current) {
      return null;
    }

    gravandoRef.current = false;
    await gravador.stop();
    return gravador.uri;
  }

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
    iniciarGravacao().catch(() => {
      setEstado("parado");
      Alert.alert(
        "Erro",
        "Não foi possível iniciar a gravação. Tente novamente.",
      );
    })
  };

  const onPressOut = async () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    try {
      const uri = await finalizarGravacao();
      if (!uri) {
        setEstado("parado");
        return;
      }

      setEstado("enviando");
      // Transcreve, conversa com o agente e salva a tarefa quando confirmada.
      await enviarAudio(uri);
    } catch {
      Alert.alert("Erro", "Não foi possível finalizar a gravação. Tente novamente.");
    } finally {
      setEstado("parado");
    }
  };

  const legenda =
    estado === 'gravando' ? 'Gravando... solte para enviar'
    : estado === 'enviando' ? 'Enviando para o Dexter...'
    : 'Segure o botão para falar';

  return (
    <ScreenBackground source={require("../img/FundoEscutando.png")}>
      <MenuBar onBack={onBack} title="Falar" />

      <View style={styles.conversa}>
        <ChatMensagens
          mensagens={mensagens}
          digitando={enviando}
          espacoInferior={190}
        />
      </View>
      <Text style={styles.legenda}>{legenda}</Text>

      <Animated.View
        style={[styles.micButton, { transform: [{ scale: scaleAnim }] }]}
      >
        <TouchableWithoutFeedback
          disabled={estado === "enviando" || enviando}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <Image source={require("../img/falar.png")} style={styles.micIcon} />
        </TouchableWithoutFeedback>
      </Animated.View>

      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>← Segure para falar</Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  micButton: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
  micIcon: {
    width: 55,
    height: 50,
    resizeMode: "contain",
  },
  legenda: {
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 14,
  },
  conversa: {
    flex: 1,
    marginTop: 24,
  },
  hintContainer: {
  position: "absolute",
  bottom: 90,
  left: "60%", // ajuste conforme layout
},
hintText: {
  color: "#a4a2a2",
  fontSize: 10,
  marginLeft: 25,
  marginBottom: 5,
},
});