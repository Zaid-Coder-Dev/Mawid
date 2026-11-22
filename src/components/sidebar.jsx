import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  User,
  Info,
  CirclePlus,
  Users,
  ClipboardList,
  LogOut,
  LogIn,
  UserPlus,
  FlaskConical,
} from 'lucide-react';

import logo from '../assets/logo-mark.png';
import './sidebar.css';

const links = {
  visiteur: [
    { path: '/evenements', label: 'Événements', Icon: CalendarDays },
    { path: '/a-propos', label: 'À propos', Icon: Info },
    { path: '/connexion', label: 'Connexion', Icon: LogIn },
    { path: '/creer-un-compte', label: 'Créer un compte', Icon: UserPlus },
  ],
  participant: [
    { path: '/participant/tableau-de-bord', label: 'Tableau de bord', Icon: LayoutDashboard },
    { path: '/evenements', label: 'Événements', Icon: CalendarDays },
    { path: '/participant/reservations', label: 'Mes réservations', Icon: Ticket },
    { path: '/participant/profil', label: 'Profil', Icon: User },
    { path: '/a-propos', label: 'À propos', Icon: Info },
  ],
  organisateur: [
    { path: '/organisateur/tableau-de-bord', label: 'Tableau de bord', Icon: LayoutDashboard },
    { path: '/organisateur/evenements', label: 'Mes événements', Icon: CalendarDays },
    { path: '/organisateur/evenements/nouveau', label: 'Créer un événement', Icon: CirclePlus },
    { path: '/organisateur/profil', label: 'Profil', Icon: User },
    { path: '/a-propos', label: 'À propos', Icon: Info },
  ],
  administrateur: [
    { path: '/admin/tableau-de-bord', label: 'Tableau de bord', Icon: LayoutDashboard },
    { path: '/admin/utilisateurs', label: 'Utilisateurs', Icon: Users },
    { path: '/evenements', label: 'Événements', Icon: CalendarDays },
    { path: '/admin/gestion/paiements', label: 'Gestion', Icon: ClipboardList },
    { path: '/admin/profil', label: 'Profil', Icon: User },
    { path: '/a-propos', label: 'À propos', Icon: Info },
  ],
};

export default function Sidebar(props) {
  const role = props.role || 'visiteur';

  return (
    <nav className="sidebar">

      <div className="sidebar_logo">
        <img src={logo} alt="" width="36" height="36" />
        <span className="sidebar_label">Mawid</span>
      </div>

      {links[role].map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={(state) => (state.isActive ? 'sidebar_item active' : 'sidebar_item')}
        >
          <link.Icon size={22} strokeWidth={1.7} />
          <span className="sidebar_label">{link.label}</span>
        </NavLink>
      ))}

      <Link to="/test" className="sidebar_item sidebar_bottom">
        <FlaskConical size={22} strokeWidth={1.7} />
        <span className="sidebar_label">Components</span>
      </Link>
      
      {props.role && (
        <Link to="/connexion" className="sidebar_item">
          <LogOut size={22} strokeWidth={1.7} />
          <span className="sidebar_label">Se déconnecter</span>
        </Link>
      )}

    </nav>
  );
}