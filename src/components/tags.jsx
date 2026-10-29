import './tags.css';

const labels = {
  publie: 'Publié',
  encours: 'En cours',
  brouillon: 'Brouillon',
  complet: 'Complet',
  termine: 'Terminé',
  annule: 'Annulé',
  accepte: 'Accepté',
  enattente: 'En attente',
  refuse: 'Refusé',
};

export function StatusTag(props) {
  return <span className={'status status_' + props.status}>{labels[props.status]}</span>;
}

export function Chip(props) {
  return <span className={'chip chip_' + props.tone}>{props.text}</span>;
}

export function Avatar(props) {
  return <span className={'avatar avatar_' + props.size}>{props.initials}</span>;
}

export function DateBadge(props) {
  return (
    <div className={'datebadge datebadge_' + props.size + ' datebadge_' + props.tone}>
      {props.day}
      <span>{props.month}</span>
    </div>
  );
}

export function ProgressBar(props) {
  return (
    <div className="bar">
      <i className="bar_fill" style={{ width: props.value + '%' }} />
    </div>
  );
}

export function ProgressRing(props) {
  return (
    <div className="ring">
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle className="ring_track" cx="38" cy="38" r="31" />
        <circle
          className="ring_value"
          cx="38"
          cy="38"
          r="31"
          transform="rotate(-90 38 38)"
          strokeDasharray={props.value * 1.95 + ' 195'}
        />
      </svg>
      <b className="ring_label">{props.label}</b>
    </div>
  );
}
