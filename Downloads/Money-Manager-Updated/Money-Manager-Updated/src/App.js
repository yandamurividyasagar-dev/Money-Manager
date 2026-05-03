import {BrowserRouter, Route, Routes} from 'react-router-dom'
import ProtectedApp from './components/ProtectedApp'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

import './App.css'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ProtectedApp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

export default App
