import { MenuBar } from '../utilidade/MenuBar';
import { ScreenBackground } from './ScreenBackground';

type OuvirScreenProps = {
  onBack: () => void;
};

export function OuvirScreen({ onBack }: OuvirScreenProps) {
  return (
    <ScreenBackground source={require('../img/FundoEscutando.png')}>
      <MenuBar onBack={onBack} />
    </ScreenBackground>
  );
}