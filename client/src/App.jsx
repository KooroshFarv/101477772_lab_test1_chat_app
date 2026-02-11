import { BrowserRouter, Route, Routes } from "react-router-dom"
// import { isLoggedIn } from "./lib/auth"
import ProtectedRoutes from "./components/ProtectedRoutes"
import { Navigate } from "react-router-dom"
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Rooms from "./pages/Rooms";
import ChatRoom from "./pages/ChatRoom";
import DirectMessage from "./pages/DirectMessage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


        <Route
          path="/rooms"
          element={
            <PrivateRoute>
              <Rooms />
            </PrivateRoute>
          }
        />

        <Route
          path="/chat/:room"
          element={
            <PrivateRoute>
              <ChatRoom />
            </PrivateRoute>
          }
        />

        <Route
          path="/dm"
          element={
            <PrivateRoute>
              <DirectMessage />
            </PrivateRoute>
          }
        />


        <Route path="*" element={<Navigate to="/rooms" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


