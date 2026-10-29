import './messages.css';

export function Banner(props) {
  return (
    <div className={'banner banner_' + props.tone} role="alert">
      <span>{props.text}</span>
      {props.action}
    </div>
  );
}

export function EmptyState(props) {
  return (
    <div className="empty">
      <b className="empty_title">{props.title}</b>
      <span className="empty_text">{props.text}</span>
      {props.action}
    </div>
  );
}

export function Toast(props) {
  return (
    <div className="toast" role="status">
      {props.message}
    </div>
  );
}

export function Skeleton() {
  return (
    <div className="skeleton" role="status" aria-label="Chargement">
      <span className="skeleton_line" />
      <span className="skeleton_line" />
      <span className="skeleton_line" />
    </div>
  );
}
