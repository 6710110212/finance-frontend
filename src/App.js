import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import FinanceScreen from './FinanceScreen';


axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLoginSuccess = () => setIsAuthenticated(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, []);
    
  return (
    <div className="App"> 
      <header className="App-header">
        {!isAuthenticated  && <LoginScreen onLoginSuccess={handleLoginSuccess} />}
        {isAuthenticated && <FinanceScreen/>}
      </header>
    </div>
  );
}

export default App;

