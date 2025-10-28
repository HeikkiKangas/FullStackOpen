import ReactDOM from 'react-dom/client'
import App from './App'
import {NotificationContextProvider} from "./NotificationContext.jsx";
import {UserContextProvider} from "./UserContext.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {StrictMode} from "react";
import {BrowserRouter as Router} from "react-router-dom";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <UserContextProvider>
          <Router>
            <App />
          </Router>
        </UserContextProvider>
      </NotificationContextProvider>
    </QueryClientProvider>
  </StrictMode>
)
