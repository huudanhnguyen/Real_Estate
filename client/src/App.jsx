import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth.context";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <>
          <AppRoutes />
          <Toaster position="top-right" reverseOrder={false} />
        </>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
