import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import 'react-calendar/dist/Calendar.css';

/**
 * Router Strategy: BrowserRouter
 * - Uses HTML5 History API for clean URLs and proper browser back/forward navigation
 * - MemoryRouter was previously used but breaks browser navigation buttons
 * - For deployment under a subpath, add basename prop: <BrowserRouter basename="/subpath">
 */
function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
