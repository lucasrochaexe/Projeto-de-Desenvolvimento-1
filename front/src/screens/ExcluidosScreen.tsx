import { MenuBar } from '../utilidade/MenuBar';
import { ScreenBackground } from './ScreenBackground';

type ExcluidosScreenProps = {
  onBack: () => void;
};

export function ExcluidosScreen({ onBack }: ExcluidosScreenProps) {
  return (
    <ScreenBackground>
      <MenuBar onBack={onBack} title="Itens Excluídos" />
    </ScreenBackground>
  );
}