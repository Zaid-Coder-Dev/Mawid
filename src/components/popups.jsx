import { X } from 'lucide-react';
import { PrimaryButton, SecondaryButton, DangerButton, IconButton } from './buttons';
import { TextArea } from './inputs';
import './popups.css';

export function ConfirmDialog(props) {
  return (
    <div className="dialog_overlay">
      <div className="dialog" role="alertdialog" aria-modal="true" aria-label={props.title}>
        <h2 className="dialog_title">{props.title}</h2>
        <p className="dialog_body">{props.body}</p>

        {props.reasonField && <TextArea label="Motif" />}

        <div className="dialog_actions">
          <SecondaryButton text="Annuler" />
          {props.destructive ? (
            <DangerButton text={props.confirmLabel} />
          ) : (
            <PrimaryButton text={props.confirmLabel} />
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
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={props.title}>
        <div className="drawer_head">
          <h2 className="drawer_title">{props.title}</h2>
          <IconButton icon={<X size={18} />} label="Fermer" />
        </div>
        {props.children}
      </aside>
    </>
  );
}
