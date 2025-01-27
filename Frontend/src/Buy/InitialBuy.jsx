import React,{useState,useContext, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import   '../LandingPage/AgriVibes.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram ,faLinkedin,faGithub} from '@fortawesome/free-brands-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {createTheme, Box, Menu, MenuItem, Button,ThemeProvider,IconButton,CircularProgress} from "@mui/material"

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../assets/AgriVibesFinal.jpg'

import FavoriteIcon from '@mui/icons-material/Favorite';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Flag from 'react-world-flags';
import axios from 'axios';
import { LoadScript } from '@react-google-maps/api';
import { Autocomplete, TextField } from "@mui/material";

import {LocationContext} from '../Context/LocationContext.jsx';

import Noresult from '../assets/No-result.jpeg'

import style from './buyingStyle.module.css'
import { error } from 'ajv/dist/vocabularies/applicator/dependencies.js';


function InitialBuy({ isAuthenticated, setIsAuthenticated }) {

    const navigate = useNavigate();
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
//-----------------------------------------------------THEME----------------------------------------------------------------------------------------------------------------
         
  const theme1 = createTheme({
    palette: {
      primary: {
        main: '#66bb6a', // Default color for primary buttons
      },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                  padding: '4px 19px',
                  width: '80px !important', // Custom size (width and height)
                 height: '80px !important',
                },
            },
        },
    },
  });

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------


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
              const response = await axios.post("http://localhost:5000/login/logout", {}, { withCredentials: true });
              console.log("Logout response:", response.data);
          
              setIsAuthenticated(false);
              console.log("IsAuthenticated set to:", false);
          
              //navigate("/"); // Redirect to the login pagep
            } catch (error) {
              console.error("Logout failed:", error);
            }
          }
//----------------------------------------------LOCATION CONTAINER----------------------------------------------------------------
const libraries = ["places"];
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
     
          const handleNavigate = (event) => {
            if (!inputValue.trim()) {
              event.preventDefault(); // Prevent navigation
              setIsInputValid(false); // Set input as invalid
              alert("Please enter a location before proceeding!");
            } else {
              setIsInputValid(true); // Reset validation state if input is valid
              // Store the current inputValue in the context
            }
          };
//------------------------------------------------------SEARCH CONTAINER--------------------------------------------------------
const handleSearchChange = (e) => {
  const input = e.target.value;
  setSearchValue(input);
};

const handleSearchSubmit = (e) => {
  
  if (!searchValue.trim() || !inputValue.trim()) {
    
    if(!searchValue.trim()){
    e.preventDefault(); 
    alert("Please enter something to search");
    return;
    }
    else if(!inputValue.trim()){
      e.preventDefault();
      alert("Please enter a location before proceeding!");
      return;
    }
  }

navigate("/buy", { state: { searchValue, inputValue } });
  console.log("Searching for:", searchValue);
};
//-------------------------------------------------API CALLING START 'S-----------------------------------------------------------
const [products, setProducts] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [loading, setLoading] = useState(true);
const itemsPerPage = 30;

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

useEffect(()=>{
  setLoading(true);
if(!searchValue.trim()){
one(inputValue);
}
else{
  two(inputValue,searchValue);
}
},[inputValue,searchValue])

function two(inputValue,searchValue){
console.log("Location :",inputValue,"SearchedValue :",searchValue);

axios.post("http://localhost:5000/sell/retrive", {
  Location: inputValue,
  SearchBox: searchValue,
})
.then((response) => {

  setProducts(response.data.result);
  
})
.catch((error) => {
  console.error("Error fetching products:", error);
})
.finally(() => setLoading(false));
}


function one(inputValue){
console.log("Location :",inputValue);
axios.post("http://localhost:5000/sell/retriveAll",{
  Location:inputValue
}) .then((response)=>{
 
  setProducts(response.data.result);
})
.catch((error)=>{
  console.log("Error fetching products:",error);
})
.finally(() => setLoading(false));
}


  return (
    <div className='Full'>

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
        <form style={{ display: 'flex', alignItems: 'center' }} onSubmit={handleSearchSubmit}>
        <TextField
    value={searchValue} // Pre-fill with the persisted value
    onChange={handleSearchChange} // Handle typing
    label="Find Tractor, Motor Pumps and more..."
    variant="outlined"
    sx={{
      "& .MuiOutlinedInput-root": {
        width: '450px',
        height: "50px",
        borderRadius:"25px",
        "& fieldset": {
          borderColor: "#6B8E23",
          borderWidth: "2px",
        },
        "&:hover fieldset": {
          borderColor: "#6B8E23",
          borderWidth: "1.5px",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#6B8E23",
          borderWidth: "3px",
        },
      },
      "& .MuiInputBase-input": {
        padding: "8px",
      },
      "& .MuiInputLabel-root": {
        color: "#000",
        "&.Mui-focused": {
          color: "#6B8E23",
        },
        "&:hover": {
          color: "#6B8E23",
        },
      },
    }}
  />
  <IconButton
    type="submit"
    color="primary"
    sx={{
      color: "#6B8E23",
      position: "absolute",
      right: "10px",
      top: "50%",
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
     
  
          <td><Link to="/buy" className="sell-button" onClick={handleNavigate}><i className="fas fa-plus"></i>BUY...</Link></td>
      </tr>
      </thead>
  </table>
      </div>

<div className={style.conditionRendering}>

{loading ? (
  <ThemeProvider theme={theme1}>
 <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Full viewport height
        }}
      >
  
       <CircularProgress/>
       </div>     
       </ThemeProvider>  

      ) :products.length===0 ?(<div className={style.noResultsContainer}>
<img src={Noresult} alt='No-Result' className='NoResultImage'/>
<h2>No Products Found</h2>
<h4>Try refining your Location or search criteria to find products.</h4>
</div>):(
      <div className={style.gridContainer}>
  {currentProducts.map((product, index) => {
    // Ensure product.Images is processed safely
    const imagePath = product.Images?.[0] || ""; // Get the first image or an empty string

    // Sanitizing the image path
    const sanitizedPath = imagePath.replace(/\/images\/+/g, '/images/').replace(/\/images\/images/, '/images'); // Fix redundant `/images/`

    return (
      <div className={style.imageContainer}
        key={index}
        onClick={() => navigate(`/buy/product/${index}`, { state: product })}
      >
        <img className={style.imageOnly}
          src={`http://localhost:5000/sell${sanitizedPath}`} 
          alt={product.Name} 
        />
        <h3>{product.Name}</h3>
        <h4><strong>Price:</strong>  ₹{product.Price}</h4>
        <p>{product.District}</p>
      </div>
    );
  })}
</div>
)
}
</div>

      {/* Pagination */}
      <div className={style.Pagination}>
        {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => (
          <button className={style.pagebutt}
            key={i} 
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>



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

export default InitialBuy