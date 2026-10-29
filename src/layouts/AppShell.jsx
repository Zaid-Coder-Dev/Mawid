import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/footer';
import './AppShell.css';


export default function AppShell(props) {

  let role=props.role;
  
  return (
    <div className="shell">
      <Sidebar role={role} />

      <div className="shell_main">
        <Header role={role} />

        <main className="shell_content">
        {props.children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
