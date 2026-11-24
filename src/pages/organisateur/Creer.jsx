import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import { PrimaryButton, SecondaryButton } from '../../components/buttons';
import { createEvent } from '../../store/evenementActions';

const STEPS = [
  { id: 1, label: 'Infos' },
  { id: 2, label: 'Sessions' },
  { id: 3, label: 'Prix et capacité' },
  { id: 4, label: 'Aperçu' },
];

const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

export default function Creer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.evenements);

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    titre: '',
    categorie: 'Conférence',
    lieu: '',
    description: '',
    dateDebut: '',
    heureDebut: '',
    dateFin: '',
    heureFin: '',
    image: null,
    prix: '',
    capacite: '',
    gratuit: false,
    validationManuelle: false,
  });

  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    debut: '',
    fin: '',
    titre: '',
    intervenant: '',
    salle: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNewSessionChange = (e) => {
    const { name, value } = e.target;
    setNewSession((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSession = () => {
    if (!newSession.titre) return;
    const sessionToAdd = { ...newSession, id: Date.now() };
    setSessions((prev) => [...prev, sessionToAdd]);
    setNewSession({ debut: '', fin: '', titre: '', intervenant: '', salle: '' });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (statut) => {
    const eventToCreate = {
      ...formData,
      organisateurId: currentUser?.id,
      statut,
      sessions,
    };
    dispatch(createEvent(eventToCreate));
    navigate('/organisateur/evenements');
  };

  const formatDateApercu = () => {
    if (!formData.dateDebut) return 'Date à choisir';
    const d = new Date(formData.dateDebut);
    if (Number.isNaN(d.getTime())) return 'Date à choisir';
    return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
  };

  const getCategorieBg = (cat) => {
    switch (cat) {
      case 'Atelier':
        return {
          bg: 'linear-gradient(135deg, #d5eef2 0%, #c4e4ea 100%)',
          catBg: '#e7f5f7',
          catColor: '#2c6572',
        };
      case 'Conférence':
        return {
          bg: 'linear-gradient(135deg, #ece6f8 0%, #e1d9f4 100%)',
          catBg: '#f4f0fc',
          catColor: '#5847d8',
        };
      default:
        return {
          bg: 'linear-gradient(135deg, #e2e7f3 0%, #d4dce9 100%)',
          catBg: '#eff2f9',
          catColor: '#3f5073',
        };
    }
  };

  const palette = getCategorieBg(formData.categorie);

  return (
    <AppShell role={currentUser?.role || 'organisateur'}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          backgroundColor: '#f7f4ed',
          minHeight: '100%',
          padding: '8px 4px 24px',
        }}
      >
        {/* En-tête */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p
              style={{ margin: '0 0 8px', fontSize: '12px', color: '#8a8694', cursor: 'pointer' }}
              onClick={() => navigate('/organisateur/evenements')}
            >
              ← Mes événements
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: '26px',
                fontWeight: 700,
                color: '#1b1922',
                letterSpacing: '-0.02em',
              }}
            >
              Créer un événement
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#7c7885' }}>
              Étape {currentStep} sur 4 : {STEPS[currentStep - 1].label.toLowerCase()}
            </p>
          </div>
          <SecondaryButton
            text="Enregistrer et quitter"
            onClick={() => navigate('/organisateur/evenements')}
          />
        </div>

        {/* Stepper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '12px 24px',
            border: '1px solid #ece8df',
            marginBottom: '8px',
          }}
        >
          {STEPS.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isDone = step.id < currentStep;
            return (
              <React.Fragment key={step.id}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? '#5847d8' : isDone ? '#e5e0f7' : '#f3f0e9',
                      color: isActive ? '#ffffff' : isDone ? '#5847d8' : '#8a8694',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {isDone ? '✓' : step.id}
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#1b1922' : '#7c7885',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#ece8df', margin: '0 12px' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Formulaire + Aperçu */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 280px',
            gap: '18px',
            alignItems: 'start',
          }}
        >
          {/* Formulaire principal */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #ece8df',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)',
            }}
          >
            {/* ÉTAPE 1 — INFOS */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1b1922', marginBottom: '6px' }}>
                    Titre *
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleChange}
                    placeholder="Ex. Atelier Design Thinking"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e6e2d8',
                      fontSize: '13px',
                      color: '#1b1922',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1b1922', marginBottom: '6px' }}>
                      Catégorie *
                    </label>
                    <select
                      name="categorie"
                      value={formData.categorie}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e6e2d8',
                        fontSize: '13px',
                        color: '#1b1922',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                      }}
                    >
                      <option value="Conférence">Conférence</option>
                      <option value="Atelier">Atelier</option>
                      <option value="Meetup">Meetup</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1b1922', marginBottom: '6px' }}>
                      Lieu ou adresse *
                    </label>
                    <input
                      type="text"
                      name="lieu"
                      value={formData.lieu}
                      onChange={handleChange}
                      placeholder="Ex. ISMO Tétouan, Salle 3"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e6e2d8',
                        fontSize: '13px',
                        color: '#1b1922',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1b1922', marginBottom: '6px' }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez l’événement en quelques phrases"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e6e2d8',
                      fontSize: '13px',
                      color: '#1b1922',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1b1922', marginBottom: '6px' }}>
                      Début *
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="date"
                        name="dateDebut"
                        value={formData.dateDebut}
                        onChange={handleChange}
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e6e2d8',
                          fontSize: '13px',
                          color: '#1b1922',
                          outline: 'none',
                        }}
                      />
                      <input
                        type="time"
                        name="heureDebut"
                        value={formData.heureDebut}
                        onChange={handleChange}
                        style={{
                          width: '100px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e6e2d8',
                          fontSize: '13px',
                          color: '#1b1922',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1b1922', marginBottom: '6px' }}>
                      Fin *
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="date"
                        name="dateFin"
                        value={formData.dateFin}
                        onChange={handleChange}
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e6e2d8',
                          fontSize: '13px',
                          color: '#1b1922',
                          outline: 'none',
                        }}
                      />
                      <input
                        type="time"
                        name="heureFin"
                        value={formData.heureFin}
                        onChange={handleChange}
                        style={{
                          width: '100px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e6e2d8',
                          fontSize: '13px',
                          color: '#1b1922',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1b1922', marginBottom: '6px' }}>
                    Affiche ou image
                  </label>
                  <div
                    style={{
                      border: '1.5px dashed #dcd7cc',
                      borderRadius: '8px',
                      padding: '24px',
                      textAlign: 'center',
                      backgroundColor: '#faf8f4',
                      color: '#8a8694',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Glissez une image ici ou <span style={{ color: '#5847d8', fontWeight: 600 }}>parcourez vos fichiers</span>
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 2 — SESSIONS */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>Programme</h3>
                    <span style={{ fontSize: '12px', color: '#8a8694' }}>{sessions.length} sessions</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sessions.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid #ece8df',
                          backgroundColor: '#faf8f4',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#1b1922', width: '90px' }}>
                            {s.debut || '--:--'} – {s.fin || '--:--'}
                          </span>
                          <span style={{ fontSize: '12px', color: '#1b1922' }}>{s.titre}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '11px', color: '#8a8694' }}>{s.intervenant || 'Intervenant'}</span>
                          <button
                            type="button"
                            style={{
                              background: 'none',
                              border: '1px solid #e6e2d8',
                              borderRadius: '6px',
                              padding: '4px 10px',
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
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #ece8df', paddingTop: '20px' }}>
                  <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>Nouvelle session</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5f5b66', marginBottom: '4px' }}>Début</label>
                        <input
                          type="time"
                          name="debut"
                          value={newSession.debut}
                          onChange={handleNewSessionChange}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #e6e2d8',
                            fontSize: '12px',
                            color: '#1b1922',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5f5b66', marginBottom: '4px' }}>Fin</label>
                        <input
                          type="time"
                          name="fin"
                          value={newSession.fin}
                          onChange={handleNewSessionChange}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #e6e2d8',
                            fontSize: '12px',
                            color: '#1b1922',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5f5b66', marginBottom: '4px' }}>Salle</label>
                        <input
                          type="text"
                          name="salle"
                          value={newSession.salle}
                          onChange={handleNewSessionChange}
                          placeholder="Ex. Salle 3"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: '1px solid #e6e2d8',
                            fontSize: '12px',
                            color: '#1b1922',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5f5b66', marginBottom: '4px' }}>Titre *</label>
                      <input
                        type="text"
                        name="titre"
                        value={newSession.titre}
                        onChange={handleNewSessionChange}
                        placeholder="Ex. Base de données et requêtes"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #e6e2d8',
                          fontSize: '12px',
                          color: '#1b1922',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#5f5b66', marginBottom: '4px' }}>Intervenant</label>
                      <input
                        type="text"
                        name="intervenant"
                        value={newSession.intervenant}
                        onChange={handleNewSessionChange}
                        placeholder="Nom de l'intervenant"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid #e6e2d8',
                          fontSize: '12px',
                          color: '#1b1922',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleAddSession}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '999px',
                          border: '1px solid #e6e2d8',
                          backgroundColor: '#ffffff',
                          color: '#5e5a66',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Ajouter la session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 3 — PRIX ET CAPACITÉ */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1b1922', marginBottom: '6px' }}>
                      Prix par personne (MAD)
                    </label>
                    <input
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleChange}
                      placeholder="Ex. 100"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e6e2d8',
                        fontSize: '13px',
                        color: '#1b1922',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1b1922', marginBottom: '6px' }}>
                      Capacité (places) *
                    </label>
                    <input
                      type="number"
                      name="capacite"
                      value={formData.capacite}
                      onChange={handleChange}
                      placeholder="Ex. 30"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e6e2d8',
                        fontSize: '13px',
                        color: '#1b1922',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 0',
                    borderTop: '1px solid #ece8df',
                    borderBottom: '1px solid #ece8df',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1b1922', marginBottom: '2px' }}>
                      Événement gratuit
                    </div>
                    <div style={{ fontSize: '11px', color: '#8a8694' }}>
                      Aucun paiement demandé à l'inscription
                    </div>
                  </div>
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, gratuit: !prev.gratuit }))}
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '999px',
                      backgroundColor: formData.gratuit ? '#5847d8' : '#e6e2d8',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        position: 'absolute',
                        top: '2px',
                        left: formData.gratuit ? '20px' : '2px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1b1922', marginBottom: '2px' }}>
                      Valider chaque inscription
                    </div>
                    <div style={{ fontSize: '11px', color: '#8a8694' }}>
                      Vous acceptez ou refusez chaque demande avant qu'elle soit confirmée
                    </div>
                  </div>
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, validationManuelle: !prev.validationManuelle }))}
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '999px',
                      backgroundColor: formData.validationManuelle ? '#5847d8' : '#e6e2d8',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        position: 'absolute',
                        top: '2px',
                        left: formData.validationManuelle ? '20px' : '2px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ÉTAPE 4 — APERÇU */}
            {currentStep === 4 && (
              <div>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#1b1922' }}>
                  Récapitulatif
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBottom: '8px',
                      borderBottom: '1px solid #f0ece3',
                    }}
                  >
                    <span style={{ color: '#8a8694', fontWeight: 600, width: '120px' }}>INFOS</span>
                    <span style={{ color: '#1b1922', flex: 1 }}>
                      {formData.titre || 'Titre'} - {formData.categorie} · {formData.lieu || 'Lieu'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#5847d8',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Modifier
                    </button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBottom: '8px',
                      borderBottom: '1px solid #f0ece3',
                    }}
                  >
                    <span style={{ color: '#8a8694', fontWeight: 600, width: '120px' }}>DATES</span>
                    <span style={{ color: '#1b1922', flex: 1 }}>
                      {formatDateApercu()}, {formData.heureDebut || '--:--'} – {formData.heureFin || '--:--'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#5847d8',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Modifier
                    </button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBottom: '8px',
                      borderBottom: '1px solid #f0ece3',
                    }}
                  >
                    <span style={{ color: '#8a8694', fontWeight: 600, width: '120px' }}>SESSIONS</span>
                    <span style={{ color: '#1b1922', flex: 1 }}>{sessions.length} sessions au programme</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#5847d8',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Modifier
                    </button>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingBottom: '8px',
                      borderBottom: '1px solid #f0ece3',
                    }}
                  >
                    <span style={{ color: '#8a8694', fontWeight: 600, width: '120px' }}>PRIX</span>
                    <span style={{ color: '#1b1922', flex: 1 }}>
                      {formData.gratuit ? 'Gratuit' : `${formData.prix || '0'} MAD par personne`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#5847d8',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Modifier
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                    <span style={{ color: '#8a8694', fontWeight: 600, width: '120px' }}>CAPACITÉ</span>
                    <span style={{ color: '#1b1922', flex: 1 }}>
                      {formData.capacite || '0'} places ·{' '}
                      {formData.validationManuelle ? 'validation manuelle' : 'liste d’attente'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#5847d8',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pied du formulaire */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid #ece8df',
              }}
            >
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentStep === 1 ? '#c0bcc6' : '#5e5a66',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: currentStep === 1 ? 'default' : 'pointer',
                }}
              >
                ← Retour
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  style={{
                    backgroundColor: '#5847d8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '10px 24px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Continuer : {STEPS[currentStep].label} →
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => handleSubmit('brouillon')}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#1b1922',
                      border: '1px solid #e6e2d8',
                      borderRadius: '999px',
                      padding: '10px 24px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Enregistrer comme brouillon
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmit('publie')}
                    style={{
                      backgroundColor: '#5847d8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '10px 24px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Publier l'événement
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Aperçu en direct */}
          <div style={{ position: 'sticky', top: '20px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#8a8694',
                letterSpacing: '0.06em',
                marginBottom: '12px',
              }}
            >
              APERÇU EN DIRECT
            </div>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #ece8df',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(27, 25, 34, 0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  backgroundImage: palette.bg,
                  padding: '14px 16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '120px',
                }}
              >
                <div>
                  <span
                    style={{
                      backgroundColor: palette.catBg,
                      color: palette.catColor,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {formData.categorie || 'Catégorie'}
                  </span>
                </div>
                <div style={{ marginTop: '24px', fontSize: '15px', fontWeight: 700, color: '#1b1922' }}>
                  {formatDateApercu()}
                </div>
              </div>
              <div style={{ padding: '16px 18px 18px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#1b1922' }}>
                  {formData.titre || 'Titre de l’événement'}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#8a8694' }}>
                  {formData.lieu ? `${formData.lieu}${formData.prix ? ` · ${formData.prix} MAD` : ''}` : 'Lieu à renseigner'}
                </p>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: '#8a8694', marginTop: '16px', lineHeight: 1.5 }}>
              Les champs marqués * sont obligatoires.
              <br />
              Votre brouillon est enregistré automatiquement.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}