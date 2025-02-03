import React,{useState,useContext} from 'react';
import { useNavigate } from "react-router-dom";
import   '../LandingPage/AgriVibes.css';
import style from '../OrganicForming/organic.module.css'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram ,faLinkedin,faGithub} from '@fortawesome/free-brands-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {createTheme, Box, Menu, MenuItem, Button,ThemeProvider, IconButton } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { ContactMail } from "@mui/icons-material";
import Flag from 'react-world-flags';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu'; 
import { LoadScript } from '@react-google-maps/api';
import { Autocomplete, TextField } from "@mui/material";


import { LocationContext } from '../Context/LocationContext.jsx';
import logo from '../assets/SmallOnly.png'
import NamalvarCartton from '../assets/Cartton.png'

import Govtagri from '../assets/govtAgri.png'
import kisan from '../assets/KisanWeb.png'
import TamilNaduAgri from '../assets/TamilnaduGovt.png'
import Organicweb from '../assets/OrganicWeb.png'
import TheFormer from '../assets/former image.jpg'
import { ToastContainer, toast } from 'react-toastify';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const libraries = ["places"];
function OrganicForming({ isAuthenticated, setIsAuthenticated }) {
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
                fontSize: "large", // Set font size
                fontFamily: "'Lora', serif",
                textTransform: "none", // Remove text capitalization
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "black",
                padding: "8px 16px",
                boxShadow: "none", // No shadow initially
                textDecoration: "none",
                fontWeight: "normal",
                transition: "all 0.3s ease", // Smooth transition for hover effects
                border: "none",
      
                "&:focus": {
                  outline: "none",
                  boxShadow: "none",
                  backgroundColor: "transparent",
                },
      
                "&:active": {
                  boxShadow: "none",
                  backgroundColor: "transparent",
                },
      
              },
            },
          },
        },
      });
      
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
                     width:"150px",
                     height:"40px",
                     borderRadius:"50px",
                    },
                },
            },
        },
        });


        const theme2 = createTheme({
          palette: {
            primary: {
              main: '#0f172a', // Default color for primary buttons
            },
          },
          components: {
              MuiButton: {
                  styleOverrides: {
                      root: {
                        padding: '4px 19px',
                       width:"200px",
                       height:"50px",
                       borderRadius:"50px",
                      },
                  },
              },
          },
          });
        const importAll = (requireContext) => {
          const images = {};
          requireContext.keys().forEach((item) => {
            const key = item.replace('./', ''); // Remove './' from the filename
            images[key] = requireContext(item);
          });
          return images;
        };

        const navigate = useNavigate();

        const bannerImages=importAll(require.context('../assets/Banner',false,/\.(png|jpe?g|svg)$/));

   


        const [anchorEl, setAnchorEl] = useState(null);

 
        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
        };
      
        // Close menu
        const handleClose = () => {
          setAnchorEl(null);
          console.log("Not Blocking")
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
      //---------------------------------------------------LOCATION-----------------------------------------------------------------
      
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
        toast("Please enter a location before proceeding!");
      } else {
        setIsInputValid(true); // Reset validation state if input is valid
        // Store the current inputValue in the context
      }
    };
    //------------------------------------------------------SEARCH CONTAINER------------------------------------------------------------------
      
    
    const handleSearchChange = (e) => {
      const input = e.target.value;
      setSearchValue(input);
    };
    
    const handleSearchSubmit = (e) => {
      
      if (!searchValue.trim() || !inputValue.trim()) {
        
        if(!searchValue.trim()){
        e.preventDefault(); 
        toast("Please enter something to search");
        return;
        }
        else if(!inputValue.trim()){
          e.preventDefault();
          toast("Please enter a location before proceeding!");
          return;
        }
      }
    
    navigate("/buy", { state: { searchValue, inputValue } });
      console.log("Searching for:", searchValue);
    };
        
    
    //----------------------------------------------------LOGOUT FUNCTION-------------------------------------------------------------------
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
    //---------------------------------------------------------------------------------------------------------------------------------------
      const Writings = () => (
        <div className="writtings">
          <h1>AgriVibes...Vibes of Modern Agriculture</h1>
          <h2>You Grow, We Sell</h2> 
          <br/>
          <Button variant="contained" component={Link} className='BannerButton'
      to="/buy" onClick={handleNavigate} startIcon={<ShoppingCartIcon/>}>BUY...</Button>
        </div>
      );
      
        
        const Icon=()=>(
          <div className='social-icon' style={{ display: "flex", justifyContent: "flex-end",alignItems:"flex-end", gap: "25px",position: "absolute",
           bottom: "20px", left: "93%", transform: "translateX(-50%)", 
          }}>
          {/* Facebook */}
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
           className="icon-link facebook-icon"
          >
            <FacebookIcon fontSize="large" />
          </a>
          {/* Instagram */}
          <a
            href="https://www.instagram.com"
            target="_blank"
           className="icon-link instagram-icon"
            rel="noopener noreferrer"
          >
            <InstagramIcon fontSize="large" />
          </a>
        </div>
        );
      
      const Icon1=()=>(
        <div className='whatsapp'>
          <a
            href="https://wa.me/your-number"
            target="_blank"
            rel="noopener noreferrer"
            style={{color: "#25D366", fontSize: "32px" }}
          >
            <WhatsAppIcon fontSize="large" />
          </a>
          </div>
      );
      
      
       const [menuActive, setMenuActive] = useState(false);
      
        const handleMenuToggle = () => {
          setMenuActive(!menuActive);
        };
      
 
    return (
   
   <div className='Full'>
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
           console.log("MenuItem clicked");
  Logout();
  handleClose();
}}>
        {isAuthenticated ? (
          <>   
         
      <LogoutIcon fontSize="small" sx={{ marginRight: "8px" }} />
      <span>Login</span> 
  </>
): (  <>
        <LoginIcon fontSize="small" sx={{ marginRight: "8px" }} />
          <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
            Logout
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
 <div className='wrapper'>
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
                  <MenuItem
                    onClick={() => {
                      console.log("MenuItem clicked");
                      handleClose();
                    }}
                  >
                    <LogoutIcon fontSize="small" style={{ marginRight: "8px" }} />
                    Logout
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
   

    <div className="Banner-image">
    <div className="slide-wrapper">

 

  <div className="slide-image"key= {bannerImages["banan-6.jpg"]}>
 <Writings />
 <Icon />
 <Icon1/>
   <Link to="/sell/Rawproduct"><img src={bannerImages["banan-6.jpg"]} alt="banana"/></Link>
 </div>

 <div className="slide-image" key={bannerImages["goods-banner-1.png"]} >
 <Writings />
 <Icon/>
 <Icon1/>
 <Link to="/sell/Finishedproduct"><img src={bannerImages["goods-banner-1.png"]} alt="goods" /></Link>
 </div>

 <div className="slide-image" key={bannerImages["cows 6-banner.jpg"]} >
 <Writings />
 <Icon/>
 <Icon1/>
    <Link to="/sell/Livestock"><img src={bannerImages["cows 6-banner.jpg"]} alt="cattles" /></Link>
 </div>

 <div className="slide-image" key={bannerImages["finishedProduct-banner-1.jpg"]} >
 <Writings />
 <Icon/>
 <Icon1/>
   <Link to="/sell/Finishedproduct"><img src={bannerImages["finishedProduct-banner-1.jpg"]} alt="FinishedProduct" /></Link>
 </div>

 <div className="slide-image"key= {bannerImages["fertilizer-7-banner.jpg"]}>
 <Writings />
 <Icon/>
 <Icon1/>
   <Link to="/sell/Fertilizers"><img src={bannerImages["fertilizer-7-banner.jpg"]} alt="Fertilizer"/></Link>
 </div>
 
 <div className="slide-image"key= {bannerImages["wheat-4.jpeg"]}>
 <Writings />
 <Icon/>
 <Icon1/>
   <Link to="/sell/Rawproduct"><img src={bannerImages["wheat-4.jpeg"]} alt="wheat"/></Link>
 </div>

 <div className="slide-image" key={bannerImages['AgriMachine-banner-1.jpg']}>
 <Writings />
 <Icon/>
 <Icon1/>
<Link to="/sell/Machine"><img src={bannerImages["AgriMachine-banner-1.jpg"]} alt="Tractor" /></Link>
 </div>


</div>
</div>

<h1 className= {style.heading}>Nammazhvar Quotes</h1>
<div className= {style.Quotes}>

<div className= {style.ClassCartoon}>
<img src={NamalvarCartton} alt='Namalvar Cartton' className={style.Cartoon} />
</div>



<div className= {style.quotes1}>
<strong className= {style.content1}>"Effort is like a seed… Keep sowing it. If it grows, it becomes a tree.
If not, it enriches the soil as nourishment"</strong>
</div> 

<div className = {style.quotes2} >
<strong className={style.content2}>"Opportunities and circumstances neither create heroes nor cowards they simply reveal who you truly are"</strong>
</div>

<div className={style.quotes3}>
  <strong className= {style.content3}>"When we compromise for our own benefit, that's when we begin to step toward the path of destruction"</strong>
</div>
</div>

<h1 className= {style.organicHeading}>Organic Forming</h1>
<div className={style.Organic}>
<p className= {style.organicPara}>Organic farming prioritizes human welfare and environmental health, guided by principles of health, ecology, and fairness. 
This sustainable practice combines tradition, innovation, and science, with roots dating back to Sir Albert Howard's studies of
 Indian farming in 1905. Organic methods like Fukuoka farming and Rishi krishi emphasize soil care and energy efficiency, 
 cutting energy use by over 30% through reduced dependence on synthetic inputs.India, with nearly 7 lakh organic producers, 
 has the potential to lead globally but faces challenges like initial yield drops, limited pest management options, and 
 marketing infrastructure. Despite these hurdles, organic farming boosts yields for crops like rice, maize, and cotton while
  offering climate-friendly and health benefits. Global demand for organic products is rising, with organic agriculture
   practiced in 162 countries, covering 37 million hectares.</p>

<h2 className= {style.videoHeading}>Video Resource</h2>
<div className ={style.videoFrame}>
<iframe width="560" height="315" src="https://www.youtube.com/embed/TTPm6oJWe5I?si=eQx9iqeWSLpYutIF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; 
clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/fRlUhUWS0Hk?si=LSofDZ4q-oF-mp0W" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; 
web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen className= {style.video2}>
</iframe>
</div>

<h2 className= {style.webheading}>Goverment Website For Organic Forming</h2>
<div className= {style.website}>

<div className= {style.firstWeb}>
<img src={Govtagri } alt= "Agriculture Department India" className= {style.image1}/>
<h4>Agriculture Department Of India</h4>
<Box sx={{ display: "flex", justifyContent: "space-between", mt: 2,ml:18,gap:1}}>
<ThemeProvider theme={theme1}>

<Button variant='contained' onClick={()=>window.open('https://www.india.gov.in/topics/agriculture')} startIcon={<TravelExploreIcon/>} className= {style.button1}>Visit</Button>
</ThemeProvider>
</Box>
</div>

<div className={style.secondWeb}>
  <img src={kisan} alt='Kisan website' className= {style.image2}/>
  <h4>Kissn Website</h4>
  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2,ml:18,gap:1}}>
  <ThemeProvider theme={theme1}>
  <Button variant='contained' onClick={()=>window.open('https://www.myscheme.gov.in/schemes/kcc')} startIcon={<TravelExploreIcon/>} className={style.button2}>Visit</Button>
  </ThemeProvider>
  </Box>
