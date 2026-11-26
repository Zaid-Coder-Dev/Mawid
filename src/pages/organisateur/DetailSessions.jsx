import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import { PrimaryButton, SecondaryButton } from '../../components/buttons';
import { Popup } from '../../components/popups';

const MONTHS_FR = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
const MONTHS_FULL_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

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

function calcDuration(debut, fin) {
  if (!debut || !fin) return 0;
  const [h1, m1] = debut.split(':').map(Number);
  const [h2, m2] = fin.split(':').map(Number);
  return (h2 * 60 + m2 - (h1 * 60 + m1)) / 60;
}

const TABS = [
  { key: 'apercu', label: 'Aperçu', path: '' },
  { key: 'sessions', label: 'Sessions', path: '/sessions' },
  { key: 'participants', label: 'Participants', path: '/participants' },
  { key: 'inscriptions', label: 'Inscriptions', path: '/inscriptions' },
  { key: 'evaluations', label: 'Évaluations', path: '/evaluations' },
  { key: 'statistiques', label: 'Statistiques', path: '/statistiques' },
];

const STATUS_STYLES = {
  publie: { label: 'Publié', bg: '#ece9fc', color: '#5847d8' },
  encours: { label: 'En cours', bg: '#fbe7e2', color: '#c84b2c' },
  brouillon: { label: 'Brouillon', bg: '#f5f3ee', color: '#6f6b78' },
  complet: { label: 'Complet', bg: '#5847d8', color: '#ffffff' },
  termine: { label: 'Terminé', bg: '#e3f3ec', color: '#216e4e' },
  annule: { label: 'Annulé', bg: '#fde8e8', color: '#b42318' },
};

