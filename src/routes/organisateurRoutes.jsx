import { Route } from 'react-router-dom';
import Dashboard from '../pages/organisateur/Dashboard';
import Evenements from '../pages/organisateur/Evenements';
import Creer from '../pages/organisateur/Creer';
import Detail from '../pages/organisateur/Detail';
import DetailSessions from '../pages/organisateur/DetailSessions';
import DetailParticipants from '../pages/organisateur/DetailParticipants';
import DetailInscriptions from '../pages/organisateur/DetailInscriptions';
import DetailEvaluations from '../pages/organisateur/DetailEvaluations';
import DetailStatistiques from '../pages/organisateur/DetailStatistiques';
import Modifier from '../pages/organisateur/Modifier';
import Profil from '../pages/shared/Profil';


// On importe le composant qui gère le formulaire (Ajout ET Modification)
import FormulaireSession from '../pages/organisateur/AjouterSession'; 


export default function organisateurRoutes() {
  return (
    <>
      <Route path="/organisateur/tableau-de-bord" element={<Dashboard />} />
      <Route path="/organisateur/evenements" element={<Evenements />} />
      <Route path="/organisateur/evenements/nouveau" element={<Creer />} />
      <Route path="/organisateur/evenements/:id" element={<Detail />} />
      
      {/* Route pour la liste des sessions */}
      <Route path="/organisateur/evenements/:id/sessions" element={<DetailSessions />} />
      
      {/* Route pour AJOUTER une session */}
      <Route path="/organisateur/evenements/:id/sessions/nouvelle" element={<FormulaireSession />} />
      
      {/* Route pour MODIFIER une session (ajout du paramètre :sessionId) */}
      <Route path="/organisateur/evenements/:id/sessions/modifier/:sessionId" element={<FormulaireSession />} />
      
      <Route path="/organisateur/evenements/:id/participants" element={<DetailParticipants />} />
      <Route path="/organisateur/evenements/:id/inscriptions" element={<DetailInscriptions />} />
      <Route path="/organisateur/evenements/:id/evaluations" element={<DetailEvaluations />} />
      <Route path="/organisateur/evenements/:id/statistiques" element={<DetailStatistiques />} />
      <Route path="/organisateur/evenements/:id/modifier" element={<Modifier />} />
      <Route path="/organisateur/profil" element={<Profil role="organisateur" />} />
    </>
  );
}