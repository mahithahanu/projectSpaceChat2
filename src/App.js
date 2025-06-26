// routes
import Router from "./routes";
// theme
import ThemeProvider from './theme';
// components
import ThemeSettings from './components/settings';
// toastify
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <ThemeSettings>
        <Router />
        <ToastContainer position="top-right"  autoClose={3000} 
        />
      </ThemeSettings>
    </ThemeProvider>
  );
}

export default App;