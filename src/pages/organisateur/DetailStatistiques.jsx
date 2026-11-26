import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import { SecondaryButton } from '../../components/buttons';
import { Popup } from '../../components/popups';

const MONTHS_FR = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];

const STATUS_STYLES = {
  publie: { label: 'Publié', bg: '#ece9fc', color: '#5847d8' },
  encours: { label: 'En cours', bg: '#fbe7e2', color: '#c84b2c' },
  brouillon: { label: 'Brouillon', bg: '#f5f3ee', color: '#6f6b78' },
  complet: { label: 'Complet', bg: '#5847d8', color: '#ffffff' },
  termine: { label: 'Terminé', bg: '#e3f3ec', color: '#216e4e' },
  annule: { label: 'Annulé', bg: '#fde8e8', color: '#b42318' },
};

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

/**
 * Groupe les inscriptions par semaine (S1, S2, …) en se basant sur `dateInscription`.
 * Retourne toujours 5 semaines, même si les données sont vides.
 */
function buildWeeklyChart(inscriptions) {
  // 5 dernières semaines glissantes (semaine 0 = la plus ancienne)
  const now = new Date();
  const buckets = [0, 1, 2, 3, 4].map(() => 0);

  inscriptions.forEach((i) => {
    const dateStr = i.dateInscription || i.date || i.createdAt;
    if (!dateStr) return;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return;
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays >= 35) return; // hors fenêtre
    const weekIndex = 4 - Math.floor(diffDays / 7); // 4 = semaine la plus récente
    if (weekIndex >= 0 && weekIndex < 5) buckets[weekIndex] += 1;
  });

  return buckets.map((value, idx) => ({ label: `S${idx + 1}`, value }));
}

const TABS = [
  { key: 'apercu', label: 'Aperçu', path: '' },
  { key: 'sessions', label: 'Sessions', path: '/sessions' },
  { key: 'participants', label: 'Participants', path: '/participants' },
  { key: 'inscriptions', label: 'Inscriptions', path: '/inscriptions' },
  { key: 'evaluations', label: 'Évaluations', path: '/evaluations' },
  { key: 'statistiques', label: 'Statistiques', path: '/statistiques' },
];

