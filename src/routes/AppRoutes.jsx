import { Routes, Route } from 'react-router-dom';
import ComponentsTest from '../pages/ComponentsTest';
import publicRoutes from './publicRoutes';
import participantRoutes from './participantRoutes';
import organisateurRoutes from './organisateurRoutes';
import administrateurRoutes from './administrateurRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      {publicRoutes()}
      {participantRoutes()}
      {organisateurRoutes()}
      {administrateurRoutes()}
      <Route path="/test" element={<ComponentsTest />} />
    </Routes>
  );
}
