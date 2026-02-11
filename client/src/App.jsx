import { BrowserRouter, Route, Routes } from "react-router-dom"
import { isLoggedIn } from "./lib/auth"
import ProtectedRoutes from "./components/ProtectedRoutes"
import { Navigate } from "react-router-dom"
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Rooms from "./pages/Rooms";
import ChatRoom from "./pages/ChatRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isLoggedIn() ? "/rooms" : "/login"} replace />}
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/chat/:room"
          element={
            <ProtectedRoutes>
              <ChatRoom />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoutes>
              <Rooms />
            </ProtectedRoutes>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


