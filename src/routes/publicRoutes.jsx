import { Route } from 'react-router-dom';
import Accueil from '../pages/public/Accueil';
import Evenements from '../pages/public/Evenements';
import EvenementDetail from '../pages/public/EvenementDetail';
import Connexion from '../pages/public/Connexion';
import CreerCompte from '../pages/public/CreerCompte';
import MotDePasseOublie from '../pages/public/MotDePasseOublie';
import NouveauMotDePasse from '../pages/public/NouveauMotDePasse';
import APropos from '../pages/public/APropos';
import AccesRefuse from '../pages/public/AccesRefuse';
import PageIntrouvable from '../pages/public/PageIntrouvable';

export default function publicRoutes() {
  return (
    <>
      <Route path="/" element={<Accueil />} />
      <Route path="/evenements" element={<Evenements />} />
      <Route path="/evenements/:id" element={<EvenementDetail />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/creer-un-compte" element={<CreerCompte />} />
      <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
      <Route path="/reinitialiser-mot-de-passe/:token" element={<NouveauMotDePasse />} />
      <Route path="/a-propos" element={<APropos />} />
      <Route path="/acces-refuse" element={<AccesRefuse />} />
      <Route path="*" element={<PageIntrouvable />} />
    </>
  );
}
