import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import 'react-calendar/dist/Calendar.css';
function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
