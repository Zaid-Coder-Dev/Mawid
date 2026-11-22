import './inputs.css';

export function TextInput(props) {
  return (
    <label className="field">
      {props.label}
      <input className="input" type="text" placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
    </label>
  );
}

export function NumberInput(props) {
  return (
    <label className="field">
      {props.label}
      <input className="input" type="number" placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
    </label>
  );
}

export function EmailInput(props) {
  return (
    <label className="field">
      {props.label}
      <input className="input" type="email" placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
    </label>
  );
}

export function PasswordInput(props) {
  return (
    <label className="field">
      {props.label}
      <input className="input" type="password" placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
    </label>
  );
}

export function DateInput(props) {
  return (
    <label className="field">
      {props.label}
      <input className="input" type="date" value={props.value} onChange={props.onChange} />
    </label>
  );
}

export function TimeInput(props) {
  return (
    <label className="field">
      {props.label}
      <input className="input" type="time" value={props.value} onChange={props.onChange} />
    </label>
  );
}

export function SearchInput(props) {
  return (
    <input
      className="input input_search"
      type="search"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

export function TextArea(props) {
  return (
    <label className="field">
      {props.label}
      <textarea className="input" rows={3} placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
    </label>
  );
}

export function Select(props) {
  return (
    <label className="field">
      {props.label}
      <select className="input input_select" value={props.value} onChange={props.onChange}>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox(props) {
  return (
    <label className="check">
      <input className="check_box" type="checkbox" checked={props.checked} onChange={props.onChange} />
      {props.label}
    </label>
  );
}

export function Radio(props) {
  return (
    <label className="check">
      <input className="check_box check_radio" type="radio" name={props.name} value={props.value} checked={props.checked} onChange={props.onChange} />
      {props.label}
    </label>
  );
}

export function Switch(props) {
  return (
    <label className="check">
      <input className="switch" type="checkbox" checked={props.checked} onChange={props.onChange} />
      {props.label}
    </label>
  );
}

export function FileInput(props) {
  return (
    <div className="field">
      {props.label}
      <label className="filedrop">
        <input className="filedrop_input" type="file" onChange={props.onChange} />
        Glissez un fichier ou <b>parcourez</b>
      </label>
    </div>
  );
}