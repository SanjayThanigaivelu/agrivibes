import React,{useState,useContext} from "react";
import { useNavigate } from "react-router-dom";
import   '../LandingPage/AgriVibes.css';
import { Link } from 'react-router-dom';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {createTheme, Box, Menu, MenuItem, Button,ThemeProvider ,IconButton} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import axios from 'axios';
import logo from '../assets/SmallOnly.png';
import './sell.css';
import { useParams } from "react-router-dom";
import AgricultureMachineForm from "./AgricultureMachineForm.jsx";
import RawProductForm from "./RawProductForm.jsx";
import FinishedProductForm from "./FinishedProductForm.jsx";
import FertilizerForm from "./FertilizerForm.jsx";
import ToolsForm from "./ToolsForm.jsx";
import Livestock from "./Livestock.jsx";
import { faInstagram ,faLinkedin,faGithub} from '@fortawesome/free-brands-svg-icons';
import { LoadScript } from '@react-google-maps/api';
import { Autocomplete, TextField } from "@mui/material";
import {LocationContext} from '../Context/LocationContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import WorkIcon from '@mui/icons-material/Work';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


const libraries = ["places"];

function Sell({ isAuthenticated, setIsAuthenticated }) {

   const navigate = useNavigate();

  const { category } = useParams();
  const theme = createTheme({
    typography: {
      fontFamily: "'Lora', serif", // Apply Lora font globally
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableRipple: true, // Disable the ripple effect globally
        },
        styleOverrides: {
          root: {
          fontSize: "large",           // Set font size
         fontFamily: "'Lora', serif",
            textTransform: "none",       // Remove text capitalization
            display: "flex",
            justifyContent: "center",
            alignItems: "center", 
            color: "black",              
            padding: "8px 16px",         
           borderRadius: "35px",         
            boxShadow: "none", 
            textDecoration:"none", 
            fontWeight:"normal",   
            border:"none",
            "&:focus": {
              outline: "none",           
              boxShadow: "none", 
              backgroundColor: "transparent", 
              borderRadius: "35px",        
            },
  
            
            "&:active": {
              boxShadow: "none",         
              border: "none",   
              backgroundColor: "transparent",  
              borderRadius: "35px",        
            },
          },
        },
      },
    },
  });
  
      const [anchorEl, setAnchorEl] = useState(null);
        
          // Open menu on click
          const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
          };
        
          // Close menu
          const handleClose = () => {
            setAnchorEl(null);
          };
        
          const open = Boolean(anchorEl);
      
          const [anchorEl1, setAnchorEl1] = useState(null);
        const [language, setLanguage] = useState('');
        const [isOpen, setIsOpen] = useState(false);
      
      
        const handleClick1 = (event) => {
          setAnchorEl1(event.currentTarget);
          setIsOpen((prevState) => !prevState);
        };
      
        const handleClose1 = (lang) => {
          setLanguage(lang);
          setAnchorEl1(null);
          setIsOpen(false)
        };
      
  
      async function Logout() {
        try {
          const response = await axios.post("https://agrivibess.onrender.com/login/logout", {}, { withCredentials: true });
          setIsAuthenticated(false);
          navigate("/"); 
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }
//----------------------------------------------LOCATION CONTAINER----------------------------------------------------------------
const [options, setOptions] = useState([]);
const [isApiLoaded, setIsApiLoaded] = useState(false);
    
const { inputValue, setInputValue, isInputValid, setIsInputValid,searchValue,setSearchValue } = useContext(LocationContext); //Usage of Context API
    
      const fetchPlaceSuggestions = (input) => {
        if (window.google && window.google.maps) {
          const service = new window.google.maps.places.AutocompleteService();
    
          service.getPlacePredictions(
            {
              input,
              componentRestrictions: { country: "in" },
              types: ["(cities)"],
            },
            (predictions, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setOptions(
                  predictions.map((prediction) => ({
                    label: prediction.description,
                    place_id: prediction.place_id,
                  }))
                );
              } else {
                setOptions([]);
              }
            }
          );
        } else {
          console.error("Google Maps API is not loaded yet");
        }
      };
 //------------------------------------------------------BUY BUTTON-----------------------------------------------------------------------------------------------------
 const handleNavigate = (event) => {
  if (!inputValue.trim()) {
    event.preventDefault(); // Prevent navigation
    setIsInputValid(false); // Set input as invalid
    toast("Please enter a location before proceeding!");
  } else {
    setIsInputValid(true); // Reset validation state if input is valid
    // Store the current inputValue in the context
  }
};
                
//------------------------------------------------------SEARCH CONTAINER------------------------------------------------------------------------------------------------
const handleSearchChange = (e) => {
const input = e.target.value;
setSearchValue(input);
};

