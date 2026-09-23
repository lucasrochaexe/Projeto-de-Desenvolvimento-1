import { MenuBar } from '../utilidade/MenuBar';
import { ScreenBackground } from './ScreenBackground';
import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';

type OuvirScreenProps = {
  onBack: () => void;
  falar: () => void;
};

export function OuvirScreen({ onBack, falar }: OuvirScreenProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
  }

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    falar();
  }

  return (
    <ScreenBackground source={require('../img/FundoEscutando.png')}>
      <MenuBar onBack={onBack} />
      <Animated.View style={[styles.micButton, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
          <Image source={require('../img/falar.png')} style={styles.micIcon} />
        </TouchableWithoutFeedback>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  micButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  micIcon: {
    width: 55,
    height: 50,
    resizeMode: 'contain',
  },
});
