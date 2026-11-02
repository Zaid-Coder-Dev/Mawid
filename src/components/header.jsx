import './header.css';

const USERS = {
  participant: { initials: 'PA', name: 'Participant' },
  organisateur: { initials: 'OR', name: 'Organisateur' },
  administrateur: { initials: 'AD', name: 'Administrateur' },
};

export default function Header(props) {
  const user = USERS[props.role];

  return (
    <header className="header">
      <input
        className="header_search"
        type="search"
        placeholder="Rechercher un événement…"
      />

      <div className="header_user">
        <span className="header_avatar">{user.initials}</span>
        {user.name}
      </div>
    </header>
  );
}