export default function DetailSessions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('sessions');

  const [isCancelEventModalOpen, setIsCancelEventModalOpen] = useState(false);
  const [motifAnnulation, setMotifAnnulation] = useState('');

  // Récupération de toutes les données utiles depuis le state Redux
  const { evenements, sessions, intervenants, inscriptions, participants, currentUser } =
    useSelector((state) => state.evenements || {});

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

  // Sessions de l'événement
  const evtSessions = (sessions || [])
    .filter((s) => Number(s.evenementId) === Number(event.id))
    .sort((a, b) => (a.heureDebut || '').localeCompare(b.heureDebut || ''));

  const totalHeures = evtSessions.reduce(
    (sum, s) => sum + calcDuration(s.heureDebut, s.heureFin),
    0
  );

  // --- INSCRIPTIONS / PARTICIPANTS (valeurs dynamiques) ---

  // On privilégie le tableau "inscriptions" s'il existe, sinon "participants"
  const sourceInscriptions =
    Array.isArray(inscriptions) && inscriptions.length > 0
      ? inscriptions
      : Array.isArray(participants)
      ? participants
      : [];

  // Inscriptions rattachées à cet événement
  const evtInscriptions = sourceInscriptions.filter(
    (i) =>
      Number(i.evenementId ?? i.eventId ?? i.evenement_id) === Number(event.id)
  );

  // Participants confirmés (statuts considérés comme validés)
  const STATUTS_CONFIRMES = ['paye', 'payé', 'confirme', 'confirmé', 'inscrit', 'valide', 'validé'];
  const evtParticipants = evtInscriptions.filter((i) => {
    const st = (i.statut || i.status || i.etat || '').toString().toLowerCase();
    return STATUTS_CONFIRMES.includes(st);
  });

  // Liste d'attente
  const evtListeAttente = evtInscriptions.filter((i) => {
    const st = (i.statut || i.status || i.etat || '').toString().toLowerCase();
    return st === 'liste_attente' || st === 'liste d\'attente' || i.listeAttente === true || i.enAttente === true;
  });

  // Paiements effectués (à rembourser en cas d'annulation)
  const evtPaiements = evtInscriptions.filter((i) => {
    const st = (i.statut || i.status || i.etat || '').toString().toLowerCase();
    return i.paiementEffectue === true || st === 'paye' || st === 'payé' || st === 'paye_en_ligne';
  });

  // Si aucun statut n'est renseigné, on retombe sur le total d'inscriptions
  const inscritsCount = evtParticipants.length > 0 ? evtParticipants.length : evtInscriptions.length;
  const listeAttenteCount = evtListeAttente.length;
  const paiementsCount = evtPaiements.length > 0 ? evtPaiements.length : evtInscriptions.length;

  const badge = formatDateBadge(event.dateDebut);
  const st = STATUS_STYLES[event.statut] || STATUS_STYLES.brouillon;

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
    // TODO: dispatch(actionAnnulerEvenement({ id: event.id, motif: motifAnnulation }))
    closeCancelEventModal();
  };

  // Construction du texte de la modale avec les valeurs dynamiques
  const cancelBody =
    `Les ${inscritsCount} participant${inscritsCount > 1 ? 's' : ''} ` +
    `et les ${listeAttenteCount} personne${listeAttenteCount > 1 ? 's' : ''} en liste d'attente ` +
    `seront prévenus par e-mail, et les ${paiementsCount} paiement${paiementsCount > 1 ? 's' : ''} ` +
    `seront remboursés. Cette action est définitive.`;

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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
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
                <h1
                  style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#1b1922',
                    letterSpacing: '-0.02em',
                  }}
                >
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
            <SecondaryButton
              text="Modifier"
              onClick={() => navigate(`/organisateur/evenements/${event.id}/modifier`)}
            />
            <SecondaryButton text="Annuler l'événement" onClick={openCancelEventModal} />
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

        {/* Carte du programme */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #ece8df',
            padding: '20px 24px',
            boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1c1a22' }}>
                Programme du {new Date(event.dateDebut).getDate()}{' '}
                {MONTHS_FULL_FR[new Date(event.dateDebut).getMonth()].toLowerCase()}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#8a8694' }}>
                {evtSessions.length} sessions · {totalHeures.toFixed(1).replace('.', ' h ')} au total
              </p>
            </div>

            <PrimaryButton
              text="Ajouter une session"
              onClick={() => navigate(`/organisateur/evenements/${event.id}/sessions/nouvelle`)}
            />
          </div>

          {/* Tableau des sessions */}
          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'minmax(0, 140px) minmax(0, 1fr) minmax(0, 180px) minmax(0, 100px) minmax(0, 80px)',
                gap: '12px',
                padding: '0 0 12px',
                borderBottom: '1px solid #ece8df',
                fontSize: '10px',
                fontWeight: 700,
                color: '#a8a3b0',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              <div>Horaire</div>
              <div>Session</div>
              <div>Intervenant</div>
              <div>Salle</div>
              <div></div>
            </div>

            {evtSessions.length === 0 ? (
              <div style={{ padding: '24px 0', fontSize: '13px', color: '#8a8694', textAlign: 'center' }}>
                Aucune session enregistrée pour cet événement.
              </div>
            ) : (
              evtSessions.map((s) => {
                const intervenant = (intervenants || []).find(
                  (i) => Number(i.id) === Number(s.intervenantId)
                );
                const nomIntervenant = intervenant
                  ? `${intervenant.prenom} ${intervenant.nom}`
                  : '—';

                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'minmax(0, 140px) minmax(0, 1fr) minmax(0, 180px) minmax(0, 100px) minmax(0, 80px)',
                      gap: '12px',
                      alignItems: 'center',
                      padding: '14px 0',
                      borderBottom: '1px solid #f0ece3',
                      fontSize: '13px',
                      color: '#1c1a22',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      {s.heureDebut || '--:--'} – {s.heureFin || '--:--'}
                    </div>
                    <div style={{ fontWeight: 500 }}>{s.titre || 'Session sans titre'}</div>
                    <div style={{ color: '#5f5b66' }}>{nomIntervenant}</div>
                    <div style={{ color: '#5f5b66' }}>{s.salle || '—'}</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/organisateur/evenements/${event.id}/sessions/modifier/${s.id}`)
                        }
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e6e2d8',
                          borderRadius: '999px',
                          padding: '4px 12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#5e5a66',
                          cursor: 'pointer',
                        }}
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MODALE D'ANNULATION (valeurs dynamiques) */}
        {isCancelEventModalOpen && (
          <Popup
            title={`Annuler « ${event.titre} » ?`}
            body={cancelBody}
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