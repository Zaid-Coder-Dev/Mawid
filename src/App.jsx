import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/participant/Dashboard';
import ComponentsTest from './pages/ComponentsTest';

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/test" element={<ComponentsTest/>} />
      </Routes>
    </div>
  );
}

export default App;