const handleSearchSubmit = (e) => {
e.preventDefault(); 

if (!searchValue.trim()) {
toast("Please enter something to search");
return;
}

console.log("Searching for:", searchValue);
};


 


    const renderForm = () => {
      switch (category) {
        case "Machine":
          return <AgricultureMachineForm />;
        case "Rawproduct":
          return <RawProductForm />;
        case "Livestock":
          return <Livestock/>;
        case "Fertilizers":
          return <FertilizerForm />;
        case "Finishedproduct":
          return <FinishedProductForm />;
        case "Tools":
          return <ToolsForm />;
        default:
          return <p>Select a valid category to sell!</p>;
      }
    };
const [menuActive, setMenuActive] = useState(false);

  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };


 return(   
  
  <div className="Full">
<div className="Ribbon">
  <table className="container">
    <thead>
    <tr className="row1">
        <td><Link to ="/"><img className="logo"  src={logo} alt="AgriVibes Logo" /></Link></td>

        <td className='WholeLocationContainer'> 
  <LoadScript
  googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
  libraries={libraries}
  onLoad={() => setIsApiLoaded(true)}
  onError={() => console.error("Google Maps API failed to load")}
>
  <Autocomplete
    options={options}
    getOptionLabel={(option) => option.label || ""}
    filterOptions={(x) => x}
    value={{ label: inputValue }} // Set initial value from context
    onChange={(event, newValue) => {
      // When an option is selected, update the context value
      if (newValue) {
        setInputValue(newValue.label);
        setIsInputValid(true); // Mark as valid if a suggestion is selected
      }
    }}
    onInputChange={(event, value) => {
      // Handle manual typing
      setInputValue(value);

      // Reset validation state if value is not empty
      if (value.trim()) {
        setIsInputValid(true);
      } else {
        setIsInputValid(false); // Mark invalid if input is cleared
      }

      // Fetch suggestions if input is valid
      if (value && isApiLoaded) {
        fetchPlaceSuggestions(value);
      }
    }}
    renderInput={(params) => (
      <TextField
  {...params}
  label="Enter Location"
  variant="outlined"
  className={`LocationText ${isInputValid ? 'valid' : 'invalid'}`}
/>
    )}
  />
</LoadScript>

    </td>

    
     
    <td className="MaterialSearch">
  <Box className="MaterialBox">
    {/* Input field */}
    <form className="SearchContainerForm" onSubmit={handleSearchSubmit}>
      <TextField
        className="MaterialText"
        value={searchValue}
        onChange={handleSearchChange}
        label="Find Tractor, Motor Pumps and more..."
        variant="outlined"
      />
      <IconButton
        type="submit"
        className="search-icon-button"
      >
        <SearchIcon />
      </IconButton>
    </form>
  </Box>
</td>


        <td className='Organic'><Link to="/organicForming" className="button-type">Organic Farming</Link></td>
        <td className= 'Account'>
        <Box className='AccountBox'>
      {/* Account Link */}
    

      <ThemeProvider theme={theme}>
      
      <Button 
        onClick={handleClick}
        variant="text"
    className='button-type1'
        >
        Account
      </Button>
     
       {/* Dropdown Menu */}
       <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
    style: {
      marginTop:'15px',
      width: '300px',  // Custom width for the menu
    },
  }}
      >
        {/* Menu Items */}
        <MenuItem onClick={() => {
  Logout();
  handleClose();
}}>
        {isAuthenticated ? (
          <>   
         
      <LogoutIcon fontSize="small" sx={{ marginRight: "8px" }} />
      <span>Logout</span> 
  </>
): (  <>
        <LoginIcon fontSize="small" sx={{ marginRight: "8px" }} />
          <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
            Login
          </Link> 
        </>
)
        }
        </MenuItem>
        <MenuItem
  onClick={() => {
    navigate('/profilee'); // Navigate to the profile page
    handleClose(); // Close the dropdown
  }}
>
 <PersonIcon fontSize="small" sx={{ marginRight: "8px" }} />
  Profile
</MenuItem>

        <MenuItem onClick={handleClose}>
        <HelpOutlineIcon fontSize="small" sx={{ marginRight: "8px" }} />
          <Link to="https://mail.google.com/mail/?view=cm&fs=1&to=agrivibes07@gmail.com.com&su=Query%20Enquiry" target="_blank"
          rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
            Help
          </Link>
        </MenuItem>
      </Menu>
      </ThemeProvider>
    </Box>
    </td>

        <td className='buyy'><Link to="/buy" className="sell-button" onClick={handleNavigate}><i className="fas fa-plus"></i>BUY...</Link></td>
   
    {/* Mobile Menu */}
    <td className="hamburger-icon">
  <IconButton
    className="hamburger-button"
    onClick={handleMenuToggle} // Toggle the mobile menu visibility
  >
   <MenuIcon />
  </IconButton>
