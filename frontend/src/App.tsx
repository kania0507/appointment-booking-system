import { Outlet } from 'react-router';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <main>
      <h1>Appointment Booking System</h1>

      <Navigation />

      <Outlet />
    </main>
  );
}

export default App;