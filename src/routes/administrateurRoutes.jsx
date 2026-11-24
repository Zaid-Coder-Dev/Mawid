import { Route } from 'react-router-dom';
import Dashboard from '../pages/administrateur/Dashboard';
import Utilisateurs from '../pages/administrateur/Utilisateurs';
import GestionPaiements from '../pages/administrateur/GestionPaiements';
import GestionInscriptions from '../pages/administrateur/GestionInscriptions';
import GestionEvaluations from '../pages/administrateur/GestionEvaluations';
import Profil from '../pages/shared/Profil';

export default function administrateurRoutes() {
  return (
    <>
      <Route path="/admin/tableau-de-bord" element={<Dashboard />} />
      <Route path="/admin/utilisateurs" element={<Utilisateurs />} />
      <Route path="/admin/gestion/paiements" element={<GestionPaiements />} />
      <Route path="/admin/gestion/inscriptions" element={<GestionInscriptions />} />
      <Route path="/admin/gestion/evaluations" element={<GestionEvaluations />} />
      <Route path="/admin/profil" element={<Profil role="administrateur" />} />
    </>
  );
}
