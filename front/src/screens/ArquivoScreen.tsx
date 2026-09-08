import { MenuBar } from '../utilidade/MenuBar';
import { ScreenBackground } from './ScreenBackground';

type ArquivoScreenProps = {
  onBack: () => void;
};

export function ArquivoScreen({ onBack }: ArquivoScreenProps) {
  return (
    <ScreenBackground>
      <MenuBar onBack={onBack} title="Arquivo" />
    </ScreenBackground>
  );
}