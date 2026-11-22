import { Route } from 'react-router-dom';
import Dashboard from '../pages/participant/Dashboard';

export default function publicRoutes() {
  return (
    <>
      <Route path="/" element={<Dashboard />} />
    </>
  );
}