</td>
    </tr>
    </thead>
</table>

 {/* Entire Box Component (visible only when menuActive is true) */}
 <div className="wrapper">
 {menuActive && (
        <Box className="menu-container1">
          <div className="MaterialSearch1">
            <Box className="MaterialBox1">
              <form className="SearchContainerForm1" onSubmit={handleSearchSubmit}>
                <TextField
                  className="MaterialText1"
                  value={searchValue}
                  onChange={handleSearchChange}
                  label="Find Tractor and more..."
                  variant="outlined"
                />
                <IconButton type="submit" className="search-icon-button1">
                  <SearchIcon />
                </IconButton>
              </form>
            </Box>
          </div>

          <div className="Organic1">
          <ThemeProvider theme={theme}>
          <Button variant='text' component={Link} to='/organicForming' className='button-type2' startIcon={<AgricultureIcon/>}>Organic</Button>
          </ThemeProvider>
          </div>

          <div className="Account1">
            <Box className="AccountBox1">
              <ThemeProvider theme={theme}>
                <Button onClick={handleClick} variant="text" className="button-type2" startIcon={<AccountCircleIcon/>}>
                  Account
                </Button>
                </ThemeProvider>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                  PaperProps={{
                    style: { marginTop: "15px", width: "300px" },
                  }}
                >
                                    {/* Menu Items */}
        <MenuItem onClick={() => {
           console.log("MenuItem clicked");
  Logout();
  handleClose();
}}>
        {isAuthenticated ? (
          <>   
         
      <LogoutIcon fontSize="small" sx={{ marginRight: "8px" }} />
      <span>Logout</span> 
  </>
): (  <>
        <LoginIcon fontSize="small" sx={{ marginRight: "8px" }} />
          <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
            Login
          </Link> 
        </>
)
        }
        </MenuItem>
                  <MenuItem onClick={() => {
    navigate('/profilee'); 
    handleClose(); 
  }}>
                    <PersonIcon fontSize="small" style={{ marginRight: "8px" }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <HelpOutlineIcon fontSize="small" style={{ marginRight: "8px" }} />
                    Help
                  </MenuItem>
                </Menu>
             
            </Box>
          </div>

          <div className="buyy1">
          <ThemeProvider theme={theme}>
          <Button variant='text' component={Link} to='/buy' onClick={handleNavigate} startIcon={<ShoppingCartIcon />} // Material-UI icon
      className="sell-button1">Buy</Button>
      </ThemeProvider>
          </div>
        </Box>
      )}
</div>
    </div>
   


{renderForm()}

        <div className="Footer">
          <table className="Footer inside">
          <tbody>
          <tr>
            <td className="foot logo">
            <Link to ="/" className="footLink"><img className="logo"    src={logo} alt="AgriVibes Logo" /></Link>
            </td>
            <td className="foot Home" ><Link to="/" className="footLink homecome">Home</Link></td>
            <td className="foot About"><Link to='#' className="footLink abouttt">About Us</Link></td>
            <td className="foot AgriVibes">AgriVibes<br/><Link to='#' className="footLink blog">Blog</Link><br/><Link to='' className="footLink help">Help</Link><br/><Link to='#' className="footLink legal">Legal & Privacy Information</Link></td>
          <td className="foot follow">Follow Us<br/><Link to='#' className="footLink insta"><FontAwesomeIcon icon={faInstagram} /></Link>  <Link to='#' className="footLink linkdin"><FontAwesomeIcon icon={faLinkedin} />  </Link><Link to='#' className="footLink git"><FontAwesomeIcon icon={faGithub}/></Link></td>
          <td className="foot Copyright">&#169;2024 AgriVibes. All rights are reserved</td>
          </tr>
          </tbody>
          </table>
        </div>

        <div className='Footer1'>
          
         <div className='logo1'>
         <Link to ="/" className="footLink1"><img className="logoimg"  src={logo} alt="AgriVibes Logo" /></Link>
            </div>
        <div className='Name'>
          <h3>AgriVibes Public Ltd.</h3>
          <h4>You Grow, we Sell... | Est:2025</h4>
          <p className='CopyRight'>Copyright © 2025 - All right reserved</p>
          <span className='social-media'><Link to='https://www.instagram.com/sanjay_thanigaivelu/' className="footLink insta"><FontAwesomeIcon icon={faInstagram} /></Link>  <Link to='https://linkedin.com/in/sanjay-thanigaive07' className="footLink linkdin"><FontAwesomeIcon icon={faLinkedin} />  </Link><Link to='https://github.com/SanjayThanigaivelu' className="footLink git"><FontAwesomeIcon icon={faGithub}/></Link></span>
        </div>
        
        
            </div>
</div>
  )
}

export default Sell;