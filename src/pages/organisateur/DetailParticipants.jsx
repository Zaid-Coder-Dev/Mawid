import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import { SearchInput } from '../../components/inputs';
import { updateParticipantPresence, removeParticipant } from '../../store/evenementActions';
import { Popup } from '../../components/popups'; // Assurez-vous que le chemin est correct

// ================= CONSTANTES =================
const MONTHS_FR = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];

const TABS = [
  { key: 'apercu', label: 'Aperçu', path: '' },
  { key: 'sessions', label: 'Sessions', path: '/sessions' },
  { key: 'participants', label: 'Participants', path: '/participants' },
  { key: 'inscriptions', label: 'Inscriptions', path: '/inscriptions' },
  { key: 'evaluations', label: 'Évaluations', path: '/evaluations' },
  { key: 'statistiques', label: 'Statistiques', path: '/statistiques' },
];

const STATUS_STYLES = {
  publie:    { label: 'Publié',    bg: '#ece9fc', color: '#5847d8' },
  encours:   { label: 'En cours',  bg: '#fbe7e2', color: '#c84b2c' },
  brouillon: { label: 'Brouillon', bg: '#f5f3ee', color: '#6f6b78' },
  complet:   { label: 'Complet',   bg: '#5847d8', color: '#ffffff' },
  termine:   { label: 'Terminé',   bg: '#e3f3ec', color: '#216e4e' },
  annule:    { label: 'Annulé',    bg: '#fde8e8', color: '#b42318' },
};

const PAGE_SIZE = 6;

// ================= HELPERS =================
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

