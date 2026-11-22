import './buttons.css';

export function PrimaryButton(props) {
  return <button className="btn btn_primary" onClick={props.onClick}>{props.text}</button>;
}

export function SecondaryButton(props) {
  return <button className="btn btn_secondary" onClick={props.onClick}>{props.text}</button>;
}

export function DangerButton(props) {
  return <button className="btn btn_danger" onClick={props.onClick}>{props.text}</button>;
}

export function IconButton(props) {
  return (
    <button className="iconbtn" title={props.label} onClick={props.onClick}>
      {props.icon}
    </button>
  );
}