</div>

<div className={style.thirdWeb}>
  <img src={TamilNaduAgri} alt="TamilNadu Agriculture Department" className= {style.image3}/>
  <h4>Tamil Nadu Agriculture Department</h4>
  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2,ml:18,gap:1}}>
  <ThemeProvider theme={theme1}>
  <Button variant='contained' onClick={()=>window.open('https://www.tnagrisnet.tn.gov.in/home/contact/en')} startIcon={<TravelExploreIcon/>} className= {style.button3}>Visit</Button>
  </ThemeProvider>
  </Box>
</div>

<div className={style.fourthWeb}>
  <img src={Organicweb} alt="Organic Forming WebSite of India" className={style.image4}/>
  <h4>National Centre for Organic and Natural Farming</h4>
  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2,ml:18,gap:1}}>
  <ThemeProvider theme={theme1}>
  <Button variant='contained' onClick={()=>window.open('https://nconf.dac.gov.in/')} startIcon={<TravelExploreIcon/>} className= {style.button4}>Visit</Button>
  </ThemeProvider>
  </Box>
</div>
</div>

</div>
<h1 className= {style.formersHeading}>The Formers</h1>
<div className={style.Formers}>
<img src={TheFormer} alt="The Formers" className= {style.formerPic} />
  <p className={style.TheFormers}>
  Farmers are the lifeline of society, tirelessly working to grow and harvest the food that sustains us all. 
  From sunrise to sunset, they cultivate crops, nurture livestock, and steward the land with dedication and resilience. 
  Through their efforts, they not only feed the world but also uphold traditions, support economies, and protect the 
  environment. Farmers embody hard work, innovation, and an unyielding connection to nature—ensuring a sustainable future for 
  generations to come.Farmers play a vital role in shaping the world we live in. They are more than just food producers—they are custodians of the land,
  innovators in agriculture, and drivers of rural communities. With their hands in the soil and their hearts connected to nature, they embrace challenges such as unpredictable weather,
  market fluctuations, and evolving technologies.Farmers are also at the forefront of sustainability, using eco-friendly practices to balance
 productivity with environmental preservation. Their dedication ensures food security, fuels economies, and bridges the gap between tradition and modernity.
