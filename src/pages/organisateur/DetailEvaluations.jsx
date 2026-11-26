import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
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

/** Retourne "il y a X j/h/min" à partir d'une date ISO */
function formatRelativeDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffJ = Math.floor(diffH / 24);
  if (diffJ < 30) return `il y a ${diffJ} j`;
  const diffMois = Math.floor(diffJ / 30);
  return `il y a ${diffMois} mois`;
}

function renderStars(note) {
  const stars = [];
  const rounded = Math.round(Number(note) || 0);
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        size={12}
        fill={i < rounded ? '#c9492a' : '#e6e2d8'}
        stroke={i < rounded ? '#c9492a' : '#e6e2d8'}
        style={{ marginRight: '2px' }}
      />
    );
  }
  return stars;
}

const TABS = [
  { key: 'apercu', label: 'Aperçu', path: '' },
  { key: 'sessions', label: 'Sessions', path: '/sessions' },
  { key: 'participants', label: 'Participants', path: '/participants' },
  { key: 'inscriptions', label: 'Inscriptions', path: '/inscriptions' },
  { key: 'evaluations', label: 'Évaluations', path: '/evaluations' },
  { key: 'statistiques', label: 'Statistiques', path: '/statistiques' },
];

export default function DetailEvaluations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('evaluations');
  const [activeFilter, setActiveFilter] = useState('tous'); // 'tous', '5', '4etmoins'

  const [isCancelEventModalOpen, setIsCancelEventModalOpen] = useState(false);
  const [motifAnnulation, setMotifAnnulation] = useState('');

  const { evenements, evaluations, inscriptions, utilisateurs, currentUser } = useSelector(
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

  // ---------- ÉVALUATIONS ----------
  const evtEvaluations = (evaluations || []).filter(
    (ev) => Number(ev.evenementId ?? ev.eventId) === Number(event.id)
  );

  // Enrichissement avec les données utilisateur (tolérant aux différents noms de champs)
  const enrichedEvaluations = evtEvaluations
    .map((ev) => {
      const userId = ev.participantId ?? ev.utilisateurId ?? ev.userId ?? ev.auteurId;
      const user = (utilisateurs || []).find((u) => Number(u.id) === Number(userId)) || {};
      return {
        ...ev,
        prenom: user.prenom || ev.prenom || 'Participant',
        nom: user.nom || ev.nom || '',
      };
    })
    // Tri du plus récent au plus ancien
    .sort((a, b) => {
      const da = new Date(a.dateCreation || a.date || 0).getTime();
      const db = new Date(b.dateCreation || b.date || 0).getTime();
      return db - da;
    });

  // ---------- INSCRIPTIONS / PARTICIPANTS ----------
  const sourceInscriptions =
    Array.isArray(inscriptions) && inscriptions.length > 0 ? inscriptions : [];

  const evtInscriptions = sourceInscriptions.filter(
    (i) => Number(i.evenementId ?? i.eventId ?? i.evenement_id) === Number(event.id)
  );

  const STATUTS_CONFIRMES = ['paye', 'payé', 'confirme', 'confirmé', 'inscrit', 'valide', 'validé'];
  const evtParticipants = evtInscriptions.filter((i) => {
    const st = (i.statut || i.status || i.etat || '').toString().toLowerCase();
    return STATUTS_CONFIRMES.includes(st);
  });

  const evtListeAttente = evtInscriptions.filter((i) => {
    const st = (i.statut || i.status || i.etat || '').toString().toLowerCase();
    return st === 'liste_attente' || i.listeAttente === true || i.enAttente === true;
  });

  const evtPaiements = evtInscriptions.filter((i) => {
    const st = (i.statut || i.status || i.etat || '').toString().toLowerCase();
    return i.paiementEffectue === true || st === 'paye' || st === 'payé';
  });

  const inscritsCount = evtParticipants.length > 0 ? evtParticipants.length : evtInscriptions.length;
  const listeAttenteCount = evtListeAttente.length;
  const paiementsCount = evtPaiements.length > 0 ? evtPaiements.length : evtInscriptions.length;

  // Présents (pour le taux de réponse)
  const presentsCount = evtInscriptions.filter(
    (i) => (i.presence || i.statutPresence || '').toString().toLowerCase() === 'present'
  ).length;

  // ---------- STATISTIQUES ----------
  const totalAvis = enrichedEvaluations.length;
  const avgRating =
    totalAvis > 0
      ? (enrichedEvaluations.reduce((sum, ev) => sum + (Number(ev.note) || 0), 0) / totalAvis).toFixed(1)
      : '0';

  const responseRate = presentsCount > 0 ? Math.round((totalAvis / presentsCount) * 100) : 0;
  const recommendCount = enrichedEvaluations.filter((ev) => Number(ev.note) >= 4).length;
  const recommendRate = totalAvis > 0 ? Math.round((recommendCount / totalAvis) * 100) : 0;

  const notesDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: enrichedEvaluations.filter((ev) => Math.round(Number(ev.note)) === star).length,
  }));

  const filteredComments = enrichedEvaluations.filter((ev) => {
    if (activeFilter === '5') return Math.round(Number(ev.note)) === 5;
    if (activeFilter === '4etmoins') return Math.round(Number(ev.note)) <= 4;
    return true;
  });

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
    // TODO: remplacer par l'action réelle
    // dispatch(annulerEvenement({ id: event.id, motif: motifAnnulation }));
    console.log(`Annulation de l'événement ${event.id} avec motif: ${motifAnnulation}`);
    closeCancelEventModal();
  };

  // Corps de la modale avec compteurs dynamiques
  const cancelBody =
    `Les ${inscritsCount} participant${inscritsCount > 1 ? 's' : ''} ` +
    `et les ${listeAttenteCount} personne${listeAttenteCount > 1 ? 's' : ''} en liste d'attente ` +
    `seront prévenus par e-mail, et les ${paiementsCount} paiement${paiementsCount > 1 ? 's' : ''} ` +
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
                {/* AJOUT : compteurs dynamiques sur les onglets */}
                {tab.key === 'participants' && ` (${inscritsCount})`}
                {tab.key === 'inscriptions' && ` (${inscritsCount})`}
              </button>
            );
          })}
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Note moyenne</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{String(avgRating).replace('.', ',')} / 5</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>sur {totalAvis} avis</div>
          </div>
          <div style={{ padding: '16px 20px', borderRight: '1px solid #ece8df' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Taux de réponse</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{responseRate} %</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>{totalAvis} sur {presentsCount} présents</div>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: '12px', color: '#7c7885', marginBottom: '4px' }}>Recommandent</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1c1a22' }}>{recommendRate} %</div>
            <div style={{ fontSize: '11px', color: '#8f8b96', marginTop: '2px' }}>&nbsp;</div>
          </div>
        </div>

        {/* Contenu 2 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>

          {/* Répartition des notes */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>Répartition des notes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notesDistribution.map((dist) => {
                const pct = totalAvis > 0 ? (dist.count / totalAvis) * 100 : 0;
                return (
                  <div key={dist.star} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span style={{ width: '40px', color: '#5f5b66' }}>{dist.star} étoiles</span>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#f0ece3', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#5847d8', borderRadius: '3px' }} />
                    </div>
                    <span style={{ width: '20px', textAlign: 'right', color: '#5f5b66', fontWeight: 600 }}>{dist.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Commentaires */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', overflow: 'hidden', boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)' }}>
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0ece3' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>
                Commentaires {totalAvis > 0 && <span style={{ color: '#8a8694', fontWeight: 500 }}>({filteredComments.length})</span>}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { key: 'tous', label: 'Tous' },
                  { key: '5', label: '5 étoiles' },
                  { key: '4etmoins', label: '4 et moins' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: activeFilter === f.key ? '#1c1a22' : '#f8f6f0',
                      color: activeFilter === f.key ? '#ffffff' : '#5f5b66',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '0 24px' }}>
              {filteredComments.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#8a8694', fontSize: '13px' }}>
                  Aucun commentaire pour ce filtre.
                </div>
              ) : (
                filteredComments.map((ev) => {
                  const initials = (ev.prenom?.[0] || '?') + (ev.nom?.[0] || '');
                  // CORRECTION : date relative dynamique
                  const relative = formatRelativeDate(ev.dateCreation || ev.date);
                  return (
                    <div
                      key={ev.id}
                      style={{
                        padding: '16px 0',
                        borderBottom: '1px solid #f0ece3',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#ece9fc',
                              color: '#5847d8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            {initials.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1c1a22' }}>
                              {ev.prenom} {ev.nom}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <div style={{ display: 'flex' }}>{renderStars(ev.note)}</div>
                          {relative && <span style={{ fontSize: '11px', color: '#8a8694' }}>{relative}</span>}
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#4a4652', paddingLeft: '44px' }}>
                        {ev.commentaire || 'Aucun commentaire textuel fourni.'}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
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