// ================= COMPOSANT =================
export default function DetailParticipants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('participants');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // État pour la modale de retrait de participant
  const [participantToRemove, setParticipantToRemove] = useState(null);
  const [motifRetrait, setMotifRetrait] = useState('');

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

  // Inscriptions + infos utilisateurs
  const evtInscriptions = (inscriptions || []).filter(
    (i) => Number(i.evenementId) === Number(event.id)
  );

  const enrichedParticipants = evtInscriptions.map((insc) => {
    const user =
      (utilisateurs || []).find((u) => Number(u.id) === Number(insc.participantId)) || {};
    return {
      ...insc,
      prenom: user.prenom || 'Participant',
      nom: user.nom || '',
      email: user.email || '',
    };
  });

  // Recherche
  const filtered = enrichedParticipants.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (p.prenom + ' ' + p.nom).toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      String(p.id).includes(q)
    );
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // KPIs
  const inscritsCount = evtInscriptions.length;
  const presents = evtInscriptions.filter((i) => i.presence === 'present').length;
  const absents = evtInscriptions.filter((i) => i.presence === 'absent').length;
  const waitlist = evtInscriptions.filter((i) => i.statut === 'enattente').length;
  const placesLibres = Math.max(0, (event.capaciteMax || 0) - inscritsCount);

  const badge = formatDateBadge(event.dateDebut);
  const st = STATUS_STYLES[event.statut] || STATUS_STYLES.brouillon;

  // Handlers
  const handleTogglePresence = (inscriptionId, presence) => {
    dispatch(updateParticipantPresence(inscriptionId, presence));
  };

  const openRemoveModal = (participant) => {
    setParticipantToRemove(participant);
    setMotifRetrait('');
  };

  const closeRemoveModal = () => {
    setParticipantToRemove(null);
    setMotifRetrait('');
  };

  const confirmRemove = () => {
    if (participantToRemove) {
      dispatch(removeParticipant(participantToRemove.id, motifRetrait));
      closeRemoveModal();
    }
  };

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
    // Ici, vous devriez dispatcher une action pour annuler l'événement.
    // Exemple : dispatch(cancelEvent(event.id, motifAnnulation));
    console.log(`Annulation de l'événement ${event.id} avec motif: ${motifAnnulation}`);
    closeCancelEventModal();
    // Optionnel : rediriger vers la liste des événements après annulation
    // navigate('/organisateur/evenements');
  };

  return (
    <AppShell role={currentUser?.role || 'organisateur'}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          backgroundColor: '#f7f4ed',
          minHeight: '100%',
          padding: '8px 4px 24px',
        }}
      >
        {/* Fil d'ariane */}
        <p
          style={{ margin: 0, fontSize: '12px', color: '#8a8694', cursor: 'pointer' }}
          onClick={() => navigate('/organisateur/evenements')}
        >
          ← Mes événements
        </p>

        {/* En-tête événement */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '64px',
                borderRadius: '12px',
                backgroundColor: '#dceef2',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#366a75',
              }}
            >
              <strong style={{ fontSize: '20px', fontWeight: 800, color: '#1c1a22', lineHeight: 1 }}>
                {badge.day}
              </strong>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', marginTop: '2px' }}>
                {badge.month}
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1b1922', letterSpacing: '-0.02em' }}>
                  {event.titre}
                </h1>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: st.bg,
                    color: st.color,
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: '8px' }}>●</span> {st.label}
                </span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#7c7885' }}>
                {formatDateLongue(event.dateDebut)} · {event.adresse} ·{' '}
                {event.prix > 0 ? `${event.prix} MAD` : 'Gratuit'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => navigate(`/organisateur/evenements/${event.id}/modifier`)}
              style={{
                background: '#ffffff',
                border: '1px solid #e6e2d8',
                borderRadius: '999px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#5e5a66',
                cursor: 'pointer',
              }}
            >
              Modifier
            </button>
            <button
              type="button"
              onClick={openCancelEventModal}
              style={{
                background: '#ffffff',
                border: '1px solid #f0c8c0',
                borderRadius: '999px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#c9492a',
                cursor: 'pointer',
              }}
            >
              Annuler l'événement
            </button>
          </div>
        </div>

        {/* Onglets */}
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
                {tab.key === 'participants' && ` (${inscritsCount})`}
                {tab.key === 'inscriptions' && ` (${inscritsCount})`}
              </button>
            );
          })}
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Inscrits</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1c1a22' }}>{inscritsCount} / {event.capaciteMax}</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>{placesLibres} places libres</div>
          </div>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Présents</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1c1a22' }}>{presents}</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>marqués aujourd'hui</div>
          </div>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Absents</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1c1a22' }}>{absents}</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>marqués absents</div>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Liste d'attente</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1c1a22' }}>{waitlist}</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>en attente d'une place</div>
          </div>
        </div>

        {/* Carte principale */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', overflow: 'hidden', boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)' }}>
          
          {/* Barre de recherche */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0ece3', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ width: '280px' }}>
              <SearchInput
                placeholder="Rechercher un participant..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <span style={{ fontSize: '11px', color: '#8a8694' }}>
              La présence se marque le jour de l'événement.
            </span>
          </div>

          {/* Tableau */}
          <div style={{ padding: '0 24px' }}>
            {/* En-têtes */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 80px)',
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
              <div>Paiement</div>
              <div>Présence</div>
              <div></div>
            </div>

            {/* Lignes */}
            {paginated.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8a8694', fontSize: '13px' }}>
                Aucun participant trouvé.
              </div>
            ) : (
              paginated.map((p) => {
                const initials = (p.prenom?.[0] || '?') + (p.nom?.[0] || '');
                const paymentStatus =
                  p.statut === 'confirmee'
                    ? 'accepte'
                    : p.statut === 'refusee'
                    ? 'refuse'
                    : 'enattente';

                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 80px)',
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
                      RES-{String(p.id).padStart(4, '0')}
                    </div>

                    {/* Paiement */}
                    <div>
                      {paymentStatus === 'accepte' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#ece9fc', color: '#5847d8', borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
                          ✓ Accepté
                        </span>
                      )}
                      {paymentStatus === 'enattente' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f8f6f0', color: '#6f6b78', borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, border: '1px dashed #d3cec2' }}>
                          ○ En attente
                        </span>
                      )}
                      {paymentStatus === 'refuse' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fde8e8', color: '#b42318', borderRadius: '999px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
                          ✕ Refusé
                        </span>
                      )}
                    </div>

                    {/* Présence */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => handleTogglePresence(p.id, 'present')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          border: p.presence === 'present' ? 'none' : '1px solid #e6e2d8',
                          backgroundColor: p.presence === 'present' ? '#d1f0dd' : '#ffffff',
                          color: p.presence === 'present' ? '#216e4e' : '#5f5b66',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Présent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTogglePresence(p.id, 'absent')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          border: p.presence === 'absent' ? 'none' : '1px solid #e6e2d8',
                          backgroundColor: p.presence === 'absent' ? '#fbe0e0' : '#ffffff',
                          color: p.presence === 'absent' ? '#b42318' : '#5f5b66',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Absent
                      </button>
                    </div>

                    {/* Retirer */}
                    <div style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => openRemoveModal(p)}
                        style={{
                          background: 'none',
                          border: '1px solid #f0c8c0',
                          borderRadius: '999px',
                          padding: '4px 12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#c9492a',
                          cursor: 'pointer',
                        }}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0ece3' }}>
            <span style={{ fontSize: '12px', color: '#8a8694' }}>
              {paginated.length === 0
                ? 'Aucun résultat'
                : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} sur ${filtered.length}`}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: '6px 16px',
                  borderRadius: '999px',
                  border: '1px solid #e6e2d8',
                  backgroundColor: '#ffffff',
                  color: page <= 1 ? '#c0bcc6' : '#5e5a66',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: page <= 1 ? 'default' : 'pointer',
                }}
              >
                Précédent
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: '6px 16px',
                  borderRadius: '999px',
                  border: '1px solid #e6e2d8',
                  backgroundColor: '#ffffff',
                  color: page >= totalPages ? '#c0bcc6' : '#5e5a66',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: page >= totalPages ? 'default' : 'pointer',
                }}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>

        {/* ================= MODALE DE RETRAIT DE PARTICIPANT (Popup) ================= */}
        {participantToRemove && (
          <Popup
            title={`Retirer ${participantToRemove.prenom} ${participantToRemove.nom} ?`}
            body={`Sa réservation RES-${String(participantToRemove.id).padStart(4, '0')} sera annulée et la première personne de la liste d'attente recevra la place. ${participantToRemove.prenom} sera prévenu par e-mail.`}
            tone="danger"
            confirmLabel="Retirer le participant"
            onCancel={closeRemoveModal}
            onConfirm={confirmRemove}
            textArea={true}
            textAreaLabel="Motif (envoyé au participant)"
            textAreaValue={motifRetrait}
            onTextAreaChange={(e) => setMotifRetrait(e.target.value)}
          />
        )}

        {/* ================= MODALE D'ANNULATION D'ÉVÉNEMENT (Popup) ================= */}
        {isCancelEventModalOpen && (
          <Popup
            title={`Annuler « ${event.titre} » ?`}
            body={`Les ${inscritsCount} participants et les ${waitlist} personnes en liste d'attente seront prévenus par e-mail, et les ${inscritsCount} paiements seront remboursés. Cette action est définitive.`}
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