import { AuthProvider } from './app/config/AuthContext';
import { AppRouter } from './app/router';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
