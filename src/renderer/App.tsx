import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Timer from './components/Timer';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Timer/>} />
      </Routes>
    </Router>
  );
}
