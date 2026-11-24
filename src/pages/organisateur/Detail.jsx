import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import AppShell from '../../layouts/AppShell';
import { PrimaryButton, SecondaryButton } from '../../components/buttons';
import { ProgressBar } from '../../components/Diagram';
import { getStatusBadge } from '../../utils/statusHelpers'; // ou votre helper
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

const TABS = [
  { key: 'apercu', label: 'Aperçu', path: '' },
  { key: 'sessions', label: 'Sessions', path: '/sessions' },
  { key: 'participants', label: 'Participants', path: '/participants' },
  { key: 'inscriptions', label: 'Inscriptions', path: '/inscriptions' },
  { key: 'evaluations', label: 'Évaluations', path: '/evaluations' },
  { key: 'statistiques', label: 'Statistiques', path: '/statistiques' },
];

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('apercu');

  // État pour la modale d'annulation d'événement
  const [isCancelEventModalOpen, setIsCancelEventModalOpen] = useState(false);
  const [motifAnnulation, setMotifAnnulation] = useState('');

  const { evenements, inscriptions, paiements, evaluations, sessions, currentUser } = useSelector(
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

  // Calcul des statistiques
  const evtInscriptions = inscriptions?.filter((i) => Number(i.evenementId) === Number(event.id)) || [];
  const evtInscriptionIds = evtInscriptions.map((i) => Number(i.id));
  
  const evtPaiements = paiements?.filter((p) => evtInscriptionIds.includes(Number(p.inscriptionId)) && p.statut === 'accepte') || [];
  const totalRevenue = evtPaiements.reduce((sum, p) => sum + (Number(p.montant) || 0), 0);

  const evtEvaluations = evaluations?.filter((ev) => Number(ev.evenementId) === Number(event.id)) || [];
  const avgRating = evtEvaluations.length > 0 
    ? (evtEvaluations.reduce((sum, ev) => sum + (Number(ev.note) || 0), 0) / evtEvaluations.length).toFixed(1) 
    : '0';

  const waitlistCount = evtInscriptions.filter(i => i.statut === 'enattente').length;
  const inscritsCount = evtInscriptions.length;
  const placesLibres = Math.max(0, (event.capaciteMax || 0) - inscritsCount);
  const fillPct = event.capaciteMax > 0 ? Math.min(100, Math.round((inscritsCount / event.capaciteMax) * 100)) : 0;

  const badge = formatDateBadge(event.dateDebut);
  const st = getStatusBadge ? getStatusBadge(event.statut) : { label: 'Publié', cls: 'status_pill--publie', dot: '●' };

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
                    <span style={{ fontSize: '8px' }}>●</span> {st.label || 'Publié'}
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
                {tab.label} {tab.key === 'participants' ? `(${inscritsCount})` : tab.key === 'inscriptions' ? `(${inscritsCount})` : ''}
              </button>
            );
          })}
        </div>

        {/* Contenu principal */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '20px', alignItems: 'start' }}>
          
          {/* Colonne de gauche */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* KPI Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
                <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Inscrits</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1c1a22' }}>{inscritsCount} / {event.capaciteMax}</div>
                <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>{placesLibres} places libres</div>
              </div>
              <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
                <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Revenus</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1c1a22' }}>{totalRevenue.toLocaleString('fr-FR')} MAD</div>
                <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>{evtPaiements.length} paiements reçus</div>
              </div>
              <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
                <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Note moyenne</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1c1a22' }}>{String(avgRating).replace('.', ',')} / 5</div>
                <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>{evtEvaluations.length} avis</div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Liste d'attente</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1c1a22' }}>{waitlistCount}</div>
                <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>en attente</div>
              </div>
            </div>

            {/* Bloc Description */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', padding: '24px' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#1c1a22' }}>Description</h2>
              <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#4a4652', lineHeight: 1.6 }}>
                {event.description || "Aucune description fournie pour cet événement."}
              </p>

              {/* Grille d'informations */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#8a8694', letterSpacing: '0.06em', marginBottom: '4px' }}>DATE</div>
                  <div style={{ fontSize: '13px', color: '#1c1a22', fontWeight: 500 }}>
                    {formatDateLongue(event.dateDebut)}, {event.heureDebut || '--:--'} – {event.heureFin || '--:--'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#8a8694', letterSpacing: '0.06em', marginBottom: '4px' }}>LIEU</div>
                  <div style={{ fontSize: '13px', color: '#1c1a22', fontWeight: 500 }}>{event.adresse}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#8a8694', letterSpacing: '0.06em', marginBottom: '4px' }}>CATÉGORIE</div>
                  <div style={{ fontSize: '13px', color: '#1c1a22', fontWeight: 500 }}>{event.categorie}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#8a8694', letterSpacing: '0.06em', marginBottom: '4px' }}>PRIX</div>
                  <div style={{ fontSize: '13px', color: '#1c1a22', fontWeight: 500 }}>{event.prix > 0 ? `${event.prix} MAD` : 'Gratuit'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#8a8694', letterSpacing: '0.06em', marginBottom: '4px' }}>CAPACITÉ</div>
                  <div style={{ fontSize: '13px', color: '#1c1a22', fontWeight: 500 }}>{event.capaciteMax} places</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#8a8694', letterSpacing: '0.06em', marginBottom: '4px' }}>INSCRIPTIONS</div>
                  <div style={{ fontSize: '13px', color: '#1c1a22', fontWeight: 500 }}>
                    {event.validationManuelle ? 'Validation manuelle' : 'Automatique'}
                  </div>
                </div>
              </div>

              {/* Faux plan / Itinéraire */}
              <div style={{ position: 'relative', height: '180px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f3f0e9' }}>
                {/* Fond abstrait de carte */}
                <svg width="100%" height="100%" viewBox="0 0 600 180" preserveAspectRatio="none">
                  <rect width="600" height="180" fill="#f4f1ea" />
                  <path d="M0 120 L150 60 L300 100 L450 40 L600 90" stroke="#fde1b8" strokeWidth="16" fill="none" strokeLinecap="round" />
                  <path d="M0 20 L200 50 L400 20 L600 60" stroke="#ffffff" strokeWidth="10" fill="none" />
                  <path d="M50 0 L100 180" stroke="#ffffff" strokeWidth="8" fill="none" />
                  <path d="M200 0 L250 180" stroke="#ffffff" strokeWidth="8" fill="none" />
                  <path d="M450 0 L500 180" stroke="#ffffff" strokeWidth="8" fill="none" />
                  <circle cx="380" cy="100" r="8" fill="#a3d9b1" opacity="0.5" />
                  <circle cx="480" cy="150" r="12" fill="#fbc4c4" opacity="0.5" />
                </svg>
                {/* Point GPS */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', color: '#c9492a' }}>
                  <MapPin size={32} fill="#c9492a" stroke="#ffffff" strokeWidth={2} />
                </div>
                {/* Lien itinéraire */}
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.adresse)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ position: 'absolute', bottom: '12px', left: '16px', fontSize: '12px', fontWeight: 600, color: '#5847d8', textDecoration: 'none' }}
                >
                  Itinéraire →
                </a>
              </div>
            </div>
          </div>

          {/* Colonne de droite (Remplissage) */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>Remplissage</h3>
            
            <ProgressBar value={fillPct} />
            <div style={{ fontSize: '12px', color: '#8a8694', marginTop: '8px', marginBottom: '20px' }}>
              {inscritsCount} places sur {event.capaciteMax} occupées
            </div>

            <PrimaryButton 
              text="Voir les inscriptions" 
              onClick={() => navigate(`/organisateur/evenements/${event.id}/inscriptions`)} 
            />
          </div>

        </div>

        {/* ================= MODALE D'ANNULATION D'ÉVÉNEMENT (Popup) ================= */}
        {isCancelEventModalOpen && (
          <Popup
            title={`Annuler « ${event.titre} » ?`}
            body={`Les ${inscritsCount} participants et les ${waitlistCount} personnes en liste d'attente seront prévenus par e-mail, et les ${evtPaiements.length} paiements seront remboursés. Cette action est définitive.`}
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