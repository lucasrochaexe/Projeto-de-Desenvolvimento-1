import { ImageBackground, ImageSourcePropType } from 'react-native';
import { screenStyles } from './screenStyles';

type ScreenBackgroundProps = {
    children: React.ReactNode;
    source?: ImageSourcePropType;
};

export function ScreenBackground({ children, source }: ScreenBackgroundProps) {
    return (
        <ImageBackground
        source={source ?? require('../../assets/fundo.png')}
        style={screenStyles.container}
        imageStyle={screenStyles.backgroundImage}
        resizeMode="cover"
        >
        {children}
        </ImageBackground>
    );
}