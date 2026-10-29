import './buttons.css';

export function PrimaryButton(props) {
  return <button className="btn btn_primary">{props.text}</button>;
}

export function SecondaryButton(props) {
  return <button className="btn btn_secondary">{props.text}</button>;
}

export function DangerButton(props) {
  return <button className="btn btn_danger">{props.text}</button>;
}

export function IconButton(props) {
  return (
    <button className="iconbtn" aria-label={props.label}>
      {props.icon}
    </button>
  );
}