Without farmers, there would be no food on our plates, no fibers for our clothing, and no sustainable future for our planet. 
They truly are the unsung heroes of society.
  </p>
</div>

<div className={style.NewsLetter}>
  <strong className= {style.ideas}>
  Hi, I’m Sanja Thanigaivelu—a passionate Full-Stack Developer and agriculture enthusiast dedicated to bridging the gap between Agriculture and Technology. 
  If you’re working on newsletters, blogs, or innovative ideas related to Tech, Agriculture, or my open-source project AgriVibes, I’d love to connect! Your ideas are always welcome, and I’m eager to collaborate to create a better world together. 
  Feel free to reach out—let’s make an impact!
  </strong>
  <ThemeProvider theme={theme2}>
  <Button
  component="a"
  href="https://mail.google.com/mail/?view=cm&fs=1&to=sanjaymuthulakshmi@gmail.com&su=About%20My%20Idea&body=Hi,%20I%20am%20interested%20in%20discussing%20an%20opportunity%20with%20you!"
  target="_blank"
  variant="contained"
  color="primary"

  startIcon={<ContactMail/>}
>
Contact Me
</Button>
</ThemeProvider>
</div>

 <div className="Footer">
          <table className="Footer inside">
          <tbody>
          <tr>
            <td className="foot logo">
            <Link to ="/" className="footLink"><img className="logo"  src={logo} alt="AgriVibes Logo" /></Link>
            </td>
            <td className="foot Home" ><Link to="/" className="footLink homecome">Home</Link></td>
            <td className="foot About"><Link to='https://myfirstportfolioweb.netlify.app/' className="footLink abouttt">About Us</Link></td>
            <td className="foot AgriVibes">AgriVibes<br/><Link to='#' className="footLink blog">Blog</Link><br/><Link 
  className="footLink help" 
  to="https://mail.google.com/mail/?view=cm&fs=1&to=agrivibes07@gmail.com&su=Query%20Enquiry"
  target="_blank"
  rel="noopener noreferrer"
>
  Help
</Link><br/><Link to='' className="footLink legal">Legal & Privacy Information</Link></td>
          <td className="foot follow">Follow Us<br/><Link to='#' className="footLink insta"><FontAwesomeIcon icon={faInstagram} /></Link>  <Link to='#' className="footLink linkdin"><FontAwesomeIcon icon={faLinkedin} />  </Link><Link to='#' className="footLink git"><FontAwesomeIcon icon={faGithub}/></Link></td>
          <td className="foot Copyright">&#169;2024 AgriVibes. All rights are reserved</td>
          </tr>
          </tbody>
          </table>
        </div>

    </div>



  )
}

export default OrganicForming