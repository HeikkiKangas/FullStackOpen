import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { StrictMode } from 'react'
import { NotificationContextProvider } from './NotificationContext.jsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </QueryClientProvider>
  </StrictMode>
)