import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MainPages from "./pages/MainPage.jsx";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Chat from "./pages/chat.jsx";


function App() {
  return (
    <Router>
      <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPages />} />
        <Route path="/" element={<Login  />} />
        <Route path="/" element={<Signup />} />
        <Route path="/" element={ 
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />

        {/* Protected Route */}
        <Route path="*" element={ <Navigate to="/" replace />}/>  
      </Routes>
      </div>
    </Router>
  );
}

export default App;
