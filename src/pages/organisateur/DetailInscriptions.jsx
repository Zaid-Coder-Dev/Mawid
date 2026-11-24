import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import { SecondaryButton } from '../../components/buttons';
import { Popup } from '../../components/popups'; // Assurez-vous que le chemin est correct

const MONTHS_FR = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];

function formatDateBadge(isoDate) {
  if (!isoDate) return { day: '--', month: '---' };
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return { day: '--', month: '---' };
  return { day: String(d.getDate()), month: MONTHS_FR[d.getMonth()] };
}

function formatDateLongue(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Formate le temps écoulé de manière simplifiée (ex: "Hier, 18:42", "Il y a 3 h")
function formatRelativeTime(dateStr) {
  if (!dateStr) return '—';
  // Simulation simple pour l'exemple visuel
  return dateStr; 
}

const TABS = [
  { key: 'apercu', label: 'Aperçu', path: '' },
  { key: 'sessions', label: 'Sessions', path: '/sessions' },
  { key: 'participants', label: 'Participants', path: '/participants' },
  { key: 'inscriptions', label: 'Inscriptions', path: '/inscriptions' },
  { key: 'evaluations', label: 'Évaluations', path: '/evaluations' },
  { key: 'statistiques', label: 'Statistiques', path: '/statistiques' },
];

export default function DetailInscriptions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('inscriptions');
  const [activeFilter, setActiveFilter] = useState('atraiter'); // 'atraiter', 'waitlist', 'refusees', 'toutes'

  // État pour la modale d'annulation d'événement
  const [isCancelEventModalOpen, setIsCancelEventModalOpen] = useState(false);
  const [motifAnnulation, setMotifAnnulation] = useState('');

  const { evenements, inscriptions, utilisateurs, currentUser } = useSelector(
    (state) => state.evenements || {}
  );

  const event = evenements?.find((e) => Number(e.id) === Number(id));

  if (!event) {
    return (
      <AppShell role={currentUser?.role || 'organisateur'}>
        <div style={{ padding: '40px', textAlign: 'center', color: '#8a8694' }}>
          Événement introuvable.
        </div>
      </AppShell>
    );
  }

  // Filtrer les inscriptions pour cet événement
  const evtInscriptions = (inscriptions || []).filter(
    (i) => Number(i.evenementId) === Number(event.id)
  );

  // Enrichir avec les données utilisateur
  const enrichedInscriptions = evtInscriptions.map((insc) => {
    const user = (utilisateurs || []).find((u) => Number(u.id) === Number(insc.participantId)) || {};
    return {
      ...insc,
      prenom: user.prenom || 'Participant',
      nom: user.nom || '',
      email: user.email || '',
    };
  });

  // Statistiques
  const countAtraiter = enrichedInscriptions.filter((i) => i.statut === 'enattente').length;
  const countAcceptees = enrichedInscriptions.filter((i) => i.statut === 'confirmee').length;
  const countWaitlist = enrichedInscriptions.filter((i) => i.statut === 'liste_attente').length;
  const countRefusees = enrichedInscriptions.filter((i) => i.statut === 'refusee').length;

  const badge = formatDateBadge(event.dateDebut);

  // Filtrer la liste selon l'onglet actif
  const filteredList = enrichedInscriptions.filter((i) => {
    if (activeFilter === 'atraiter') return i.statut === 'enattente';
    if (activeFilter === 'waitlist') return i.statut === 'liste_attente';
    if (activeFilter === 'refusees') return i.statut === 'refusee';
    return true; // 'toutes'
  });

  // Handlers pour l'annulation d'événement
  const openCancelEventModal = () => {
    setIsCancelEventModalOpen(true);
    setMotifAnnulation('');
  };

  const closeCancelEventModal = () => {
    setIsCancelEventModalOpen(false);
    setMotifAnnulation('');
  };

  const confirmCancelEvent = () => {
    console.log(`Annulation de l'événement ${event.id} avec motif: ${motifAnnulation}`);
    closeCancelEventModal();
  };

  return (
    <AppShell role={currentUser?.role || 'organisateur'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: '#f7f4ed', minHeight: '100%', padding: '8px 4px 24px' }}>
        
        {/* Fil d'ariane + En-tête */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p 
            style={{ margin: 0, fontSize: '12px', color: '#8a8694', cursor: 'pointer' }}
            onClick={() => navigate('/organisateur/evenements')}
          >
            ← Mes événements
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Badge de date */}
              <div style={{ width: '56px', height: '64px', borderRadius: '12px', backgroundColor: '#dceef2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#366a75' }}>
                <strong style={{ fontSize: '20px', fontWeight: 800, color: '#1c1a22', lineHeight: 1 }}>{badge.day}</strong>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', marginTop: '2px' }}>{badge.month}</span>
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1b1922', letterSpacing: '-0.02em' }}>
                    {event.titre}
                  </h1>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ece9fc', color: '#5847d8', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>
                    <span style={{ fontSize: '8px' }}>●</span> Publié
                  </span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#7c7885' }}>
                  {formatDateLongue(event.dateDebut)} · {event.adresse} · {event.prix > 0 ? `${event.prix} MAD` : 'Gratuit'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <SecondaryButton text="Modifier" onClick={() => navigate(`/organisateur/evenements/${event.id}/modifier`)} />
              <SecondaryButton text="Annuler l'événement" onClick={openCancelEventModal} />
            </div>
          </div>
        </div>

        {/* Onglets de navigation */}
        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #ece8df', marginTop: '8px' }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.path) navigate(`/organisateur/evenements/${event.id}${tab.path}`);
                  else navigate(`/organisateur/evenements/${event.id}`);
                }}
                style={{
                  padding: '10px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #5847d8' : '2px solid transparent',
                  color: isActive ? '#5847d8' : '#8a8694',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
                {tab.key === 'participants' && ` (${enrichedInscriptions.length})`}
                {tab.key === 'inscriptions' && ` (${enrichedInscriptions.length})`}
              </button>
            );
          })}
        </div>

        {/* KPI Strip Inscriptions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>À traiter</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{countAtraiter}</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>demandes en attente</div>
          </div>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Acceptées</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{countAcceptees} / {event.capaciteMax}</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>{Math.max(0, event.capaciteMax - countAcceptees)} places libres</div>
          </div>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Liste d'attente</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{countWaitlist}</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>place proposée à la première</div>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Refusées</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{countRefusees}</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>&nbsp;</div>
          </div>
        </div>

        {/* Carte Principale */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', overflow: 'hidden', boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)' }}>
          
          {/* Barre de filtres */}
          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0ece3' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { key: 'atraiter', label: `À traiter (${countAtraiter})` },
                { key: 'waitlist', label: `Liste d'attente (${countWaitlist})` },
                { key: 'refusees', label: `Refusées (${countRefusees})` },
                { key: 'toutes', label: 'Toutes' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border: 'none',
                    backgroundColor: activeFilter === f.key ? '#1c1a22' : 'transparent',
                    color: activeFilter === f.key ? '#ffffff' : '#5f5b66',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: '1px solid #e6e2d8',
                backgroundColor: '#ffffff',
                color: '#1c1a22',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Tout accepter
            </button>
          </div>

          {/* Tableau */}
          <div style={{ padding: '0 24px' }}>
            {/* En-têtes */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr)',
                gap: '12px',
                padding: '14px 0',
                fontSize: '10px',
                fontWeight: 700,
                color: '#a8a3b0',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #f0ece3',
              }}
            >
              <div>Participant</div>
              <div>Réservation</div>
              <div>Demande</div>
              <div>Statut</div>
              <div style={{ textAlign: 'right' }}>Action</div>
            </div>

            {/* Lignes */}
            {filteredList.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8a8694', fontSize: '13px' }}>
                Aucune inscription dans cette catégorie.
              </div>
            ) : (
              filteredList.map((p) => {
                const initials = (p.prenom?.[0] || '?') + (p.nom?.[0] || '');
                
                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr)',
                      gap: '12px',
                      alignItems: 'center',
                      padding: '16px 0',
                      borderBottom: '1px solid #f0ece3',
                      fontSize: '13px',
                      color: '#1c1a22',
                    }}
                  >
                    {/* Participant */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: '#ece9fc',
                          color: '#5847d8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.prenom} {p.nom}
                        </div>
                        <div style={{ fontSize: '11px', color: '#8a8694', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.email}
                        </div>
                      </div>
                    </div>

                    {/* Réservation */}
                    <div style={{ fontSize: '12px', color: '#5f5b66' }}>
                      {p.statut === 'liste_attente' ? '—' : `RES-${String(p.id).padStart(4, '0')}`}
                    </div>

                    {/* Demande */}
                    <div style={{ fontSize: '12px', color: '#5f5b66' }}>
                      {p.dateDemande ? formatRelativeTime(p.dateDemande) : '—'}
                    </div>

                    {/* Statut */}
                    <div>
                      {p.statut === 'enattente' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f8f6f0', color: '#6f6b78', borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, border: '1px dashed #d3cec2' }}>
                          ○ En attente
                        </span>
                      )}
                      {p.statut === 'liste_attente' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f8f6f0', color: '#6f6b78', borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
                          ● Attente #{p.positionAttente || 1}
                        </span>
                      )}
                      {p.statut === 'confirmee' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#ece9fc', color: '#5847d8', borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
                          ✓ Accepté
                        </span>
                      )}
                      {p.statut === 'refusee' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fde8e8', color: '#b42318', borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
                          ✕ Refusé
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {p.statut === 'enattente' && (
                        <>
                          <button style={{ padding: '6px 16px', borderRadius: '999px', border: 'none', backgroundColor: '#5847d8', color: '#ffffff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                            Accepter
                          </button>
                          <button style={{ padding: '6px 16px', borderRadius: '999px', border: '1px solid #e6e2d8', backgroundColor: '#ffffff', color: '#5f5b66', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                            Refuser
                          </button>
                        </>
                      )}
                      {p.statut === 'liste_attente' && (
                        <button style={{ padding: '6px 16px', borderRadius: '999px', border: '1px solid #e6e2d8', backgroundColor: '#ffffff', color: '#1c1a22', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                          Proposer la place
                        </button>
                      )}
                      {p.statut === 'refusee' && (
                        <span style={{ fontSize: '11px', color: '#8a8694' }}>Motif envoyé</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= MODALE D'ANNULATION D'ÉVÉNEMENT (Popup) ================= */}
        {isCancelEventModalOpen && (
          <Popup
            title={`Annuler « ${event.titre} » ?`}
            body={`Les ${countAcceptees} participants et les ${countWaitlist} personnes en liste d'attente seront prévenus par e-mail, et les ${countAcceptees} paiements seront remboursés. Cette action est définitive.`}
            tone="danger"
            confirmLabel="Annuler l'événement"
            onCancel={closeCancelEventModal}
            onConfirm={confirmCancelEvent}
            textArea={true}
            textAreaLabel="Motif (envoyé aux participants)"
            textAreaValue={motifAnnulation}
            onTextAreaChange={(e) => setMotifAnnulation(e.target.value)}
          />
        )}

      </div>
    </AppShell>
  );
}