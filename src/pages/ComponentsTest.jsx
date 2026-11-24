import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import AppShell from "../layouts/AppShell";
import {
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  IconButton,
} from "../components/buttons";
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
  Segmented,
} from "../components/inputs";
import PageTitle from "../components/titles";
import Card from "../components/cards";
import {
  StatusTag,
  Chip,
  Avatar,
  DateBadge,
} from "../components/tags";
import {
  DonutChart,
  ProgressBar,
  ProgressRing,
} from "../components/Diagram";
import {
  Banner,
  EmptyState,
  Toast,
} from "../components/messages";
import { Popup, Drawer } from "../components/popups";
import { Loader } from "../components/loader";
import DescriptionList from "../components/descriptions";
import DataTable from "../components/tables";
import "./ComponentsTest.css";



function highlightExample(example) {
  const tokenPattern =
    /(<\/?[A-Za-z][A-Za-z0-9.]*)|(\/?>)|([A-Za-z][A-Za-z0-9]*)(?=\s*=)|("(?:[^"\\]|\\.)*")|(\{[^}]*\})/g;

  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = tokenPattern.exec(example)) !== null) {
    if (match.index > lastIndex) {
      parts.push(example.slice(lastIndex, match.index));
    }

    let className = "code_value";
    if (match[1]) className = "code_tag";
    else if (match[2]) className = "code_punctuation";
    else if (match[3]) className = "code_prop";
    else if (match[4]) className = "code_string";
    else if (match[5]) className = "code_expression";

    parts.push(
      <span className={className} key={key++}>
        {match[0]}
      </span>
    );

    lastIndex = tokenPattern.lastIndex;
  }

  if (lastIndex < example.length) {
    parts.push(example.slice(lastIndex));
  }

  return parts;
}

