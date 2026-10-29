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
import { Banner, EmptyState, Toast, Skeleton } from '../components/messages';
import { ConfirmDialog, Drawer } from '../components/popups';
import { Loader } from '../components/loader';
import './ComponentsTest.css';

function Demo(props) {
  return (
    <div className="demo_item">
      <code className="demo_name">{props.name}</code>
      {props.children}
    </div>
  );
}

export default function ComponentsTest() {
  return (
    <AppShell role="participant">
      <div className="demo">
        <h1>Composants</h1>

        <section className="demo_section">
          <h2>Boutons (buttons)</h2>
          <div className="demo_row">
            <Demo name="PrimaryButton">
              <PrimaryButton text="Publier" />
            </Demo>
            <Demo name="SecondaryButton">
              <SecondaryButton text="Annuler" />
            </Demo>
            <Demo name="DangerButton">
              <DangerButton text="Retirer" />
            </Demo>
            <Demo name="IconButton">
              <IconButton icon={<Bell size={18} />} label="Notifications" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Champs (inputs)</h2>
          <div className="demo_grid">
            <Demo name="TextInput">
              <TextInput label="Titre" placeholder="Ex. Atelier Design Thinking" />
            </Demo>
            <Demo name="NumberInput">
              <NumberInput label="Prix (MAD)" placeholder="50" />
            </Demo>
            <Demo name="EmailInput">
              <EmailInput label="E-mail" placeholder="nom@exemple.com" />
            </Demo>
            <Demo name="PasswordInput">
              <PasswordInput label="Mot de passe" placeholder="••••••••" />
            </Demo>
            <Demo name="DateInput">
              <DateInput label="Date" />
            </Demo>
            <Demo name="TimeInput">
              <TimeInput label="Heure" />
            </Demo>
            <Demo name="Select">
              <Select label="Catégorie" options={['Conférence', 'Atelier', 'Concert']} />
            </Demo>
            <Demo name="SearchInput">
              <SearchInput placeholder="Rechercher un événement…" />
            </Demo>
            <Demo name="TextArea">
              <TextArea label="Description" placeholder="Décrivez votre événement" />
            </Demo>
            <Demo name="FileInput">
              <FileInput label="Affiche" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Cases, radios et interrupteur (inputs)</h2>
          <div className="demo_row">
            <Demo name="Checkbox">
              <Checkbox label="J'accepte les conditions" />
            </Demo>
            <Demo name="Radio">
              <Radio name="paiement" label="Carte bancaire" />
            </Demo>
            <Demo name="Radio">
              <Radio name="paiement" label="Espèces" />
            </Demo>
            <Demo name="Switch">
              <Switch label="Notifications par e-mail" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Statuts (tags)</h2>
          <div className="demo_row">
            <Demo name="StatusTag · publie">
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
            <Demo name="Chip">
              <Chip text="Tous" />
            </Demo>
            <Demo name="Chip · teal">
              <Chip text="Conférence" tone="teal" />
            </Demo>
            <Demo name="Avatar">
              <Avatar initials="SM" />
            </Demo>
            <Demo name="Avatar · 48">
              <Avatar initials="SM" size={48} />
            </Demo>
            <Demo name="Avatar · 72">
              <Avatar initials="SM" size={72} />
            </Demo>
            <Demo name="DateBadge">
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
            <Demo name="ProgressBar">
              <div className="demo_narrow">
                <ProgressBar value={60} />
              </div>
            </Demo>
            <Demo name="ProgressRing">
              <ProgressRing value={40} label="12/30" />
            </Demo>
            <Demo name="ProgressRing">
              <ProgressRing value={82} label="82 %" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Messages (messages)</h2>
          <div className="demo_stack">
            <Demo name="Banner · error">
              <Banner tone="error" text="Paiement refusé. Vérifiez votre carte." />
            </Demo>
            <Demo name="Banner · warning">
              <Banner tone="warning" text="Il ne reste que 3 places." />
            </Demo>
            <Demo name="Banner · info">
              <Banner tone="info" text="Votre événement sera publié demain." />
            </Demo>
            <Demo name="EmptyState">
              <EmptyState
                title="Aucun événement pour le moment"
                text="Créez votre premier événement."
                action={<PrimaryButton text="+ Créer un événement" />}
              />
            </Demo>
            <Demo name="Toast">
              <div className="demo_row">
                <Toast message="Inscription acceptée" />
              </div>
            </Demo>
            <Demo name="Skeleton">
              <div className="demo_narrow">
                <Skeleton />
              </div>
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Chargement (loader)</h2>
          <div className="demo_row">
            <Demo name="Loader · size 24">
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
            <Demo name="ConfirmDialog">
              <div className="demo_box">
                <ConfirmDialog
                  title="Retirer Nadia Benali ?"
                  body="Sa réservation sera annulée."
                  confirmLabel="Retirer"
                  destructive={true}
                  reasonField={true}
                />
              </div>
            </Demo>
            
            <Demo name="Drawer">
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