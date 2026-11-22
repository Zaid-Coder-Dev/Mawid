import './tags.css';

const labels = {
  publie: "Publié",
  encours: "En cours",
  brouillon: "Brouillon",
  complet: "Complet",
  termine: "Terminé",
  annule: "Annulé",
  accepte: "Accepté",
  enattente: "En attente",
  refuse: "Refusé",
  confirmee: "Confirmée",
  gratuit: "Gratuit",
  rembourse: "Remboursé",
  actif: "Actif",
  suspendu: "Suspendu",
  placeproposee: "Place proposée",
  listeattente: "Liste d’attente",
};

export function StatusTag(props) {
  return <span className={'status status_' + props.status}>{labels[props.status]}</span>;
}

export function Chip(props) {
  return <span className={'chip' + (props.tone ? ' chip_' + props.tone : '')}>{props.text}</span>;
}

export function Avatar(props) {
  const size = props.size || 36;

  return (
    <span className={'avatar avatar_' + size}>
      {props.image ? <img src={props.image} alt="" /> : props.initials}
    </span>
  );
}

export function DateBadge(props) {
  const size = props.size || 48;
  return (
    <div className={'datebadge datebadge_' + size + (props.tone ? ' datebadge_' + props.tone : '')}>
      {props.day}
      <span>{props.month}</span>
    </div>
  );
}
