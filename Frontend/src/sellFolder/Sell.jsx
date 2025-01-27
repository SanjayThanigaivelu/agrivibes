import React,{useState,useContext} from "react";
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
import Flag from 'react-world-flags';
import axios from 'axios';
import logo from '../assets/AgriVibesFinal.jpg';
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

function Sell({ isAuthenticated, setIsAuthenticated }) {
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

          
          "&:hover": {
            backgroundColor: "#d3cdcd", 
            borderLeft: "5px solid #6B8E23", 
            borderRadius: "35px", 
            transition: "all 0.3s ease", 
          }
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
    
     
      
      const libraries = ["places"];
       const [options, setOptions] = useState([]);
        const [isApiLoaded, setIsApiLoaded] = useState(false);
              
                const { inputValue, setInputValue, isInputValid, setIsInputValid } = useContext(LocationContext); //Usage of Context API
              
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
           
   
      
      //------------------------------------------------------SEARCH CONTAINER--------------------------------------------------------
        
      const [searchValue, setSearchValue] = useState(''); // State to store the input value
      
      const handleSearchChange = (e) => {
        setSearchValue(e.target.value); // Update state as user types
      };

    async function Logout() {
      try {
        const response = await axios.post("http://localhost:5000/login/logout", {}, { withCredentials: true });
        console.log("Logout response:", response.data);
    
        setIsAuthenticated(false);
        console.log("IsAuthenticated set to:", false);
    
        //navigate("/"); // Redirect to the login pagep
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
 


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
 return(    <div className="Full">

  <div className="Ribbon">
    <table className="container">
      <thead>
      <tr className="row1">
         
      <td><Link to ="/"><img className="logo"  src={logo} alt="AgriVibes Logo" /></Link></td>
          <td style={{    
       width: "500px",
      padding: "15px"}}> 
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
        sx={{
          "& .MuiOutlinedInput-root": {
            height: "50px", // Adjust height of input
           borderRadius:"25px",
            "& fieldset": {
              borderColor: isInputValid ? "#6B8E23" : "red", // Red border if invalid
              borderWidth: isInputValid ? "2px" : "3px", // Thicker border if invalid
            },
            "&:hover fieldset": {
              borderColor: "#6B8E23",
              borderWidth: "1.5px",
            },
            "&.Mui-focused fieldset": {
              borderColor: isInputValid ? "#6B8E23" : "red", // Keep red if focused and invalid
              borderWidth: "3px",
            },
          },
          "& .MuiInputBase-input": {
            padding: "8px",
          },
          "& .MuiInputLabel-root": {
            color: isInputValid ? "#000" : "red", // Red label if invalid
            "&.Mui-focused": {
              color: isInputValid ? "#6B8E23" : "red", // Green or red when focused
            },
          },
        }}
      />
    )}
  />
</LoadScript>

      </td>
       
          <td>
          <Box sx={{ display: 'flex', alignItems: 'center',position:"relative" }}>
        {/* Input field */}
        <form style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            value={searchValue}
            onChange={handleSearchChange} // Update the value as user types
            label="Find Tractor, Motor Pumps and more..."
            variant="outlined"
            sx={{
    "& .MuiOutlinedInput-root": {
     width:'450px',
      height: "50px", // Adjust the height of the input
    borderRadius:"25px",
      "& fieldset": {
        borderColor: "#6B8E23", // Set border color to green
        borderWidth: "2px", // Increase border width
      },
      "&:hover fieldset": {
        borderColor: "#6B8E23", // Darker green on hover
        borderWidth: "1.5px", // Slightly thicker border on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6B8E23", // Lime green when focused
        borderWidth: "3px", // Thicker border when focused
      },
    },
    "& .MuiInputBase-input": {
      padding: "8px", // Adjust padding for the input
    },
    "& .MuiInputLabel-root": {
      color: "#000", // Default label color
      "&.Mui-focused": {
        color: "#6B8E23", // Green label when focused
      },
      "&:hover": {
        color: "#6B8E23", // Green label on hover
      },
    },
  }}
          />
  
          {/* Search Button */}
          <IconButton
            type="submit"
            color="primary"
            sx={{
                    color: "#6B8E23", // Set the icon color to green
          position: "absolute", // Position the icon absolutely within the form
          right: "10px", // Place the icon 10px from the right edge of the TextField
          top: "50%", // Center the icon vertically
          transform: "translateY(-50%)", 
                  }}
          >
            <SearchIcon />
          </IconButton>
        </form>
      </Box>
          </td>
  
          <td className="dropdown">
              <ul className="select">
                  <li>
                  <ThemeProvider theme={theme}>
                  <Button onClick={handleClick1}  sx={{
            display: 'flex',
            justifyContent: 'center', // Center content horizontally
            alignItems: 'center', // Center content vertically
            width: '100%', // Optional: set a fixed width
          }}
          className='button-type1'
          >
          <Flag code="IN" style={{ width: '24px', height: '16px', marginRight: '8px' }} />
          {language ? `    ${language}` : 'Language'}
          <FontAwesomeIcon icon={faChevronDown}  className={`fa-chevron-down ${isOpen ? 'open' : ''}`}/>
        </Button>
        <Menu
          anchorEl={anchorEl1}
          open={Boolean(anchorEl1)}
          onClose={() => setAnchorEl1(null)}
          PaperProps={{
      style: {
        width: '200px',  // Custom width for the menu
      },
    }}
        >
          <MenuItem onClick={() => handleClose1('English')}>English</MenuItem>
          <MenuItem onClick={() => handleClose1('Tamil')}>Tamil</MenuItem>
        </Menu>
        </ThemeProvider>
                  </li>
              </ul> 
          </td>
  
          <td><Link to="/organicForming" className="button-type">Organic Farming</Link></td>
          
          <Box  
          sx={{
            fontSize: "large",
            display: "flex",
             flexDirection: "column",
            height: "15vh",
            justifyContent: "center",
            alignItems: "center",
            overflow: "visible",
            marginRight:"5px",  
          }}
          
          >
        {/* Account Link */}
      
  
        <ThemeProvider theme={theme}>
        
        <Button
          onClick={handleClick}
          variant="text"
          sx={{
        padding: "8px 10px", // Keep button size consistent
        borderRadius: "35px",
      }}
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
          <MenuItem onClick={handleClose}>
          <PersonIcon fontSize="small" sx={{ marginRight: "8px" }} />
            <Link
              to="/profile"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Profile
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
          <FavoriteIcon fontSize="small" sx={{ marginRight: "8px" }} />
            <Link
              to="/liked-items"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Liked Items
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose}>
          <HelpOutlineIcon fontSize="small" sx={{ marginRight: "8px" }} />
            <Link to="/help" style={{ textDecoration: "none", color: "inherit" }}>
              Help
            </Link>
          </MenuItem>
        </Menu>
        </ThemeProvider>
      </Box>
     
  
          <td><Link to="/buy" className="sell-button"><i className="fas fa-plus"></i>BUY...</Link></td>
      </tr>
      </thead>
  </table>
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
</div>
  )
}

export default Sell;