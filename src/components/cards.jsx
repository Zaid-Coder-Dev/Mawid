import './cards.css';

function Card(props) {
  return (
    <section className="card">
      {props.title ? <h2 className="card_title">{props.title}</h2> : null}
      {props.children}
    </section>
  );
}

export default Card ;