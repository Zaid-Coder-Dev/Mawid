import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Ticket, User, Info,
  CirclePlus, Users, ClipboardList, LogOut,FlaskConical 
} from 'lucide-react';

import logo from '../assets/logo-mark.png';
import './sidebar.css';

const links = {
  participant: [
    ['/participant/tableau-de-bord', 'Tableau de bord', LayoutDashboard],
    ['/evenements', 'Événements', CalendarDays],
    ['/participant/reservations', 'Mes réservations', Ticket],
    ['/participant/profil', 'Profil', User],
    ['/a-propos', 'À propos', Info],
  ],

  organisateur: [
    ['/organisateur/tableau-de-bord', 'Tableau de bord', LayoutDashboard],
    ['/organisateur/evenements', 'Mes événements', CalendarDays],
    ['/organisateur/evenements/nouveau', 'Créer un événement', CirclePlus],
    ['/organisateur/profil', 'Profil', User],
    ['/a-propos', 'À propos', Info],
  ],

  administrateur: [
    ['/admin/tableau-de-bord', 'Tableau de bord', LayoutDashboard],
    ['/admin/utilisateurs', 'Utilisateurs', Users],
    ['/evenements', 'Événements', CalendarDays],
    ['/admin/gestion/paiements', 'Gestion', ClipboardList],
    ['/admin/profil', 'Profil', User],
    ['/a-propos', 'À propos', Info],
  ],
};

export default function Sidebar(props) {


  return (
    <nav className="sidebar">

      <div className="sidebar_logo">
        <img src={logo} alt="" width="36" height="36" />
        <span className="sidebar_label">Mawid</span>
      </div>

      {links[props.role]?.map(([path, label, Icon]) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            isActive ? 'sidebar_item active' : 'sidebar_item'
          }
        >
          <Icon size={22} strokeWidth={1.7} />
          <span className="sidebar_label">{label}</span>
        </NavLink>
      ))}

      <Link to="/test" className="sidebar_item sidebar_logout">
        <FlaskConical size={22} strokeWidth={1.7}/>
        <span className="sidebar_label">Components</span>
      </Link>
      
      <Link to="/connexion" className="sidebar_item sidebar_logout">
        <LogOut size={22} strokeWidth={1.7} />
        <span className="sidebar_label">Se déconnecter</span>
      </Link>


    </nav>
  );
}