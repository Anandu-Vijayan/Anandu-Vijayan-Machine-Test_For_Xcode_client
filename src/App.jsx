import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Home } from './components/Home';
import { Homepage1 } from './components/Homepage1';
import { Homepage2 } from './components/Homepage2';
import Home from './components/Home';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
        <Route path="/about" element={<Homepage1 />} />
        <Route path="/contact" element={<Homepage2 />} />
      </Routes>
    </Router>
  );
};

export default App;
