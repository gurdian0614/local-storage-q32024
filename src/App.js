import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ShowProductos from './components/ShowProductos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<ShowProductos />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
