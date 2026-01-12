import { MemoryRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import 'react-calendar/dist/Calendar.css';
function App() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <AppRouter />
    </MemoryRouter>
  )
}

export default App
