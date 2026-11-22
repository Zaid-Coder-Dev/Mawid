import { X } from 'lucide-react';
import { PrimaryButton, SecondaryButton, DangerButton, IconButton } from './buttons';
import { TextArea } from './inputs';
import './popups.css';

export function Popup(props) {
  return (
    <div className="dialog_overlay">
      <div className="dialog">
        <h2 className="dialog_title">{props.title}</h2>
        <p className="dialog_body">{props.body}</p>

        {props.textArea && <TextArea label={props.textAreaLabel} value={props.textAreaValue} onChange={props.onTextAreaChange} />}

        <div className="dialog_actions">
          <SecondaryButton text="Annuler" onClick={props.onCancel} />
          {props.tone === 'danger' ? (
            <DangerButton text={props.confirmLabel} onClick={props.onConfirm} />
          ) : (
            <PrimaryButton text={props.confirmLabel} onClick={props.onConfirm} />
          )}
        </div>
      </div>
    </div>
  );
}


export function Drawer(props) {
  return (
    <>
      <div className="drawer_scrim" />
      <aside className="drawer">
        <div className="drawer_head">
          <h2 className="drawer_title">{props.title}</h2>
          <IconButton icon={<X size={18} />} label="Fermer" onClick={props.onClose} />
        </div>
        {props.children}
      </aside>
    </>
  );
}