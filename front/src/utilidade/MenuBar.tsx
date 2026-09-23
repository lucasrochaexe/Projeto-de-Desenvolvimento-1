import { Image, Pressable, Text, View } from 'react-native';
import { menuBarStyles } from './menubarStyles';

type MenuBarProps = {
    onBack: () => void;
    title?: string;
    onAdd?: () => void;
    showAdd?: boolean;
};

export function MenuBar({ onBack, title = '', onAdd, showAdd = false }: MenuBarProps) {
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
            <Text style={[menuBarStyles.title, showAdd && menuBarStyles.titleWithAdd]}>{title}</Text>
            <View style={menuBarStyles.balanceSpace} />
            {showAdd && (
                <Pressable
                    accessibilityLabel="Adicionar item"
                    accessibilityRole="button"
                    onPress={onAdd}
                    style={({ pressed }) => [
                        menuBarStyles.addButton,
                        pressed && menuBarStyles.addButtonPressed,
                    ]}
                >
                    <Text style={[menuBarStyles.addButtonText, {marginLeft: -40}]}>+</Text>
                </Pressable>
            )}
        </View>
    );
}