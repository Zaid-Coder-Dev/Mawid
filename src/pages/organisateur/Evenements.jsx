import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import Card from '../../components/cards';
import { ProgressRing } from '../../components/Diagram';
import { SearchInput, Segmented } from '../../components/inputs';
import { PrimaryButton, SecondaryButton } from '../../components/buttons';
import { EmptyState } from '../../components/messages';
import { setEventFilter, setEventSearch, setViewMode } from '../../store/evenementActions';
import { utilisateursDemo } from '../../store/demo';

const VIEW_OPTIONS = [
  { value: 'cartes', label: 'Cartes' },
  { value: 'calendrier', label: 'Calendrier' },
];

const MONTHS_FR = [
  'JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN',
  'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC',
];

const MONTHS_FULL_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const DAYS_SHORT_FR = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
const DAYS_FULL_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const BANNER_PALETTES = [
  {
    bg: 'radial-gradient(#9ec5ce 1.2px, transparent 1.2px), linear-gradient(135deg, #d5eef2 0%, #c4e4ea 100%)',
    bgSize: '12px 12px, 100% 100%',
    catBg: '#e7f5f7',
    catColor: '#2c6572',
  },
  {
    bg: 'radial-gradient(#c6bddf 1.2px, transparent 1.2px), linear-gradient(135deg, #ece6f8 0%, #e1d9f4 100%)',
    bgSize: '12px 12px, 100% 100%',
    catBg: '#f4f0fc',
    catColor: '#5847d8',
  },
  {
    bg: 'radial-gradient(#bcc5da 1.2px, transparent 1.2px), linear-gradient(135deg, #e2e7f3 0%, #d4dce9 100%)',
    bgSize: '12px 12px, 100% 100%',
    catBg: '#eff2f9',
    catColor: '#3f5073',
  },
];

const STATUS_STYLES = {
  publie: { label: 'Publié', dot: '●', bg: '#e5e0f7', color: '#5847d8', border: 'none' },
  encours: { label: 'En cours', dot: '●', bg: '#fae3dc', color: '#c9492a', border: 'none' },
  brouillon: { label: 'Brouillon', dot: '○', bg: '#f8f6f0', color: '#6f6b78', border: '1px dashed #d3cec2' },
  complet: { label: 'Complet', dot: '●', bg: '#382a9e', color: '#ffffff', border: 'none' },
  termine: { label: 'Terminé', dot: '✓', bg: '#ece8df', color: '#5f5b66', border: 'none' },
  annule: { label: 'Annulé', dot: '✕', bg: '#fde8e8', color: '#b42318', border: 'none' },
};

