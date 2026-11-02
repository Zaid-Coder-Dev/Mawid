import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/footer';
import './AppShell.css';

export default function AppShell(props) {
  return (
    <div className="shell">
      <Sidebar role={props.role} />

      <div className="shell_main">
        <Header role={props.role} />

        <main className="shell_content">
          {props.children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
