import { Route } from 'react-router-dom';
import Dashboard from '../pages/participant/Dashboard';


export default function participantRoutes() {
  return (
    <>
      <Route path="/participant/tableau-de-bord" element={<Dashboard />} />
    </>
  );
}
