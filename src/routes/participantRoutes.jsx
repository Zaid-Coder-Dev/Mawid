import { Route } from 'react-router-dom';
import Dashboard from '../pages/participant/Dashboard';
import Reservations from '../pages/participant/Reservations';
import Profil from '../pages/shared/Profil';

export default function participantRoutes() {
  return (
    <>
      <Route path="/participant/tableau-de-bord" element={<Dashboard />} />
      <Route path="/participant/reservations" element={<Reservations />} />
      <Route path="/participant/profil" element={<Profil role="participant" />} />
    </>
  );
}
