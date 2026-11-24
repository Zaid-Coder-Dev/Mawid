import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEventSearch } from '../store/evenementActions'; // Ajustez le chemin
import './header.css';

const USERS = {
  participant: { initials: 'PA', name: 'Participant' },
  organisateur: { initials: 'OR', name: 'Organisateur' },
  administrateur: { initials: 'AD', name: 'Administrateur' },
  visiteur: { initials: 'VI', name: 'Visiteur' },
};

export default function Header(props) {
  const user = USERS[props.role || 'visiteur'];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // On récupère la recherche et les événements depuis Redux
  const { search, evenements } = useSelector((state) => state.evenements || {});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filtrer les événements selon la recherche
  const filteredEvents = search.trim().length > 0
    ? evenements?.filter(evt => 
        evt.titre.toLowerCase().includes(search.toLowerCase()) ||
        evt.ville.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5) // On affiche max 5 résultats
    : [];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    dispatch(setEventSearch(value));
    setIsDropdownOpen(true);
  };

  const handleEventClick = (id) => {
    setIsDropdownOpen(false);
    dispatch(setEventSearch('')); // On vide la recherche après le clic
    navigate(`/organisateur/evenements/${id}`); // Redirection
  };

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header_search-container" ref={dropdownRef} style={{ position: 'relative' }}>
        <input
          className="header_search"
          type="search"
          placeholder="Rechercher un événement…"
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownOpen(true)}
        />
        
        {/* Liste déroulante des résultats */}
        {isDropdownOpen && filteredEvents.length > 0 && (
          <ul className="header_search-dropdown">
            {filteredEvents.map(evt => (
              <li key={evt.id} onClick={() => handleEventClick(evt.id)}>
                <div style={{ fontWeight: 600 }}>{evt.titre}</div>
                <div style={{ fontSize: '11px', color: '#8a8694' }}>
                  {evt.ville} · {new Date(evt.dateDebut).toLocaleDateString('fr-FR')}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Message si aucun résultat */}
        {isDropdownOpen && search.trim().length > 0 && filteredEvents.length === 0 && (
          <ul className="header_search-dropdown">
            <li style={{ color: '#8a8694', cursor: 'default' }}>Aucun événement trouvé.</li>
          </ul>
        )}
      </div>

      <div className="header_user">
        <span className="header_avatar">{user.initials}</span>
        {user.name}
      </div>
    </header>
  );
}