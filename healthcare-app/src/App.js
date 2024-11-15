import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import About from './pages/about';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { ApolloWrapper } from './apollo';

const firebaseConfig = {
  apiKey: "AIzaSyAabOmCodKeA3c4ndN6FpVZbl6RiPOiRfU",
  authDomain: "healthcare-23170.firebaseapp.com",
  projectId: "healthcare-23170",
  storageBucket: "healthcare-23170.firebasestorage.app",
  messagingSenderId: "766830458983",
  appId: "1:766830458983:web:1cd97a0ffe8e7839b07cc2",
  measurementId: "G-NECZP4FS5V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  return (
    <ApolloWrapper>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ApolloWrapper>
  );
}

export default App;