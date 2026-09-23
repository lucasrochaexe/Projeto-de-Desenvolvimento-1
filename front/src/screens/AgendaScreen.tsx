import { useState } from 'react';
import { MenuBar } from '../utilidade/MenuBar';
import { AgendaForm, AgendaItem } from '../utilidade/AgendaForm';
import { AgendaList } from '../utilidade/AgendaList';
import { ScreenBackground } from './ScreenBackground';

type AgendaScreenProps = {
  onBack: () => void;
};

export function AgendaScreen({ onBack }: AgendaScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);

  const handleAdd = () => setShowForm(true);

  const handleConfirmAdd = (newAgenda: AgendaItem) => {
    setAgendas([...agendas, newAgenda]);
    setShowForm(false);
  };

  return (
    <ScreenBackground>
      <MenuBar onBack={onBack} title="Agenda" showAdd={true} onAdd={handleAdd} />
      {showForm ? (
        <AgendaForm onConfirm={handleConfirmAdd} onCancel={() => setShowForm(false)} />
      ) : (
        <AgendaList agendas={agendas} />
      )}
    </ScreenBackground>
  );
}
