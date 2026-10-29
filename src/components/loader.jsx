import logo from '../assets/logo-mark.png';
import './loader.css';

export function Loader(props) {
  let size = props.size || 56;

  return <img className="loader" src={logo} alt="Chargement" width={size} height={size} />;
}
