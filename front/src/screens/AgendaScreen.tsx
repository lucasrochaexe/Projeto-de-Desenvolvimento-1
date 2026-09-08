import { MenuBar } from '../utilidade/MenuBar';
import { ScreenBackground } from './ScreenBackground';

type AgendaScreenProps = {
  onBack: () => void;
};

export function AgendaScreen({ onBack }: AgendaScreenProps) {
  return (
    <ScreenBackground>
      <MenuBar onBack={onBack} title="Agenda" />
    </ScreenBackground>
  );
}