function Demo({ name, example, params = [], children }) {
  return (
    <article className="demo_item">
      <div className="demo_item_header">
        <h3 className="demo_name">{name}</h3>
      </div>

      {example && (
        <div className="demo_code_wrap">
          <div className="demo_code_label">UTILISATION</div>
          <pre className="demo_code">
            <code>{highlightExample(example)}</code>
          </pre>
        </div>
      )}

      {params.length > 0 && (
        <div className="demo_params">
          <div className="demo_params_title">PARAMÈTRES</div>
          {params.map((param) => (
            <div className="demo_param" key={param.name}>
              <div className="demo_param_heading">
                <code className="demo_param_name">{param.name}</code>
                <span
                  className={
                    param.required
                      ? "demo_param_badge is_required"
                      : "demo_param_badge is_optional"
                  }
                >
                  {param.required ? "Obligatoire" : "Optionnel"}
                </span>
              </div>
              <p className="demo_param_description">{param.description}</p>
              {param.options && (
                <div className="demo_options">
                  <span className="demo_options_label">Valeurs :</span>
                  {param.options.map((option) => (
                    <code className="demo_option" key={option}>
                      {option}
                    </code>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="demo_preview">
        <div className="demo_preview_label">APERÇU</div>
        <div className="demo_preview_content">{children}</div>
      </div>
    </article>
  );
}

const commonClick = {
  name: "onClick?",
  required: false,
  description: "Fonction exécutée lorsque l'utilisateur clique sur le bouton.",
};

const valueParam = {
  name: "value?",
  required: false,
  description: "Valeur actuelle du champ, gardée par la page.",
};

const checkedParam = {
  name: "checked?",
  required: false,
  description: "Indique si la case est cochée, gardé par la page.",
};

const changeParam = {
  name: "onChange?",
  required: false,
  description: "Fonction exécutée à chaque modification du champ.",
};

export default function ComponentsTest() {
  const [periode, setPeriode] = useState("semaine");

  return (
    <AppShell role="participant">
      <main className="demo">
        <header className="demo_header">
          <p className="demo_eyebrow">MAWID · BIBLIOTHÈQUE UI</p>
          <h1>Composants</h1>
          <p className="demo_intro">
            Retrouvez les composants réutilisables du projet, leur syntaxe,
            leurs paramètres et un aperçu réel. Les noms de paramètres sont
            affichés en rose, les valeurs texte en vert et les fonctions en
            bleu. Le symbole ? indique un paramètre optionnel.
          </p>
          <div className="demo_legend">
            <span><i className="legend_dot dot_prop" /> Paramètre</span>
            <span><i className="legend_dot dot_string" /> Valeur texte</span>
            <span><i className="legend_dot dot_expression" /> Fonction / expression</span>
            <span><i className="legend_dot dot_optional" /> Optionnel</span>
          </div>
        </header>

        <section className="demo_section">
          <h2>Titres de page</h2>
          <div className="demo_grid">
            <Demo
              name="PageTitle"
              example={`<PageTitle\n  title="Mes événements"\n  subtitle="12 événements"\n  backTo={{ text: "Tableau de bord", to: "/organisateur/tableau-de-bord" }}\n/>`}
              params={[
                { name: "title", required: true, description: "Titre principal de la page." },
                { name: "subtitle?", description: "Texte ou éléments affichés sous le titre." },
                { name: "backTo?", description: "Objet contenant le texte et le chemin du lien de retour.", options: ["{ text, to }"] },
              ]}
            >
              <PageTitle
                title="Mes événements"
                subtitle="12 événements"
                backTo={{ text: "Tableau de bord", to: "/organisateur/tableau-de-bord" }}
              />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Contenu et données</h2>
          <div className="demo_grid">
            <Demo
              name="DescriptionList"
              example={`<DescriptionList\n  items={[\n    { label: "Date", value: "12 – 15 avril 2025" },\n    { label: "Lieu", value: "Rabat" },\n  ]}\n/>`}
              params={[
                { name: "items", required: true, description: "Tableau d'objets. Chaque objet contient un label et une value. Les éléments sont affichés sur trois colonnes.", options: ["{ label, value }"] },
              ]}
            >
              <Card>
                <DescriptionList
                  items={[
                    { label: "Date", value: "12 – 15 avril 2025" },
                    { label: "Lieu", value: "Centre de conférences, Rabat" },
                    { label: "Prix", value: "50 MAD" },
                  ]}
                />
              </Card>
            </Demo>

            <Demo
              name="DataTable"
              example={`<DataTable\n  columns={["Participant", "Réservation"]}\n  rows={[\n    ["Sophie Martin", "RES-0412"],\n    ["Karim Idrissi", "RES-0416"],\n  ]}\n/>`}
              params={[
                { name: "columns", required: true, description: "Tableau des titres affichés en haut des colonnes." },
                { name: "rows", required: true, description: "Tableau de lignes. Chaque ligne est un tableau de cellules contenant du texte ou des composants React, par exemple StatusTag." },
              ]}
            >
              <Card>
                <DataTable
                  columns={["Participant", "Réservation", "Paiement", "Présence"]}
                  rows={[
                    ["Sophie Martin", "RES-0412", <StatusTag status="accepte" />, <StatusTag status="confirmee" />],
                    ["Karim Idrissi", "RES-0416", <StatusTag status="enattente" />, <StatusTag status="enattente" />],
                    ["Nadia Benali", "RES-0415", <StatusTag status="refuse" />, <StatusTag status="annule" />],
                  ]}
                />
              </Card>
              <p className="demo_note">Variante vide :</p>
              <DataTable columns={["Participant", "Réservation"]} rows={[]} />
            </Demo>

            <Demo
              name="Card"
              example={`<Card title="Informations personnelles">\n  <p>Amine Berrada</p>\n</Card>`}
              params={[
                { name: "title?", description: "Titre affiché dans l'en-tête de la carte." },
                { name: "children", required: true, description: "Contenu placé entre la balise ouvrante et la balise fermante. Il peut s'agir de texte, de HTML ou d'autres composants." },
              ]}
            >
              <Card title="Informations personnelles">
                <p>Amine Berrada</p>
              </Card>
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Boutons</h2>
          <div className="demo_grid">
            <Demo
              name="PrimaryButton"
              example={`<PrimaryButton\n  text="Publier"\n  onClick={handleClick}\n/>`}
              params={[
                { name: "text", required: true, description: "Texte affiché dans le bouton." },
                commonClick,
              ]}
            >
              <PrimaryButton text="Publier" />
            </Demo>
            <Demo
              name="SecondaryButton"
              example={`<SecondaryButton\n  text="Annuler"\n  onClick={handleClick}\n/>`}
              params={[
                { name: "text", required: true, description: "Texte affiché dans le bouton." },
                commonClick,
              ]}
            >
              <SecondaryButton text="Annuler" />
            </Demo>
            <Demo
              name="DangerButton"
              example={`<DangerButton text="Retirer" />`}
              params={[
                { name: "text", required: true, description: "Texte affiché dans le bouton." },
                              commonClick,
              ]}
            >
              <DangerButton text="Retirer" />
            </Demo>
            <Demo
              name="IconButton"
              example={`<IconButton\n  icon={<MoreHorizontal size={18} />}\n  label="Plus d’options"\n/>`}
              params={[
                { name: "icon", required: true, description: "Élément représentant l'icône à afficher, par exemple une icône de lucide-react." },
                { name: "label", required: true, description: "Texte d'accessibilité et texte affiché au survol." },
                              commonClick,
              ]}
            >
              <IconButton icon={<MoreHorizontal size={18} />} label="Plus d’options" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Champs de saisie</h2>
          <div className="demo_grid">
            <Demo name="TextInput" example={`<TextInput label="Titre" placeholder="Ex. Atelier Design Thinking" />`} params={[
              { name: "label", required: true, description: "Titre affiché au-dessus du champ." },
              { name: "placeholder", required: true, description: "Texte indicatif affiché lorsque le champ est vide." },
                          valueParam,
              changeParam,
            ]}>
              <TextInput label="Titre" placeholder="Ex. Atelier Design Thinking" />
            </Demo>
            <Demo name="NumberInput" example={`<NumberInput label="Prix (MAD)" placeholder="50" />`} params={[
              { name: "label", required: true, description: "Titre affiché au-dessus du champ." },
              { name: "placeholder", required: true, description: "Exemple de valeur affiché lorsque le champ est vide." },
                          valueParam,
              changeParam,
            ]}>
              <NumberInput label="Prix (MAD)" placeholder="50" />
            </Demo>
            <Demo name="EmailInput" example={`<EmailInput label="E-mail" placeholder="nom@exemple.com" />`} params={[
              { name: "label", required: true, description: "Titre affiché au-dessus du champ." },
              { name: "placeholder", required: true, description: "Exemple d'adresse affiché lorsque le champ est vide." },
                          valueParam,
              changeParam,
            ]}>
              <EmailInput label="E-mail" placeholder="nom@exemple.com" />
            </Demo>
            <Demo name="PasswordInput" example={`<PasswordInput label="Mot de passe" placeholder="••••••••" />`} params={[
              { name: "label", required: true, description: "Titre affiché au-dessus du champ." },
              { name: "placeholder", required: true, description: "Texte indicatif du champ mot de passe." },
                          valueParam,
              changeParam,
            ]}>
              <PasswordInput label="Mot de passe" placeholder="••••••••" />
            </Demo>
            <Demo name="DateInput" example={`<DateInput label="Date" />`} params={[
              { name: "label", required: true, description: "Titre affiché au-dessus du champ." },
                          valueParam,
              changeParam,
            ]}>
              <DateInput label="Date" />
            </Demo>
            <Demo name="TimeInput" example={`<TimeInput label="Heure" />`} params={[
              { name: "label", required: true, description: "Titre affiché au-dessus du champ." },
                          valueParam,
              changeParam,
            ]}>
              <TimeInput label="Heure" />
            </Demo>
            <Demo name="Select" example={`<Select\n  label="Catégorie"\n  options={[\n    { value: "Conférence", label: "Conférence" },\n    { value: 3, label: "Atelier Git" },\n  ]}\n/>`} params={[
              { name: "label", required: true, description: "Titre affiché au-dessus de la liste." },
              { name: "options", required: true, description: "Tableau des choix. Chaque choix a une value (ce qui est enregistré, par exemple un id) et un label (le texte affiché). Si les deux sont identiques, écrire le même texte dans les deux.", options: ["{ value, label }"] },
                          valueParam,
              changeParam,
            ]}>
              <Select
                label="Catégorie"
                options={[
                  { value: "Conférence", label: "Conférence" },
                  { value: "Atelier", label: "Atelier" },
                  { value: "Concert", label: "Concert" },
                ]}
              />
            </Demo>
            <Demo
              name="Segmented"
              example={`<Segmented\n  options={[\n    { value: "jour", label: "Aujourd'hui" },\n    { value: "semaine", label: "Cette semaine" },\n    { value: "mois", label: "Ce mois" },\n  ]}\n  value={periode}\n  onChange={setPeriode}\n/>`}
              params={[
                { name: "options", required: true, description: "Tableau des choix. Chaque choix contient une value (valeur enregistrée) et un label (texte affiché).", options: ["{ value, label }"] },
                { name: "value", required: true, description: "Valeur actuellement sélectionnée." },
                { name: "onChange", required: true, description: "Fonction appelée lorsqu'un choix est sélectionné. Elle reçoit la nouvelle value." },
              ]}
            >
              <Segmented
                options={[
                  { value: "jour", label: "Aujourd'hui" },
                  { value: "semaine", label: "Cette semaine" },
                  { value: "mois", label: "Ce mois" },
                ]}
                value={periode}
                onChange={setPeriode}
              />
            </Demo>
            <Demo name="SearchInput" example={`<SearchInput placeholder="Rechercher un événement…" />`} params={[
              { name: "placeholder", required: true, description: "Texte indicatif affiché dans la barre de recherche." },
                          valueParam,
              changeParam,
            ]}>
              <SearchInput placeholder="Rechercher un événement…" />
            </Demo>
            <Demo name="TextArea" example={`<TextArea\n  label="Description"\n  placeholder="Décrivez votre événement"\n/>`} params={[
              { name: "label", required: true, description: "Titre affiché au-dessus de la zone de texte." },
              { name: "placeholder", required: true, description: "Texte indicatif affiché lorsque la zone est vide." },
                          valueParam,
              changeParam,
            ]}>
              <TextArea label="Description" placeholder="Décrivez votre événement" />
            </Demo>
            <Demo name="FileInput" example={`<FileInput label="Affiche" />`} params={[
              { name: "label", required: true, description: "Titre affiché au-dessus de la zone de sélection du fichier." },
                          changeParam,
            ]}>
              <FileInput label="Affiche" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Cases à cocher et choix</h2>
          <div className="demo_grid">
            <Demo name="Checkbox" example={`<Checkbox label="J'accepte les conditions" />`} params={[
              { name: "label", required: true, description: "Texte affiché à côté de la case." },
                          checkedParam,
              changeParam,
            ]}>
              <Checkbox label="J'accepte les conditions" />
            </Demo>
            <Demo name="Radio" example={`<Radio name="paiement" label="Carte bancaire" />`} params={[
              { name: "name", required: true, description: "Nom du groupe. Les radios qui partagent le même name appartiennent au même groupe : un seul choix peut être sélectionné." },
              { name: "label", required: true, description: "Texte affiché à côté du bouton radio." },
                          valueParam,
              checkedParam,
              changeParam,
            ]}>
              <div className="demo_choice_group">
                <Radio name="paiement-demo" label="Carte bancaire" />
                <Radio name="paiement-demo" label="Espèces" />
              </div>
            </Demo>
            <Demo name="Switch" example={`<Switch label="Valider chaque inscription" />`} params={[
              { name: "label", required: true, description: "Texte affiché à côté de l'interrupteur." },
                          checkedParam,
              changeParam,
            ]}>
              <Switch label="Valider chaque inscription" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Statuts</h2>
          <Demo
            name="StatusTag"
            example={`<StatusTag status="publie" />`}
            params={[
              { name: "status", required: true, description: "Détermine le statut affiché et son style.", options: ["publie", "encours", "brouillon", "complet", "termine", "annule", "accepte", "enattente", "refuse", "confirmee", "gratuit", "rembourse", "actif", "suspendu", "placeproposee", "listeattente"] },
            ]}
          >
            <div className="demo_variant_grid">
              {[
                "publie", "encours", "brouillon", "complet", "termine", "annule",
                "accepte", "enattente", "refuse", "confirmee", "gratuit",
                "rembourse", "actif", "suspendu", "placeproposee", "listeattente",
              ].map((status) => (
                <div className="demo_variant" key={status}>
                  <StatusTag status={status} />
                  <code>{status}</code>
                </div>
              ))}
            </div>
          </Demo>
        </section>

        <section className="demo_section">
          <h2>Puces, avatars et dates</h2>
          <div className="demo_grid">
            <Demo name="Chip" example={`<Chip text="Tous" tone="indigo" />`} params={[
              { name: "text", required: true, description: "Texte affiché dans la puce." },
              { name: "tone?", description: "Couleur de la puce.", options: ["indigo", "gris (par défaut)"] },
            ]}>
              <div className="demo_row"><Chip text="Tous" /><Chip text="Conférence" tone="indigo" /></div>
            </Demo>
            <Demo name="Avatar" example={`<Avatar initials="SM" size={48} image="/images/avatar.png" />`} params={[
              { name: "initials", required: true, description: "Initiales affichées lorsque l'image n'est pas fournie." },
              { name: "size?", description: "Taille du cercle en pixels.", options: ["36 (par défaut)", "48", "72"] },
              { name: "image?", description: "Adresse de l'image à afficher à la place des initiales." },
            ]}>
              <div className="demo_row"><Avatar initials="SM" /><Avatar initials="SM" size={48} /><Avatar initials="SM" size={72} /></div>
            </Demo>
            <Demo name="DateBadge" example={`<DateBadge day="12" month="OCT" size={72} tone="coral" />`} params={[
              { name: "day", required: true, description: "Jour affiché dans le badge." },
              { name: "month", required: true, description: "Mois affiché dans le badge, généralement sous forme abrégée." },
              { name: "size?", description: "Taille du badge en pixels.", options: ["48 (par défaut)", "72"] },
              { name: "tone?", description: "Variante de couleur du badge.", options: ["coral", "indigo", "indigo clair (par défaut)"] },
            ]}>
              <div className="demo_row"><DateBadge day="12" month="OCT" /><DateBadge day="12" month="OCT" tone="coral" /><DateBadge day="12" month="OCT" tone="indigo" /><DateBadge day="12" month="OCT" size={72} /></div>
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Diagrammes (Diagram)</h2>
          <div className="demo_row">
            <Demo name="DonutChart" example={`<DonutChart\n  segments={[1194, 86, 4]}\n  label="1 284"\n/>`} params={[
              { name: "segments", required: true, description: "Tableau de nombres représentant les valeurs de chaque groupe." },
              { name: "label", required: true, description: "Texte affiché au centre du diagramme." },
            ]}>
              <DonutChart segments={[1194, 86, 4]} label="1 284" />
            </Demo>
            <Demo name="ProgressBar" example={`<ProgressBar value={60} />`} params={[
              { name: "value", required: true, description: "Pourcentage de progression, de 0 à 100." },
            ]}>
              <div className="demo_narrow"><ProgressBar value={60} /></div>
            </Demo>
            <Demo name="ProgressRing" example={`<ProgressRing value={40} label="12/30" />`} params={[
              { name: "value", required: true, description: "Pourcentage de progression, de 0 à 100." },
              { name: "label", required: true, description: "Texte affiché au centre du cercle." },
            ]}>
              <div className="demo_row"><ProgressRing value={40} label="12/30" /><ProgressRing value={82} label="82 %" /></div>
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Messages et états</h2>
          <div className="demo_stack">
            <Demo name="Banner" example={`<Banner\n  tone="error"\n  text="Paiement refusé."\n  action={<PrimaryButton text="Réessayer" />}\n/>`} params={[
              { name: "tone", required: true, description: "Détermine le type de message.", options: ["error", "warning", "info"] },
              { name: "text", required: true, description: "Contenu du message." },
              { name: "action?", description: "Composant ou bouton d'action affiché avec le message." },
            ]}>
              <div className="demo_stack">
                <Banner tone="error" text="Paiement refusé. Vérifiez votre carte." />
                <Banner tone="warning" text="Il ne reste que 3 places." />
                <Banner tone="info" text="Votre événement sera publié demain." />
              </div>
            </Demo>
            <Demo name="EmptyState" example={`<EmptyState\n  title="Aucun événement"\n  text="Créez votre premier événement."\n  action={<PrimaryButton text="Créer" />}\n/>`} params={[
              { name: "title", required: true, description: "Titre principal affiché lorsque la liste est vide." },
              { name: "text", required: true, description: "Phrase qui explique la situation ou indique quoi faire." },
              { name: "action?", description: "Bouton ou composant proposant une action." },
            ]}>
              <EmptyState title="Aucun événement pour le moment" text="Créez votre premier événement." action={<PrimaryButton text="+ Créer un événement" />} />
            </Demo>
            <Demo name="Toast" example={`<Toast\n  message="Événement créé avec succès"\n  onClose={() => setMessage("")}\n/>`} params={[
              { name: "message", required: true, description: "Texte affiché dans la notification." },
              { name: "onClose?", description: "Fonction exécutée 3 secondes après l'apparition du message. La page s'en sert pour retirer le Toast." },
            ]}>
              <Toast message="Événement créé avec succès" />
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Chargement</h2>
          <div className="demo_grid">
            <Demo name="Loader" example={`<Loader size={56} />`} params={[
              { name: "size?", description: "Taille du loader en pixels.", options: ["56 (par défaut)", "24", "96"] },
            ]}>
              <div className="demo_row"><Loader size={24} /><Loader /><Loader size={96} /></div>
            </Demo>
          </div>
        </section>

        <section className="demo_section">
          <h2>Fenêtres et panneaux</h2>
          <div className="demo_stack">
            <Demo name="Popup" example={`<Popup\n  title="Retirer Nadia Benali ?"\n  body="Sa réservation sera annulée."\n  confirmLabel="Retirer"\n  tone="danger"\n  textArea={true}\n  textAreaLabel="Motif"\n/>`} params={[
              { name: "title", required: true, description: "Question ou titre affiché en haut de la fenêtre." },
              { name: "body", required: true, description: "Texte qui explique l'action à confirmer." },
              { name: "confirmLabel", required: true, description: "Texte du bouton de confirmation." },
              { name: "tone?", description: "Style du bouton de confirmation.", options: ["danger (rouge)", "indigo (par défaut)"] },
              { name: "textArea?", description: "Ajoute une zone de texte lorsque la valeur est true.", options: ["true", "false"] },
              { name: "textAreaLabel?", description: "Titre affiché au-dessus de la zone de texte." },
                          { name: "onCancel?", description: "Fonction exécutée au clic sur Annuler." },
              { name: "onConfirm?", description: "Fonction exécutée au clic sur le bouton de confirmation." },
              { name: "textAreaValue?", description: "Texte actuel de la zone de texte, gardé par la page." },
              { name: "onTextAreaChange?", description: "Fonction exécutée à chaque modification de la zone de texte." },
            ]}>
              <div className="demo_box">
                <Popup title="Retirer Nadia Benali ?" body="Sa réservation sera annulée." confirmLabel="Retirer" tone="danger" textArea={true} textAreaLabel="Motif" />
              </div>
            </Demo>
            <Demo name="Popup · sans options facultatives" example={`<Popup\n  title="Publier cet événement ?"\n  body="Il sera visible par tous les participants."\n  confirmLabel="Publier"\n/>`}>
              <div className="demo_box">
                <Popup title="Publier cet événement ?" body="Il sera visible par tous les participants." confirmLabel="Publier" />
              </div>
            </Demo>
            <Demo name="Drawer" example={`<Drawer title="S’inscrire">\n  <TextInput label="Nom complet" placeholder="Ex. Nadia Benali" />\n  <PrimaryButton text="Confirmer" />\n</Drawer>`} params={[
              { name: "title", required: true, description: "Titre affiché en haut du panneau." },
              { name: "children", required: true, description: "Contenu placé entre les balises Drawer ouvrante et fermante." },
                          { name: "onClose?", description: "Fonction exécutée au clic sur la croix." },
            ]}>
              <div className="demo_box">
                <Drawer title="S’inscrire">
                  <TextInput label="Nom complet" placeholder="Ex. Nadia Benali" />
                  <PrimaryButton text="Confirmer" />
                </Drawer>
              </div>
            </Demo>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
