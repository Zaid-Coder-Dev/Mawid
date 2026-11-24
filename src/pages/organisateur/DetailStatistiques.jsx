import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import { SecondaryButton } from '../../components/buttons';
import { Popup } from '../../components/popups';

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

  // État pour la modale d'annulation d'événement
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

  // --- CALCUL DES STATISTIQUES ---
  const evtInscriptions = (inscriptions || []).filter(
    (i) => Number(i.evenementId) === Number(event.id)
  );

  // KPIs
  const inscritsCount = evtInscriptions.length;
  const presentsCount = evtInscriptions.filter((i) => i.presence === 'present').length;
  const absentsCount = evtInscriptions.filter((i) => i.presence === 'absent').length;
  
  const fillPct = event.capaciteMax > 0 ? Math.round((inscritsCount / event.capaciteMax) * 100) : 0;
  const presencePct = (presentsCount + absentsCount) > 0 ? Math.round((presentsCount / (presentsCount + absentsCount)) * 100) : 0;

  // Revenus
  const evtInscriptionIds = evtInscriptions.map((i) => Number(i.id));
  const evtPaiements = (paiements || []).filter((p) => evtInscriptionIds.includes(Number(p.inscriptionId)));
  const totalRevenue = evtPaiements
    .filter(p => p.statut === 'accepte')
    .reduce((sum, p) => sum + (Number(p.montant) || 0), 0);

  // Évaluations
  const evtEvaluations = (evaluations || []).filter((ev) => Number(ev.evenementId) === Number(event.id));
  const avgRating = evtEvaluations.length > 0 
    ? (evtEvaluations.reduce((sum, ev) => sum + (Number(ev.note) || 0), 0) / evtEvaluations.length).toFixed(1) 
    : '0';

  // Paiements (répartition)
  const paiementsPayes = evtPaiements.filter(p => p.statut === 'accepte').length;
  const paiementsEnAttente = evtPaiements.filter(p => p.statut === 'enattente').length;
  const paiementsRefuses = evtPaiements.filter(p => p.statut === 'refuse').length;
  const totalPaiements = evtPaiements.length || 1; // Éviter division par 0

  // Données simulées pour le graphique d'inscriptions par semaine
  // Dans un cas réel, vous grouperiez les `dateInscription` par semaine
  const chartData = [
    { label: 'S1', value: 20 },
    { label: 'S2', value: 35 },
    { label: 'S3', value: 55 },
    { label: 'S4', value: 75 },
    { label: 'S5', value: 90 },
  ];
  const maxChartValue = Math.max(...chartData.map(d => d.value));

  const badge = formatDateBadge(event.dateDebut);

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
              </button>
            );
          })}
        </div>

        {/* KPI Strip Statistiques */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Taux de remplissage</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{fillPct} %</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>{inscritsCount} sur {event.capaciteMax}</div>
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

        {/* Contenu Principal : 2 Colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '20px', alignItems: 'start' }}>
          
          {/* Colonne de gauche : Graphique d'inscriptions par semaine */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', padding: '24px', boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>Inscriptions par semaine</h3>
            
            {/* Graphique en barres */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '180px', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid #f0ece3' }}>
              {chartData.map((data, index) => {
                const heightPct = (data.value / maxChartValue) * 100;
                return (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'flex-end' }}>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '60px',
                        height: `${heightPct}%`,
                        backgroundColor: '#7c6bf2', // Couleur violette de la capture
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                    />
                  </div>
                );
              })}
            </div>
            
            {/* Labels de l'axe X */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '12px', gap: '12px' }}>
              {chartData.map((data, index) => (
                <span key={index} style={{ fontSize: '11px', color: '#8a8694', width: '100%', textAlign: 'center' }}>
                  {data.label}
                </span>
              ))}
            </div>
          </div>

          {/* Colonne de droite : Répartition des paiements */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', padding: '20px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>Paiements</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Payés */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#5f5b66', marginBottom: '6px' }}>
                  <span>Payés</span>
                  <span style={{ fontWeight: 600, color: '#1c1a22' }}>{paiementsPayes}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f0ece3', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(paiementsPayes / totalPaiements) * 100}%`, height: '100%', backgroundColor: '#5847d8', borderRadius: '4px' }} />
                </div>
              </div>

              {/* En attente */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#5f5b66', marginBottom: '6px' }}>
                  <span>En attente</span>
                  <span style={{ fontWeight: 600, color: '#1c1a22' }}>{paiementsEnAttente}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f0ece3', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(paiementsEnAttente / totalPaiements) * 100}%`, height: '100%', backgroundColor: '#5847d8', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Refusés */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#5f5b66', marginBottom: '6px' }}>
                  <span>Refusés</span>
                  <span style={{ fontWeight: 600, color: '#1c1a22' }}>{paiementsRefuses}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f0ece3', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(paiementsRefuses / totalPaiements) * 100}%`, height: '100%', backgroundColor: '#5847d8', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MODALE D'ANNULATION D'ÉVÉNEMENT (Popup) ================= */}
        {isCancelEventModalOpen && (
          <Popup
            title={`Annuler « ${event.titre} » ?`}
            body={`Les ${inscritsCount} participants et les personnes en liste d'attente seront prévenus par e-mail. Cette action est définitive.`}
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