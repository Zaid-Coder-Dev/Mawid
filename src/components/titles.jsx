import { Link } from 'react-router-dom';
import './titles.css';

function PageTitle(props) {
  return (
    <header className="page_title">
      {props.backTo ? (
        <Link className="page_title_back" to={props.backTo.to}>
          ← {props.backTo.text}
        </Link>
      ) : null}
      <h1 className="page_title_text">{props.title}</h1>
      {props.subtitle ? <div className="page_title_subtitle">{props.subtitle}</div> : null}
    </header>
  );
}

export default PageTitle ;
