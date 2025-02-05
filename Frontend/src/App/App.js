import React,{useState,useEffect,lazy,Suspense} from 'react';
import { BrowserRouter as Router, Routes,Route,Navigate} from 'react-router-dom';
import { CircularProgress } from "@mui/material";
import Login from '../LoginFrontend/login.jsx';
import Registration from '../RegistrationFrontend/Registration.jsx'
import Agri from '../LandingPage/Agri.jsx';
import axios from 'axios';
import Sell from '../sellFolder/Sell.jsx';
import InitialBuy from '../Buy/InitialBuy.jsx';
import { LocationProvider } from '../Context/LocationContext.jsx';
import ByingProductDetail from '../Buy/ByingProductDetail.jsx';
import OrganicForming from '../OrganicForming/OrganicForming.jsx';
const Profile = lazy(() => import("../UserProfile/ProfilePage.jsx"));
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check if the user is authenticated by validating the token
    const checkAuth = async () => {
      try {
        //console.log("Checking Auth: ", document.cookie);
        const response = await axios.get("https://agrivibess.onrender.com/login/protected", {
          withCredentials: true // Ensure cookies are sent
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }finally {
        //console.log("Setting loading to false");
        setLoading(false); // Set loading to false after check completes
      }
    };

    checkAuth();
  }, []);
  //console.log("Current Loading State:", loading);

  if (loading) {
    // Show a loading spinner or placeholder while validating
    return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <CircularProgress /> {/* Material-UI Circular Spinner */}
  </div>
    );
  }

  return (
    <LocationProvider>
<Router>
 {/* Add the ToastContainer here */}
 <ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  toastStyle={{
    backgroundColor: "#1C1C2B ", 
    color: "#FFFFFF", // White text for contrast
    fontWeight: "bold", // Bold text
    borderRadius: "10px", // Rounded corners
    padding: "10px", // Spacing
    fontSize: "16px", // Larger font
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)", // Subtle shadow
  }}
  closeButton={
  <button
    style={{
      position: "absolute", // Absolute positioning to place it at the corner
      top: "10px", // Adjust the distance from the top
      right: "10px", // Adjust the distance from the right
      color: "#FFFFFF", // White close button
      fontWeight: "bold", // Make it stand out
      fontSize: "14px", // Slightly larger size
      border: "none", // Remove border
      background: "transparent", // Transparent background
      cursor: "pointer", // Pointer for better UX
    }}
  >
    ✖
  </button>
}
/>

  <Routes>
  <Route 
          path="/"
          element={isAuthenticated?<Navigate to="/agri" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
        />     
        <Route/>
        <Route path="/agri" element={isAuthenticated===null ? (<div>Loading...</div>):isAuthenticated?<Agri isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/" />} />
    <Route path='/register' element={<Registration/>}/>
    <Route path="/sell/:category"
  element={
    isAuthenticated ? (
      <Sell isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    ) : (
      <Navigate to="/" />
    )
  }/>
  <Route path='/buy'element={<InitialBuy/>}/>
  <Route path='/buy/product/:index' element={<ByingProductDetail />} />
<Route path='/profilee' element={<Suspense fallback={<div>Loading Profile...</div>}><Profile/></Suspense>}/>
<Route path='/organicForming' element={<OrganicForming/>}/>
  </Routes>
</Router>
</LocationProvider>
  );
}
export default App;
