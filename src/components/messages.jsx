import { useEffect } from 'react';
import './messages.css';

export function Banner(props) {
  return (
    <div className={'banner banner_' + props.tone}>
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
  useEffect(() => {
    const timer = setTimeout(() => {
      if (props.onClose) {
        props.onClose();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [props.message]);

  return (
    <div className="toast">
      {props.message}
    </div>
  );
}