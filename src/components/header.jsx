import { Bell } from 'lucide-react';
import './header.css';

const USERS = {
  participant: { initials: 'PA', name: 'Participant' },
  organisateur: { initials: 'OR', name: 'Organisateur' },
  administrateur: { initials: 'AD', name: 'Administrateur' },
};

export default function Header({ role }) {
  const { initials, name } = USERS[role];

  return (
    <header className="header">
      <input
        className="header_search"
        type="search"
        title="Rechercher un événement"
        placeholder="Rechercher un événement…"
      />

      <div className="header_right">
        <button className="header_bell" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <div className="header_user">
          <span className="header_avatar">{initials}</span>
          {name}
        </div>
      </div>
    </header>
  );
}
