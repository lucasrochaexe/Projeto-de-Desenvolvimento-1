import { Image, Pressable, Text, View } from 'react-native';
import { menuBarStyles } from './menubarStyles';

type MenuBarProps = {
    onBack: () => void;
    title?: string;
};

export function MenuBar({ onBack, title = '' }: MenuBarProps) {
    return (
        <View style={menuBarStyles.container}>
            <Pressable
                accessibilityLabel="Voltar ao menu"
                accessibilityRole="button"
                onPress={onBack}
                style={({ pressed }) => [
                    menuBarStyles.backButton,
                    pressed && menuBarStyles.backButtonPressed,
                ]}
            >
                <Image
                    source={require('../img/return.png')}
                    style={menuBarStyles.icon}
                />
            </Pressable>
            <Text style={menuBarStyles.title}>{title}</Text>
            <View style={menuBarStyles.balanceSpace} />
        </View>
    );
}