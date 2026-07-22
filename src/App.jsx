import { AuthProvider } from './context/AuthContext.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'
import { FavoritosProvider } from './context/FavoritosContext.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'
import { ErrorBoundary } from './components/shared/ErrorBoundary.jsx'
import AppRouter from './routes/AppRouter.jsx'
import './index.css'

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CarritoProvider>
          <FavoritosProvider>
            <ToastProvider>
              <AppRouter />
            </ToastProvider>
          </FavoritosProvider>
        </CarritoProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App