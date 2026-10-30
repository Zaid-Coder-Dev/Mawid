import './Diagram.css';

export function DonutChart(props) {
  let total = 0;
  for (let i = 0; i < props.segments.length; i++) {
    total = total + props.segments[i];
  }

  let start = 0;
  let arcs = [];
  for (let i = 0; i < props.segments.length; i++) {
    let size = total === 0 ? 0 : (props.segments[i] / total) * 100;

    arcs.push(
      <circle
        key={i}
        className={'donut_arc donut_' + i}
        cx="38"
        cy="38"
        r="31"
        pathLength="100"
        transform="rotate(-90 38 38)"
        strokeDasharray={size + ' 100'}
        strokeDashoffset={-start}
      />
    );

    start = start + size;
  }

  return (
    <div className="donut">
      <svg viewBox="0 0 76 76">
        <circle className="donut_track" cx="38" cy="38" r="31" />
        {arcs}
      </svg>
      <b className="donut_label">{props.label}</b>
    </div>
  );
}
