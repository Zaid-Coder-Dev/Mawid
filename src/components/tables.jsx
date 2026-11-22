import { EmptyState } from './messages';
import './tables.css';

export default function DataTable(props) {
  if (props.rows.length === 0) {
    return <EmptyState title="Aucun résultat" text="Il n’y a rien à afficher pour le moment." />;
  }

  return (
    <table className="data_table">
      <thead>
        <tr>
          {props.columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, position) => (
              <td key={position}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
