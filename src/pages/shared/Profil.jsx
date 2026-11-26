
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";




import AppShell from "../../layouts/AppShell";
import PageTitle from "../../components/titles";
import Card from "../../components/cards";
import DescriptionList from "../../components/descriptions";
import { Avatar } from "../../components/tags";
import { TextInput, EmailInput, FileInput } from "../../components/inputs";
import { PrimaryButton, SecondaryButton } from "../../components/buttons";
import { utilisateursDemo } from "../../store/demo";

import { updateUser } from "../../store/evenementActions"; // ← AJOUT

import "./Profil.css";

export default function Profil(props) {
  const dispatch = useDispatch(); // ← AJOUT

  // ✅ On lit utilisateurs ET currentUser depuis le MÊME store (state.evenements)
  const { currentUser, utilisateurs = [] } = useSelector(
    (state) => state.evenements || {}
  );

  const userId = currentUser?.id || utilisateursDemo?.[props.role];
  const utilisateur =
    utilisateurs.find((u) => Number(u.id) === Number(userId)) ||
    currentUser || {
      prenom: "Utilisateur",
      nom: "",
      email: "email@exemple.com",
      telephone: "—",
      ville: "—",
      dateInscription: "—",
    };

  const valeursInitiales = {
    prenom: utilisateur.prenom || "",
    nom: utilisateur.nom || "",
    email: utilisateur.email || "",
    telephone: utilisateur.telephone || "",
    ville: utilisateur.ville || "",
  };

  const [modification, setModification] = useState(false);
  const [valeurs, setValeurs] = useState(valeursInitiales);

  // ✅ Resynchroniser quand le store est mis à jour (après dispatch)
  useEffect(() => {
    setValeurs(valeursInitiales);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    utilisateur.id,
    utilisateur.prenom,
    utilisateur.nom,
    utilisateur.email,
    utilisateur.telephone,
    utilisateur.ville,
  ]);

  // ✅ Sauvegarde dans le store Redux
  const handleSave = () => {
    dispatch(updateUser(userId, valeurs));
    setModification(false);
  };

  return (
    <AppShell role={props.role}>
      <PageTitle title="Profil" />

      {modification ? (
        <Card title="Modifier le profil">
          <div className="profil_form">
            <TextInput
              label="Prénom"
              placeholder="Votre prénom"
              value={valeurs.prenom}
              onChange={(e) => setValeurs({ ...valeurs, prenom: e.target.value })}
            />
            <TextInput
              label="Nom"
              placeholder="Votre nom"
              value={valeurs.nom}
              onChange={(e) => setValeurs({ ...valeurs, nom: e.target.value })}
            />
            <EmailInput
              label="E-mail"
              placeholder="nom@exemple.com"
              value={valeurs.email}
              onChange={(e) => setValeurs({ ...valeurs, email: e.target.value })}
            />
            <TextInput
              label="Téléphone"
              placeholder="06 00 00 00 00"
              value={valeurs.telephone}
              onChange={(e) => setValeurs({ ...valeurs, telephone: e.target.value })}
            />
            <TextInput
              label="Ville"
              placeholder="Votre ville"
              value={valeurs.ville}
              onChange={(e) => setValeurs({ ...valeurs, ville: e.target.value })}
            />
            <FileInput label="Photo" />
          </div>
          <div className="profil_actions">
            <SecondaryButton
              text="Annuler"
              onClick={() => {
                setValeurs(valeursInitiales);
                setModification(false);
              }}
            />
            <PrimaryButton text="Enregistrer" onClick={handleSave} />
          </div>
        </Card>
      ) : (
        <Card>
          <div className="profil_head">
            <Avatar
              initials={
                (utilisateur.prenom?.[0] || "?") + (utilisateur.nom?.[0] || "")
              }
              size={72}
            />
            <div className="profil_head_text">
              <h2 className="profil_name">
                {utilisateur.prenom} {utilisateur.nom}
              </h2>
              <span className="profil_email">{utilisateur.email}</span>
            </div>
            <PrimaryButton
              text="Modifier le profil"
              onClick={() => setModification(true)}
            />
          </div>
          <DescriptionList
            items={[
              { label: "Téléphone", value: utilisateur.telephone || "—" },
              { label: "Ville", value: utilisateur.ville || "—" },
              { label: "Membre depuis", value: utilisateur.dateInscription || "—" },
            ]}
          />
        </Card>
      )}
    </AppShell>
  );
}