export default function DetailStatistiques() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('statistiques');

  const [isCancelEventModalOpen, setIsCancelEventModalOpen] = useState(false);
  const [motifAnnulation, setMotifAnnulation] = useState('');

  const { evenements, inscriptions, paiements, evaluations, currentUser } = useSelector(
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

  // ---------- INSCRIPTIONS ----------
  const evtInscriptions = (inscriptions || []).filter(
    (i) => Number(i.evenementId ?? i.eventId ?? i.evenement_id) === Number(event.id)
  );

  const getPresence = (i) =>
    (i.presence || i.statutPresence || '').toString().toLowerCase();

  const presentsCount = evtInscriptions.filter((i) => getPresence(i) === 'present').length;
  const absentsCount = evtInscriptions.filter((i) => getPresence(i) === 'absent').length;

  // Participants confirmés (hors liste d'attente)
  const STATUTS_CONFIRMES = ['paye', 'payé', 'confirme', 'confirmé', 'inscrit', 'valide', 'validé'];
  const evtParticipants = evtInscriptions.filter((i) => {
    const st = (i.statut || i.status || i.etat || '').toString().toLowerCase();
    return STATUTS_CONFIRMES.includes(st);
  });
  const evtListeAttente = evtInscriptions.filter((i) => {
    const st = (i.statut || i.status || i.etat || '').toString().toLowerCase();
    return st === 'liste_attente' || i.listeAttente === true || i.enAttente === true;
  });

  const inscritsCount = evtParticipants.length > 0 ? evtParticipants.length : evtInscriptions.length;
  const listeAttenteCount = evtListeAttente.length;

  // ---------- KPIs ----------
  const capacite = Number(event.capaciteMax) || 0;
  const fillPct = capacite > 0 ? Math.round((inscritsCount / capacite) * 100) : 0;
  const presencePct =
    presentsCount + absentsCount > 0
      ? Math.round((presentsCount / (presentsCount + absentsCount)) * 100)
      : 0;

  // ---------- PAIEMENTS ----------
  const evtInscriptionIds = evtInscriptions.map((i) => Number(i.id));
  const evtPaiements = (paiements || []).filter((p) =>
    evtInscriptionIds.includes(Number(p.inscriptionId))
  );

  const getStatutPaiement = (p) =>
    (p.statut || p.status || '').toString().toLowerCase();

  const paiementsPayes = evtPaiements.filter((p) => getStatutPaiement(p) === 'accepte').length;
  const paiementsEnAttente = evtPaiements.filter((p) => getStatutPaiement(p) === 'enattente').length;
  const paiementsRefuses = evtPaiements.filter((p) => getStatutPaiement(p) === 'refuse').length;
  const totalPaiements = evtPaiements.length;

  const totalRevenue = evtPaiements
    .filter((p) => getStatutPaiement(p) === 'accepte')
    .reduce((sum, p) => sum + (Number(p.montant) || 0), 0);

  // Paiements à rembourser en cas d'annulation (acceptés)
  const paiementsARembourser = paiementsPayes;

  // ---------- ÉVALUATIONS ----------
  const evtEvaluations = (evaluations || []).filter(
    (ev) => Number(ev.evenementId ?? ev.eventId) === Number(event.id)
  );
  const avgRating =
    evtEvaluations.length > 0
      ? (
          evtEvaluations.reduce((sum, ev) => sum + (Number(ev.note) || 0), 0) /
          evtEvaluations.length
        ).toFixed(1)
      : '0';

  // ---------- GRAPHIQUE ----------
  const chartData = buildWeeklyChart(evtInscriptions);
  const maxChartValue = Math.max(1, ...chartData.map((d) => d.value)); // jamais 0

  const badge = formatDateBadge(event.dateDebut);
  const st = STATUS_STYLES[event.statut] || STATUS_STYLES.brouillon;

  // ---------- HANDLERS ----------
  const openCancelEventModal = () => {
    setIsCancelEventModalOpen(true);
    setMotifAnnulation('');
  };

  const closeCancelEventModal = () => {
    setIsCancelEventModalOpen(false);
    setMotifAnnulation('');
  };

  const confirmCancelEvent = () => {
    // TODO: remplacer par l'action réelle
    // dispatch(annulerEvenement({ id: event.id, motif: motifAnnulation }));
    console.log(`Annulation de l'événement ${event.id} avec motif: ${motifAnnulation}`);
    closeCancelEventModal();
  };

  // Corps modale dynamique
  const cancelBody =
    `Les ${inscritsCount} participant${inscritsCount > 1 ? 's' : ''} ` +
    `et les ${listeAttenteCount} personne${listeAttenteCount > 1 ? 's' : ''} en liste d'attente ` +
    `seront prévenus par e-mail, et les ${paiementsARembourser} paiement${paiementsARembourser > 1 ? 's' : ''} ` +
    `seront remboursés. Cette action est définitive.`;

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
              <div style={{ width: '56px', height: '64px', borderRadius: '12px', backgroundColor: '#dceef2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#366a75' }}>
                <strong style={{ fontSize: '20px', fontWeight: 800, color: '#1c1a22', lineHeight: 1 }}>{badge.day}</strong>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', marginTop: '2px' }}>{badge.month}</span>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1b1922', letterSpacing: '-0.02em' }}>
                    {event.titre}
                  </h1>
                  {/* CORRECTION : statut dynamique */}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: st.bg, color: st.color, padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>
                    <span style={{ fontSize: '8px' }}>●</span> {st.label}
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
                {/* AJOUT : compteurs dynamiques */}
                {tab.key === 'participants' && ` (${inscritsCount})`}
                {tab.key === 'inscriptions' && ` (${inscritsCount})`}
              </button>
            );
          })}
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Taux de remplissage</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{fillPct} %</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>{inscritsCount} sur {capacite || '—'}</div>
          </div>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Taux de présence</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{presencePct} %</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>{presentsCount} sur {presentsCount + absentsCount} attendus</div>
          </div>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Revenus</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{totalRevenue.toLocaleString('fr-FR')} MAD</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>encaissés</div>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Satisfaction</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{String(avgRating).replace('.', ',')} / 5</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>{evtEvaluations.length} avis</div>
          </div>
        </div>

        {/* Contenu 2 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '20px', alignItems: 'start' }}>

          {/* Graphique d'inscriptions par semaine */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', padding: '24px', boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>
              Inscriptions par semaine
              {evtInscriptions.length === 0 && (
                <span style={{ color: '#8a8694', fontWeight: 500, fontSize: '12px', marginLeft: '8px' }}>
                  (aucune donnée)
                </span>
              )}
            </h3>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid #f0ece3' }}>
              {chartData.map((data, index) => {
                const heightPct = (data.value / maxChartValue) * 100;
                return (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'flex-end' }}>
                    {/* Valeur au-dessus de la barre */}
                    <span style={{ fontSize: '10px', color: '#5f5b66', fontWeight: 600, marginBottom: '4px' }}>
                      {data.value}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '60px',
                        height: `${heightPct}%`,
                        backgroundColor: data.value > 0 ? '#7c6bf2' : '#ece9fc',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12px', gap: '12px' }}>
              {chartData.map((data, index) => (
                <span key={index} style={{ fontSize: '11px', color: '#8a8694', width: '100%', textAlign: 'center' }}>
                  {data.label}
                </span>
              ))}
            </div>
          </div>

          {/* Répartition des paiements */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', padding: '20px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>
              Paiements
              {totalPaiements > 0 && (
                <span style={{ color: '#8a8694', fontWeight: 500, fontSize: '12px', marginLeft: '6px' }}>
                  ({totalPaiements})
                </span>
              )}
            </h3>

            {totalPaiements === 0 ? (
              <p style={{ margin: 0, fontSize: '12px', color: '#8a8694' }}>Aucun paiement enregistré.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Payés */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#5f5b66', marginBottom: '6px' }}>
                    <span>Payés</span>
                    <span style={{ fontWeight: 600, color: '#1c1a22' }}>{paiementsPayes}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f0ece3', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(paiementsPayes / totalPaiements) * 100}%`, height: '100%', backgroundColor: '#216e4e', borderRadius: '4px' }} />
                  </div>
                </div>

                {/* En attente */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#5f5b66', marginBottom: '6px' }}>
                    <span>En attente</span>
                    <span style={{ fontWeight: 600, color: '#1c1a22' }}>{paiementsEnAttente}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f0ece3', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(paiementsEnAttente / totalPaiements) * 100}%`, height: '100%', backgroundColor: '#c84b2c', borderRadius: '4px' }} />
                  </div>
                </div>

                {/* Refusés */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#5f5b66', marginBottom: '6px' }}>
                    <span>Refusés</span>
                    <span style={{ fontWeight: 600, color: '#1c1a22' }}>{paiementsRefuses}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f0ece3', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(paiementsRefuses / totalPaiements) * 100}%`, height: '100%', backgroundColor: '#b42318', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODALE D'ANNULATION */}
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