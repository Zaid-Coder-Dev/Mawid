import { Bell } from 'lucide-react';
import AppShell from '../layouts/AppShell';
import { PrimaryButton, SecondaryButton, DangerButton, IconButton } from '../components/buttons';
import {
  TextInput,
  NumberInput,
  EmailInput,
  PasswordInput,
  DateInput,
  TimeInput,
  SearchInput,
  TextArea,
  Select,
  Checkbox,
  Radio,
  Switch,
  FileInput,
} from '../components/inputs';
import { StatusTag, Chip, Avatar, DateBadge, ProgressBar, ProgressRing } from '../components/tags';
import { DonutChart } from '../components/Diagram';
import { Banner, EmptyState, Toast, Skeleton } from '../components/messages';
import { Popup, Drawer } from '../components/popups';
import { Loader } from '../components/loader';
import './ComponentsTest.css';

function Demo(props) {
  return (
    <div className="demo_item">
      <code className="demo_name">{props.name}</code>
      {props.params && (
        <div className="demo_params">
          {props.params.map((param) => (
            <div key={param[0]}>
              <b className="demo_param_name">{param[0]}</b>: {param[1]}
            </div>
          ))}
        </div>
      )}
      {props.children}
    </div>
  );
}

export default function ComponentsTest() {
  return (
    <AppShell role="participant">
      <div className="demo">
        <h1>Composants</h1>
        <p className="demo_intro">
          Chaque composant affiche son nom, puis ses paramètres en rouge avec leur rôle. Un paramètre
          s’écrit dans la balise : <code>{'<PrimaryButton text="Publier" />'}</code>. Quand un
          composant a plusieurs variantes, les paramètres sont écrits sous la première.
        </p>

        <section className="demo_section">
          <h2>Boutons (buttons)</h2>
          <div className="demo_row">
            <Demo name="PrimaryButton" params={[['text', 'le mot sur le bouton']]}>
              <PrimaryButton text="Publier" />
            </Demo>
            <Demo name="SecondaryButton" params={[['text', 'le mot sur le bouton']]}>
              <SecondaryButton text="Annuler" />
            </Demo>
            <Demo name="DangerButton" params={[['text', 'le mot sur le bouton']]}>
              <DangerButton text="Retirer" />
            </Demo>
            <Demo
              name="IconButton"
              params={[
                ['icon', 'l’icône, ex. icon={<Bell size={18} />}'],
                ['label', 'texte lu par les lecteurs d’écran'],
              ]}
            >
              <IconButton icon={<Bell size={18} />} label="Notifications" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Champs (inputs)</h2>
          <div className="demo_grid">
            <Demo
              name="TextInput"
              params={[
                ['label', 'le titre au-dessus du champ'],
                ['placeholder', 'le texte gris dans le champ'],
              ]}
            >
              <TextInput label="Titre" placeholder="Ex. Atelier Design Thinking" />
            </Demo>
            <Demo
              name="NumberInput"
              params={[
                ['label', 'le titre au-dessus du champ'],
                ['placeholder', 'le texte gris dans le champ'],
              ]}
            >
              <NumberInput label="Prix (MAD)" placeholder="50" />
            </Demo>
            <Demo
              name="EmailInput"
              params={[
                ['label', 'le titre au-dessus du champ'],
                ['placeholder', 'le texte gris dans le champ'],
              ]}
            >
              <EmailInput label="E-mail" placeholder="nom@exemple.com" />
            </Demo>
            <Demo
              name="PasswordInput"
              params={[
                ['label', 'le titre au-dessus du champ'],
                ['placeholder', 'le texte gris dans le champ'],
              ]}
            >
              <PasswordInput label="Mot de passe" placeholder="••••••••" />
            </Demo>
            <Demo name="DateInput" params={[['label', 'le titre au-dessus du champ']]}>
              <DateInput label="Date" />
            </Demo>
            <Demo name="TimeInput" params={[['label', 'le titre au-dessus du champ']]}>
              <TimeInput label="Heure" />
            </Demo>
            <Demo
              name="Select"
              params={[
                ['label', 'le titre au-dessus de la liste'],
                ['options', 'la liste des choix, ex. options={[\'Conférence\', \'Atelier\']}'],
              ]}
            >
              <Select label="Catégorie" options={['Conférence', 'Atelier', 'Concert']} />
            </Demo>
            <Demo name="SearchInput" params={[['placeholder', 'le texte gris dans la barre']]}>
              <SearchInput placeholder="Rechercher un événement…" />
            </Demo>
            <Demo
              name="TextArea"
              params={[
                ['label', 'le titre au-dessus du champ'],
                ['placeholder', 'le texte gris dans le champ'],
              ]}
            >
              <TextArea label="Description" placeholder="Décrivez votre événement" />
            </Demo>
            <Demo name="FileInput" params={[['label', 'le titre au-dessus de la zone']]}>
              <FileInput label="Affiche" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Cases, radios et interrupteur (inputs)</h2>
          <div className="demo_row">
            <Demo name="Checkbox" params={[['label', 'le texte à côté de la case']]}>
              <Checkbox label="J'accepte les conditions" />
            </Demo>
            <Demo
              name="Radio"
              params={[
                ['label', 'le texte à côté du radio'],
                ['name', 'le même pour tous les radios d’un groupe, sinon on peut tous les cocher'],
              ]}
            >
              <Radio name="paiement" label="Carte bancaire" />
            </Demo>
            <Demo name="Radio">
              <Radio name="paiement" label="Espèces" />
            </Demo>
            <Demo name="Switch" params={[['label', 'le texte à côté de l’interrupteur']]}>
              <Switch label="Notifications par e-mail" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Statuts (tags)</h2>
          <div className="demo_row">
            <Demo
              name="StatusTag · publie"
              params={[
                [
                  'status',
                  'publie, encours, brouillon, complet, termine, annule, accepte, enattente ou refuse',
                ],
              ]}
            >
              <StatusTag status="publie" />
            </Demo>
            <Demo name="StatusTag · encours">
              <StatusTag status="encours" />
            </Demo>
            <Demo name="StatusTag · brouillon">
              <StatusTag status="brouillon" />
            </Demo>
            <Demo name="StatusTag · complet">
              <StatusTag status="complet" />
            </Demo>
            <Demo name="StatusTag · termine">
              <StatusTag status="termine" />
            </Demo>
            <Demo name="StatusTag · annule">
              <StatusTag status="annule" />
            </Demo>
            <Demo name="StatusTag · accepte">
              <StatusTag status="accepte" />
            </Demo>
            <Demo name="StatusTag · enattente">
              <StatusTag status="enattente" />
            </Demo>
            <Demo name="StatusTag · refuse">
              <StatusTag status="refuse" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Puces, avatars et dates (tags)</h2>
          <div className="demo_row">
            <Demo
              name="Chip"
              params={[
                ['text', 'le mot dans la puce'],
                ['tone', 'optionnel : teal, sinon gris'],
              ]}
            >
              <Chip text="Tous" />
            </Demo>
            <Demo name="Chip · teal">
              <Chip text="Conférence" tone="teal" />
            </Demo>
            <Demo
              name="Avatar"
              params={[
                ['initials', 'les lettres dans le rond'],
                ['size', 'optionnel : 36 (par défaut), 48 ou 72'],
                ['image', 'optionnel : l’adresse d’une photo, sinon les initiales'],
              ]}
            >
              <Avatar initials="SM" />
            </Demo>
            <Demo name="Avatar · 48">
              <Avatar initials="SM" size={48} />
            </Demo>
            <Demo name="Avatar · 72">
              <Avatar initials="SM" size={72} />
            </Demo>
            <Demo
              name="DateBadge"
              params={[
                ['day', 'le jour, ex. 12'],
                ['month', 'le mois, ex. OCT'],
                ['size', 'optionnel : 48 (par défaut) ou 72'],
                ['tone', 'optionnel : coral ou indigo, sinon turquoise'],
              ]}
            >
              <DateBadge day="12" month="OCT" />
            </Demo>
            <Demo name="DateBadge · coral">
              <DateBadge day="12" month="OCT" tone="coral" />
            </Demo>
            <Demo name="DateBadge · indigo">
              <DateBadge day="12" month="OCT" tone="indigo" />
            </Demo>
            <Demo name="DateBadge · 72">
              <DateBadge day="12" month="OCT" size={72} />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Progression (tags)</h2>
          <div className="demo_row">
            <Demo name="ProgressBar" params={[['value', 'un pourcentage de 0 à 100']]}>
              <div className="demo_narrow">
                <ProgressBar value={60} />
              </div>
            </Demo>
            <Demo
              name="ProgressRing"
              params={[
                ['value', 'un pourcentage de 0 à 100'],
                ['label', 'le texte au milieu du cercle'],
              ]}
            >
              <ProgressRing value={40} label="12/30" />
            </Demo>
            <Demo name="ProgressRing">
              <ProgressRing value={82} label="82 %" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Diagrammes (Diagram)</h2>
          <div className="demo_row">
            <Demo
              name="DonutChart"
              params={[
                ['segments', 'les nombres de chaque groupe, ex. segments={[1194, 86, 4]}'],
                ['label', 'le texte au milieu du cercle'],
              ]}
            >
              <DonutChart segments={[1194, 86, 4]} label="1 284" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Messages (messages)</h2>
          <div className="demo_stack">
            <Demo
              name="Banner · error"
              params={[
                ['tone', 'error, warning ou info'],
                ['text', 'le message'],
                ['action', 'optionnel : un bouton, ex. action={<PrimaryButton text="Réessayer" />}'],
              ]}
            >
              <Banner tone="error" text="Paiement refusé. Vérifiez votre carte." />
            </Demo>
            <Demo name="Banner · warning">
              <Banner tone="warning" text="Il ne reste que 3 places." />
            </Demo>
            <Demo name="Banner · info">
              <Banner tone="info" text="Votre événement sera publié demain." />
            </Demo>
            <Demo
              name="EmptyState"
              params={[
                ['title', 'le titre en gras'],
                ['text', 'la phrase sous le titre'],
                ['action', 'optionnel : un bouton'],
              ]}
            >
              <EmptyState
                title="Aucun événement pour le moment"
                text="Créez votre premier événement."
                action={<PrimaryButton text="+ Créer un événement" />}
              />
            </Demo>
            <Demo name="Toast" params={[['message', 'le texte de la notification']]}>
              <div className="demo_row">
                <Toast message="Inscription acceptée" />
              </div>
            </Demo>
            <Demo name="Skeleton" params={[['aucun', 'ce composant n’a pas de paramètre']]}>
              <div className="demo_narrow">
                <Skeleton />
              </div>
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Chargement (loader)</h2>
          <div className="demo_row">
            <Demo
              name="Loader · size 24"
              params={[['size', 'optionnel : la taille en pixels, 56 par défaut']]}
            >
              <Loader size={24} />
            </Demo>
            <Demo name="Loader">
              <Loader />
            </Demo>
            <Demo name="Loader · size 96">
              <Loader size={96} />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Fenêtres (popups)</h2>
          <div className="demo_stack">
            <Demo
              name="Popup · tone danger"
              params={[
                ['title', 'la question en titre'],
                ['body', 'la phrase explicative'],
                ['confirmLabel', 'le mot du bouton de confirmation'],
                ['tone', 'optionnel : danger = bouton rouge, sinon bouton indigo'],
                ['textArea', 'optionnel : true = ajoute une zone de texte'],
                ['textAreaLabel', 'optionnel : le titre au-dessus de la zone de texte'],
              ]}
            >
              <div className="demo_box">
                <Popup
                  title="Retirer Nadia Benali ?"
                  body="Sa réservation sera annulée."
                  confirmLabel="Retirer"
                  tone="danger"
                  textArea={true}
                  textAreaLabel="Motif"
                />
              </div>
            </Demo>

            <Demo name="Popup · sans option">
              <div className="demo_box">
                <Popup
                  title="Publier cet événement ?"
                  body="Il sera visible par tous les participants."
                  confirmLabel="Publier"
                />
              </div>
            </Demo>

            <Demo
              name="Drawer"
              params={[
                ['title', 'le titre du panneau'],
                ['entre les balises', 'le contenu du panneau, écrit entre <Drawer> et </Drawer>'],
              ]}
            >
              <div className="demo_box">
                <Drawer title="S’inscrire">
                  <TextInput label="Nom complet" placeholder="Ex. Nadia Benali" />
                  <PrimaryButton text="Confirmer" />
                </Drawer>
              </div>
            </Demo>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
