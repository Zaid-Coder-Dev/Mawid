import './descriptions.css';

export default function DescriptionList(props) {
  return (
    <dl className="description_list">
      {props.items.map((item) => (
        <div className="description_item" key={item.label}>
          <dt className="description_label">{item.label}</dt>
          <dd className="description_value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
