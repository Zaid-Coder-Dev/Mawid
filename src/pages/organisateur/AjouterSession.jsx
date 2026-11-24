import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import { PrimaryButton, SecondaryButton } from '../../components/buttons';
// Assurez-vous d'avoir ces actions dans votre store
import { addSession, updateSession } from '../../store/evenementActions'; 

export default function FormulaireSession() {
  // On récupère l'ID de l'événement ET l'ID de la session (s'il existe)
  const { id, sessionId } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEditMode = Boolean(sessionId);

  const { evenements, sessions, currentUser } = useSelector((state) => state.evenements || {});
  const event = evenements?.find((e) => Number(e.id) === Number(id));
  
  // On cherche la session à modifier si on est en mode édition
  const sessionToEdit = isEditMode 
    ? (sessions || []).find(s => Number(s.id) === Number(sessionId)) 
    : null;

  const [session, setSession] = useState({
    heureDebut: '',
    heureFin: '',
    titre: '',
    intervenantId: '',
    salle: '',
  });

  // Effet pour pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (isEditMode && sessionToEdit) {
      setSession({
        heureDebut: sessionToEdit.heureDebut || '',
        heureFin: sessionToEdit.heureFin || '',
        titre: sessionToEdit.titre || '',
        intervenantId: sessionToEdit.intervenantId || '',
        salle: sessionToEdit.salle || '',
      });
    }
  }, [isEditMode, sessionToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSession((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!session.titre) {
      alert('Le titre de la session est obligatoire.');
      return;
    }

    const payload = {
      ...session,
      evenementId: Number(id),
    };

    if (isEditMode) {
      // Action de mise à jour
      dispatch(updateSession(Number(sessionId), payload));
    } else {
      // Action d'ajout
      dispatch(addSession(payload));
    }

    // Retour à la liste des sessions
    navigate(`/organisateur/evenements/${id}/sessions`);
  };

  if (!event) {
    return (
      <AppShell role={currentUser?.role || 'organisateur'}>
        <div style={{ padding: '40px', textAlign: 'center', color: '#8a8694' }}>
          Événement introuvable.
        </div>
      </AppShell>
    );
  }

  // Si on est en mode édition mais que la session n'existe pas
  if (isEditMode && !sessionToEdit) {
     return (
      <AppShell role={currentUser?.role || 'organisateur'}>
        <div style={{ padding: '40px', textAlign: 'center', color: '#8a8694' }}>
          Session introuvable.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role={currentUser?.role || 'organisateur'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#f7f4ed', minHeight: '100%', padding: '8px 4px 24px' }}>
        
        {/* Fil d'ariane */}
        <p style={{ margin: 0, fontSize: '12px', color: '#8a8694', cursor: 'pointer' }} onClick={() => navigate(`/organisateur/evenements/${id}/sessions`)}>
          ← Retour aux sessions
        </p>

        {/* En-tête */}
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1b1922' }}>
            {isEditMode ? 'Modifier la session' : 'Ajouter une session'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#7c7885' }}>
            Événement : <strong>{event.titre}</strong>
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #ece8df', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '640px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Début *</label>
              <input type="time" name="heureDebut" value={session.heureDebut} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Fin *</label>
              <input type="time" name="heureFin" value={session.heureFin} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Salle</label>
              <input type="text" name="salle" value={session.salle} onChange={handleChange} placeholder="Ex. Salle 3" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Titre de la session *</label>
            <input type="text" name="titre" value={session.titre} onChange={handleChange} placeholder="Ex. Base de données et requêtes" required style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Intervenant (ID)</label>
            <input type="number" name="intervenantId" value={session.intervenantId} onChange={handleChange} placeholder="Ex. 1" style={inputStyle} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <SecondaryButton text="Annuler" onClick={() => navigate(`/organisateur/evenements/${id}/sessions`)} />
            <PrimaryButton text={isEditMode ? "Enregistrer les modifications" : "Ajouter la session"} type="submit" />
          </div>
        </form>
      </div>
    </AppShell>
  );
}

const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 600, color: '#5f5b66', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e6e2d8', fontSize: '13px', color: '#1b1922', outline: 'none' };