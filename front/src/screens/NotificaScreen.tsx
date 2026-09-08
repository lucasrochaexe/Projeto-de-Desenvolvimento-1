import { MenuBar } from '../utilidade/MenuBar';
import { ScreenBackground } from './ScreenBackground';

type NotificaScreenProps = {
  onBack: () => void;
};

export function NotificaScreen({ onBack }: NotificaScreenProps) {
  return (
    <ScreenBackground>
      <MenuBar onBack={onBack} title="Notificações" />
    </ScreenBackground>
  );
}