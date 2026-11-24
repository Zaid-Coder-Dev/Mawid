import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../layouts/AppShell';
import { PrimaryButton, SecondaryButton } from '../../components/buttons';
import { updateEvent } from '../../store/evenementActions';

export default function Modifier() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { evenements, currentUser } = useSelector((state) => state.evenements || {});
  
  // On cherche l'événement à modifier
  const eventToEdit = evenements?.find((e) => Number(e.id) === Number(id));

  // État local pour le formulaire
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: 'Atelier',
    dateDebut: '',
    dateFin: '',
    adresse: '',
    ville: '',
    capaciteMax: '',
    prix: '',
    validationManuelle: false,
  });

  // Remplir le formulaire dès que l'événement est trouvé
  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        titre: eventToEdit.titre || '',
        description: eventToEdit.description || '',
        categorie: eventToEdit.categorie || 'Atelier',
        dateDebut: eventToEdit.dateDebut || '',
        dateFin: eventToEdit.dateFin || '',
        adresse: eventToEdit.adresse || '',
        ville: eventToEdit.ville || '',
        capaciteMax: eventToEdit.capaciteMax || '',
        prix: eventToEdit.prix || 0,
        validationManuelle: eventToEdit.validationManuelle || false,
      });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.titre || !formData.dateDebut || !formData.dateFin) {
      alert('Veuillez remplir les champs obligatoires (Titre, Date de début, Date de fin).');
      return;
    }

    // On prépare les données à envoyer au store
    const updates = {
      ...formData,
      capaciteMax: Number(formData.capaciteMax) || 0,
      prix: Number(formData.prix) || 0,
    };

    // Dispatch de l'action avec l'ID et les modifications
    dispatch(updateEvent(Number(id), updates));

    // Redirection vers la page de détails de l'événement
    navigate(`/organisateur/evenements/${id}`);
  };

  if (!eventToEdit) {
    return (
      <AppShell role={currentUser?.role || 'organisateur'}>
        <div style={{ padding: '40px', textAlign: 'center', color: '#8a8694' }}>
          Événement introuvable.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role={currentUser?.role || 'organisateur'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#f7f4ed', minHeight: '100%', padding: '8px 4px 24px' }}>
        
        {/* Fil d'ariane */}
        <p 
          style={{ margin: 0, fontSize: '12px', color: '#8a8694', cursor: 'pointer' }}
          onClick={() => navigate(`/organisateur/evenements/${id}`)}
        >
          ← Retour à l'événement
        </p>

        {/* En-tête */}
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1b1922' }}>
            Modifier l'événement
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#7c7885' }}>
            Mettez à jour les informations de l'événement.
          </p>
        </div>

        {/* Formulaire */}
        <form 
          onSubmit={handleSubmit}
          style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '16px', 
            border: '1px solid #ece8df', 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px', 
            maxWidth: '800px' 
          }}
        >
          {/* Titre */}
          <div>
            <label style={labelStyle}>Titre de l'événement *</label>
            <input 
              type="text" 
              name="titre" 
              value={formData.titre} 
              onChange={handleChange} 
              placeholder="Ex. Atelier Développement Web"
              required 
              style={inputStyle} 
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Décrivez votre événement..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }} 
            />
          </div>

          {/* Catégorie et Prix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Catégorie</label>
              <select name="categorie" value={formData.categorie} onChange={handleChange} style={inputStyle}>
                <option value="Atelier">Atelier</option>
                <option value="Conférence">Conférence</option>
                <option value="Concert">Concert</option>
                <option value="Salon">Salon</option>
                <option value="Sport">Sport</option>
                <option value="Formation">Formation</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Prix (MAD)</label>
              <input 
                type="number" 
                name="prix" 
                value={formData.prix} 
                onChange={handleChange} 
                min="0"
                placeholder="0 pour gratuit"
                style={inputStyle} 
              />
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Date et heure de début *</label>
              <input 
                type="datetime-local" 
                name="dateDebut" 
                value={formData.dateDebut} 
                onChange={handleChange} 
                required 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>Date et heure de fin *</label>
              <input 
                type="datetime-local" 
                name="dateFin" 
                value={formData.dateFin} 
                onChange={handleChange} 
                required 
                style={inputStyle} 
              />
            </div>
          </div>

          {/* Lieu */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Adresse</label>
              <input 
                type="text" 
                name="adresse" 
                value={formData.adresse} 
                onChange={handleChange} 
                placeholder="Ex. ISMO Tétouan, Salle 3"
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}>Ville</label>
              <input 
                type="text" 
                name="ville" 
                value={formData.ville} 
                onChange={handleChange} 
                placeholder="Ex. Tétouan"
                style={inputStyle} 
              />
            </div>
          </div>

          {/* Capacité et Validation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Capacité maximale</label>
              <input 
                type="number" 
                name="capaciteMax" 
                value={formData.capaciteMax} 
                onChange={handleChange} 
                min="1"
                placeholder="Ex. 30"
                style={inputStyle} 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '24px' }}>
              <input 
                type="checkbox" 
                name="validationManuelle" 
                checked={formData.validationManuelle} 
                onChange={handleChange}
                id="validationManuelle"
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="validationManuelle" style={{ fontSize: '13px', color: '#5f5b66', cursor: 'pointer' }}>
                Validation manuelle des inscriptions
              </label>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '20px', borderTop: '1px solid #f0ece3' }}>
            <SecondaryButton 
              text="Annuler" 
              onClick={() => navigate(`/organisateur/evenements/${id}`)} 
            />
            <PrimaryButton 
              text="Enregistrer les modifications" 
              type="submit" 
            />
          </div>
        </form>
      </div>
    </AppShell>
  );
}

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#1b1922', marginBottom: '6px' };
const inputStyle = { 
  width: '100%', 
  padding: '10px 12px', 
  borderRadius: '8px', 
  border: '1px solid #e6e2d8', 
  fontSize: '13px', 
  color: '#1b1922', 
  outline: 'none',
  fontFamily: 'inherit',
  backgroundColor: '#ffffff',
};