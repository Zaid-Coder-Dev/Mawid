import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
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

function renderStars(note) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        size={12}
        fill={i < note ? '#c9492a' : '#e6e2d8'}
        stroke={i < note ? '#c9492a' : '#e6e2d8'}
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

  // Ajout de "utilisateurs" dans la récupération Redux
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

  // Filtrer les évaluations pour cet événement
  const evtEvaluations = (evaluations || []).filter(
    (ev) => Number(ev.evenementId) === Number(event.id)
  );

  // CORRECTION : Jointure avec les données utilisateurs pour avoir le nom/prénom
  const enrichedEvaluations = evtEvaluations.map(ev => {
    const user = (utilisateurs || []).find(u => Number(u.id) === Number(ev.participantId)) || {};
    return {
      ...ev,
      prenom: user.prenom || 'Participant',
      nom: user.nom || '',
    };
  });

  // Filtrer les inscriptions pour calculer le taux de réponse
  const evtInscriptions = (inscriptions || []).filter(
    (i) => Number(i.evenementId) === Number(event.id)
  );
  const presentsCount = evtInscriptions.filter((i) => i.presence === 'present').length;

  // Statistiques
  const totalAvis = enrichedEvaluations.length;
  const avgRating = totalAvis > 0 
    ? (enrichedEvaluations.reduce((sum, ev) => sum + (Number(ev.note) || 0), 0) / totalAvis).toFixed(1) 
    : '0';
  
  const responseRate = presentsCount > 0 ? Math.round((totalAvis / presentsCount) * 100) : 0;
  
  const recommendCount = enrichedEvaluations.filter(ev => ev.note >= 4).length;
  const recommendRate = totalAvis > 0 ? Math.round((recommendCount / totalAvis) * 100) : 0;

  // Répartition des notes
  const notesDistribution = [5, 4, 3, 2, 1].map(star => {
    return {
      star,
      count: enrichedEvaluations.filter(ev => Math.round(ev.note) === star).length
    };
  });

  // Filtrer la liste des commentaires selon l'onglet actif
  const filteredComments = enrichedEvaluations.filter((ev) => {
    if (activeFilter === '5') return Math.round(ev.note) === 5;
    if (activeFilter === '4etmoins') return Math.round(ev.note) <= 4;
    return true;
  });

  const badge = formatDateBadge(event.dateDebut);

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

        {/* KPI Strip Évaluations */}
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

        {/* Contenu Principal : 2 Colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
          
          {/* Colonne de gauche : Répartition des notes */}
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

          {/* Colonne de droite : Commentaires */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', overflow: 'hidden', boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)' }}>
            
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0ece3' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>Commentaires</h3>
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
                            {initials}
                          </div>
                          <div>
                            {/* CORRECTION : Affichage du prénom et nom joints */}
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1c1a22' }}>
                              {ev.prenom} {ev.nom}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <div style={{ display: 'flex' }}>{renderStars(ev.note)}</div>
                          <span style={{ fontSize: '11px', color: '#8a8694' }}>il y a 1 j</span>
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#4a4652', paddingLeft: '44px' }}>
                        {ev.commentaire || "Aucun commentaire textuel fourni."}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ================= MODALE D'ANNULATION D'ÉVÉNEMENT (Popup) ================= */}
        {isCancelEventModalOpen && (
          <Popup
            title={`Annuler « ${event.titre} » ?`}
            body={`Les ${evtInscriptions.length} participants et les personnes en liste d'attente seront prévenus par e-mail. Cette action est définitive.`}
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