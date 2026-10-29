import { NavLink } from 'react-router-dom';
import { Home, Ticket, CalendarCheck, Users, CreditCard, User, LogOut } from 'lucide-react';
import logo from '../assets/logo-mark.png';
import './sidebar.css';


const ITEMS = {
  participant: [
    { path: '', label: 'Tableau de bord', Icon: Home }, // path '' = the role's pade d'accueil 
    { path: '/evenements', label: 'Événements', Icon: Ticket },
    { path: '/reservations', label: 'Mes réservations', Icon: CalendarCheck },
    { path: '/profil', label: 'Profil', Icon: User },
  ],
  organisateur: [
    { path: '', label: 'Tableau de bord', Icon: Home },
    { path: '/evenements', label: 'Événements', Icon: Ticket },
    { path: '/profil', label: 'Profil', Icon: User },
  ],
  administrateur: [
    { path: '', label: 'Tableau de bord', Icon: Home },
    { path: '/evenements', label: 'Événements', Icon: Ticket },
    { path: '/utilisateurs', label: 'Utilisateurs', Icon: Users },
    { path: '/gestion', label: 'Gestion', Icon: CreditCard },
    { path: '/profil', label: 'Profil', Icon: User },
  ],
};

export default function Sidebar(props) {
  let role=props.role 

  return (
    <nav className="sidebar" aria-label="Navigation principale">
      <div className="sidebar_logo">
        <img src={logo} alt="" width="36" height="36" />
        <span className="sidebar_label">Mawid</span>
      </div>

      {ITEMS[role].map(({ path, label, Icon }) => (
        <NavLink
          key={label}
          to={`/${role}${path}`}

          className="sidebar_item">
          <Icon size={24} strokeWidth={1.6} />
          <span className="sidebar_label">{label}</span>
        </NavLink>
      ))}
      <NavLink
          key={'test'}
          to={`/test`}
    
          className="sidebar_item"
        >Components</NavLink>
      <NavLink to="/connexion" className="sidebar_item sidebar_logout">
        <LogOut size={24} />
        <span className="sidebar_label">Se déconnecter</span>
      </NavLink>
    </nav>
  );
}