function formatShortDate(isoStr) {
  if (!isoStr) return 'À VENIR';
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return isoStr.slice(0, 10);
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]}`;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

export default function Evenements() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ← AJOUT
  const { currentUser, evenements, inscriptions, filter, search, viewMode } = useSelector(
    (state) => state.evenements
  );
  const [hoveredTile, setHoveredTile] = useState(false);

  const today = useMemo(() => new Date(), []);
  const [calMode, setCalMode] = useState('mois');
  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()));

  const organizerId = currentUser?.id || utilisateursDemo.organisateur;
  const myEvents = evenements.filter((e) => Number(e.organisateurId) === Number(organizerId));

  const counts = {
    tous: myEvents.length,
    brouillon: myEvents.filter((e) => e.statut === 'brouillon').length,
    publie: myEvents.filter((e) => e.statut === 'publie').length,
    complet: myEvents.filter((e) => e.statut === 'complet').length,
    encours: myEvents.filter((e) => e.statut === 'encours').length,
    termine: myEvents.filter((e) => e.statut === 'termine').length,
    annule: myEvents.filter((e) => e.statut === 'annule').length,
  };

  const filterChips = [
    { key: 'tous', label: `Tous ${counts.tous}` },
    { key: 'brouillon', label: `Brouillon ${counts.brouillon}` },
    { key: 'publie', label: `Publié ${counts.publie}` },
    { key: 'complet', label: `Complet ${counts.complet}` },
    { key: 'encours', label: `En cours ${counts.encours}` },
    { key: 'termine', label: `Terminé ${counts.termine}` },
    { key: 'annule', label: `Annulé ${counts.annule}` },
  ];

  const filteredEvents = myEvents.filter((evt) => {
    const matchesFilter = filter === 'tous' || evt.statut === filter;
    const matchesSearch =
      !search.trim() ||
      evt.titre.toLowerCase().includes(search.toLowerCase()) ||
      evt.adresse.toLowerCase().includes(search.toLowerCase()) ||
      evt.categorie.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - startOffset);
    const days = [];
    for (let i = 0; i < 42; i++) {
      days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
    }
    return days;
  }, [currentDate]);

  const eventsByDay = useMemo(() => {
    const map = {};
    filteredEvents.forEach((evt) => {
      if (!evt.dateDebut) return;
      const d = new Date(evt.dateDebut);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(evt);
    });
    return map;
  }, [filteredEvents]);

  const monthEvents = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return filteredEvents
      .filter((evt) => {
        if (!evt.dateDebut) return false;
        const d = new Date(evt.dateDebut);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));
  }, [filteredEvents, currentDate]);

  const goPrev = () => {
    if (calMode === 'mois') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (calMode === 'semaine') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
    }
  };

  const goNext = () => {
    if (calMode === 'mois') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (calMode === 'semaine') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
    }
  };

  const goToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  const weekDays = useMemo(() => {
    const monday = getMonday(currentDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
    }
    return days;
  }, [currentDate]);

  const weekRangeLabel = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} – ${end.getDate()} ${MONTHS_FULL_FR[start.getMonth()]} ${start.getFullYear()}`;
    }
    return `${start.getDate()} ${MONTHS_FULL_FR[start.getMonth()]} – ${end.getDate()} ${MONTHS_FULL_FR[end.getMonth()]} ${end.getFullYear()}`;
  }, [weekDays]);

  const dayEvents = useMemo(() => {
    const key = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
    return eventsByDay[key] || [];
  }, [eventsByDay, currentDate]);

  const dayLabel = useMemo(() => {
    return `${DAYS_FULL_FR[(currentDate.getDay() + 6) % 7]} ${currentDate.getDate()} ${MONTHS_FULL_FR[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }, [currentDate]);

  const renderEventCard = (evt, idx) => {
    const evtInscr = inscriptions.filter((i) => Number(i.evenementId) === Number(evt.id)).length;
    const fillPct = evt.capaciteMax > 0 ? Math.min(100, Math.round((evtInscr / evt.capaciteMax) * 100)) : 0;
    const palette = BANNER_PALETTES[idx % BANNER_PALETTES.length];
    const st = STATUS_STYLES[evt.statut] || STATUS_STYLES.brouillon;

    return (
      <div key={evt.id} style={{ backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #ece8df', overflow: 'hidden', boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundImage: palette.bg, backgroundSize: palette.bgSize, padding: '14px 16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '116px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: palette.catBg, color: palette.catColor, padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>{evt.categorie}</span>
            <span style={{ backgroundColor: st.bg, color: st.color, border: st.border, padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '9px' }}>{st.dot}</span>{st.label}
            </span>
          </div>
          <div style={{ marginTop: '18px', fontSize: '21px', fontWeight: 800, color: '#1b1922', letterSpacing: '-0.02em' }}>{formatShortDate(evt.dateDebut)}</div>
        </div>
        <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#1b1922' }}>{evt.titre}</h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#8a8694' }}>{evt.adresse}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                <div style={{ transform: 'scale(0.45)', transformOrigin: 'top left', width: '76px', height: '76px' }}>
                  <ProgressRing value={fillPct} label="" />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1b1922' }}>{evtInscr} / {evt.capaciteMax} inscrits</div>
                <div style={{ fontSize: '11px', color: '#8a8694' }}>{evt.prix > 0 ? `${evt.prix} MAD` : 'Gratuit'}</div>
              </div>
            </div>
            <SecondaryButton text="Gérer" onClick={() => navigate(`/organisateur/evenements/${evt.id}`)} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppShell role={currentUser?.role || 'organisateur'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#f7f4ed', minHeight: '100%', padding: '8px 4px 24px' }}>
        
        {/* En-tête de page */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#1b1922', letterSpacing: '-0.02em' }}>Mes événements</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#7c7885' }}>{myEvents.length} événements</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Segmented options={VIEW_OPTIONS} value={viewMode} onChange={(val) => dispatch(setViewMode(val))} />
            <PrimaryButton text="+ Créer un événement" onClick={() => navigate('/organisateur/evenements/nouveau')} />
          </div>
        </div>

        {/* Barre de filtres */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {filterChips.map((chip) => {
              const active = filter === chip.key;
              return (
                <button key={chip.key} type="button" onClick={() => dispatch(setEventFilter(chip.key))} style={{ padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: active ? 600 : 500, cursor: 'pointer', backgroundColor: active ? '#1b1922' : '#ffffff', color: active ? '#ffffff' : '#5e5a66', border: active ? '1px solid #1b1922' : '1px solid #e6e2d8', transition: 'all 0.15s ease' }}>
                  {chip.label}
                </button>
              );
            })}
          </div>
          <div style={{ width: '220px' }}>
            <SearchInput placeholder="Rechercher..." value={search} onChange={(e) => dispatch(setEventSearch(e.target.value))} />
          </div>
        </div>

        {/* Contenu principal */}
        {filteredEvents.length === 0 ? (
          <EmptyState title="Aucun événement trouvé" text="Aucun événement ne correspond à ce filtre ou à cette recherche." action={<PrimaryButton text="+ Créer un événement" onClick={() => navigate('/organisateur/evenements/nouveau')} />} />
        ) : viewMode === 'cartes' ? (
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
            {filteredEvents.map((evt, idx) => renderEventCard(evt, idx))}
            <div onClick={() => navigate('/organisateur/evenements/nouveau')} onMouseEnter={() => setHoveredTile(true)} onMouseLeave={() => setHoveredTile(false)} style={{ borderRadius: '18px', border: hoveredTile ? '1.5px dashed #5847d8' : '1.5px dashed #dcd7cc', backgroundColor: hoveredTile ? '#f3f0fc' : '#f9f7f2', minHeight: '235px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.15s ease' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#e7e2f8', color: '#5847d8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}>+</div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#5f5b66' }}>Créer un événement</span>
            </div>
          </div>

        ) : (
          
          <div style={{ display: 'grid', gridTemplateColumns: calMode === 'jour' ? '1fr' : 'minmax(0, 1fr) 280px', gap: '18px', alignItems: 'start' }}>
            
            <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #ece8df', padding: '18px 20px', boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)', minHeight: '500px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1b1922' }}>
                    {calMode === 'mois' && `${MONTHS_FULL_FR[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                    {calMode === 'semaine' && weekRangeLabel}
                    {calMode === 'jour' && dayLabel}
                  </h2>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button type="button" onClick={goPrev} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: '#f3f0e9', color: '#5f5b66', cursor: 'pointer', fontSize: '14px' }}>‹</button>
                    <button type="button" onClick={goNext} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: '#f3f0e9', color: '#5f5b66', cursor: 'pointer', fontSize: '14px' }}>›</button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', backgroundColor: '#f3f0e9', borderRadius: '999px', padding: '3px' }}>
                    {['Mois', 'Semaine', 'Jour'].map((mode) => {
                      const active = calMode === mode.toLowerCase();
                      return (
                        <button key={mode} type="button" onClick={() => setCalMode(mode.toLowerCase())} style={{ padding: '5px 12px', borderRadius: '999px', border: 'none', fontSize: '11px', fontWeight: active ? 700 : 500, cursor: 'pointer', backgroundColor: active ? '#1b1922' : 'transparent', color: active ? '#ffffff' : '#5e5a66' }}>
                          {mode}
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={goToday} style={{ padding: '6px 14px', borderRadius: '999px', border: '1px solid #e6e2d8', backgroundColor: '#ffffff', color: '#5e5a66', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    Aujourd'hui
                  </button>
                </div>
              </div>

              {calMode === 'mois' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '4px', marginBottom: '6px' }}>
                    {DAYS_SHORT_FR.map((d) => (
                      <div key={d} style={{ fontSize: '10px', fontWeight: 700, color: '#a8a3b0', textAlign: 'center', padding: '4px 0', letterSpacing: '0.04em' }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '4px' }}>
                    {calendarDays.map((day, i) => {
                      const inMonth = day.getMonth() === currentDate.getMonth();
                      const isToday = isSameDay(day, today);
                      const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
                      const dEvents = eventsByDay[key] || [];
                      return (
                        <div key={i} style={{ minHeight: '72px', borderRadius: '10px', padding: '6px 6px 4px', border: isToday ? '1.5px solid #5847d8' : '1px solid #f0ece3', backgroundColor: inMonth ? '#ffffff' : '#faf8f4', display: 'flex', flexDirection: 'column', gap: '4px', opacity: inMonth ? 1 : 0.55 }}>
                          <div style={{ fontSize: '11px', fontWeight: isToday ? 700 : 500, color: isToday ? '#5847d8' : '#7c7885', textAlign: 'left' }}>{day.getDate()}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflow: 'hidden' }}>
                            {dEvents.slice(0, 2).map((evt) => {
                              const st = STATUS_STYLES[evt.statut] || STATUS_STYLES.brouillon;
                              return (
                                <button key={evt.id} type="button" onClick={() => navigate(`/organisateur/evenements/${evt.id}`)} title={evt.titre} style={{ textAlign: 'left', border: 'none', cursor: 'pointer', backgroundColor: st.bg, color: st.color, borderRadius: '6px', padding: '3px 6px', fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', borderLeft: `3px solid ${st.color}` }}>
                                  {evt.titre}
                                </button>
                              );
                            })}
                            {dEvents.length > 2 && <span style={{ fontSize: '9px', color: '#8a8694', paddingLeft: '2px' }}>+{dEvents.length - 2}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {calMode === 'semaine' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', borderTop: '1px solid #f0ece3', borderLeft: '1px solid #f0ece3', borderRadius: '8px', overflow: 'hidden' }}>
                  {weekDays.map((day, i) => {
                    const isToday = isSameDay(day, today);
                    const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
                    const dEvents = eventsByDay[key] || [];
                    
                    return (
                      <div key={i} style={{ borderRight: '1px solid #f0ece3', borderBottom: '1px solid #f0ece3', minHeight: '380px', display: 'flex', flexDirection: 'column', backgroundColor: isToday ? '#fcfaff' : '#ffffff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 10px', borderBottom: '1px solid #f0ece3' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#a8a3b0', letterSpacing: '0.04em' }}>{DAYS_SHORT_FR[i]}</span>
                          <span style={{ fontSize: '12px', fontWeight: isToday ? 800 : 600, color: isToday ? '#ffffff' : '#5e5a66', backgroundColor: isToday ? '#5847d8' : 'transparent', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                            {day.getDate()}
                          </span>
                        </div>
                        
                        <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                          {dEvents.length === 0 ? (
                            <span style={{ fontSize: '11px', color: '#c0bcc6', fontStyle: 'italic' }}>Aucun événement</span>
                          ) : (
                            dEvents.map((evt) => {
                              const st = STATUS_STYLES[evt.statut] || STATUS_STYLES.brouillon;
                              const evtInscr = inscriptions.filter((ins) => Number(ins.evenementId) === Number(evt.id)).length;
                              return (
                                <div key={evt.id} onClick={() => navigate(`/organisateur/evenements/${evt.id}`)} style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #ece8df', padding: '8px', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}>
                                  <div style={{ marginBottom: '6px' }}>
                                    <span style={{ backgroundColor: '#e7f5f7', color: '#2c6572', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>{evt.categorie}</span>
                                  </div>
                                  <h4 style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 700, color: '#1b1922', lineHeight: 1.2 }}>{evt.titre}</h4>
                                  <p style={{ margin: '0 0 8px', fontSize: '10px', color: '#8a8694' }}>{evt.adresse}</p>
                                  
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ backgroundColor: st.bg, color: st.color, border: st.border, padding: '2px 6px', borderRadius: '999px', fontSize: '9px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                      <span style={{ fontSize: '7px' }}>{st.dot}</span>{st.label}
                                    </span>
                                  </div>
                                  
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#5f5b66', fontWeight: 600 }}>
                                    <ProgressRing value={evt.capaciteMax > 0 ? Math.min(100, (evtInscr / evt.capaciteMax) * 100) : 0} size={14} stroke={2} showLabel={false} />
                                    <span>{evtInscr} / {evt.capaciteMax} inscrits</span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {calMode === 'jour' && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '10px 0' }}>
                  {dayEvents.length === 0 ? (
                    <EmptyState title="Aucun événement" text="Aucun événement prévu pour ce jour." />
                  ) : (
                    <div style={{ width: '320px' }}>
                      {dayEvents.map((evt, idx) => renderEventCard(evt, idx))}
                    </div>
                  )}
                </div>
              )}

            </div>

            {calMode === 'mois' && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #ece8df', padding: '18px 18px', boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>Ce mois-ci</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {monthEvents.length === 0 ? (
                    <p style={{ fontSize: '12px', color: '#8a8694', margin: 0 }}>Aucun événement ce mois-ci.</p>
                  ) : (
                    monthEvents.map((evt) => {
                      const st = STATUS_STYLES[evt.statut] || STATUS_STYLES.brouillon;
                      return (
                        <button key={evt.id} type="button" onClick={() => navigate(`/organisateur/evenements/${evt.id}`)} style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: '#5847d8' }}>{formatShortDate(evt.dateDebut)}</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1b1922' }}>{evt.titre}</span>
                          <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: st.bg, color: st.color, border: st.border, borderRadius: '999px', padding: '2px 8px', fontSize: '10px', fontWeight: 600 }}>
                            <span style={{ fontSize: '8px' }}>{st.dot}</span>{st.label}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
            
          </div>
        )}
      </div>
    </AppShell>
  );
}