
import React,{useState,useContext,useEffect,useMemo} from 'react';
import { useNavigate } from "react-router-dom";
import   './AgriVibes.css';
import '../LandingPage/LandigRes.css'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram ,faLinkedin,faGithub} from '@fortawesome/free-brands-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {createTheme, Box, Menu, MenuItem, Button,ThemeProvider, IconButton } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'; 
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import axios from 'axios';
import { LoadScript } from '@react-google-maps/api';
import { Autocomplete, TextField } from "@mui/material";

import { LocationContext } from '../Context/LocationContext.jsx';

import NamalvarFormal from '../assets/Namalvar Formal.jpg'
import Portfolio from '../assets/portfolio5.jpg'

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import WorkIcon from '@mui/icons-material/Work';
import { ToastContainer, toast } from 'react-toastify';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const libraries = ["places"];

const importAll = (requireContext) => {
  const images = {};
  requireContext.keys().forEach((item) => {
    const key = item.replace('./', ''); // Remove './' from the filename
    images[key] = requireContext(item);
  });
  return images;
};

const categoryImages=importAll(require.context('../assets/categories',true, /\.(png|jpe?g|svg)$/));

const bannerImages=importAll(require.context('../assets/Banner',false,/\.(png|jpe?g|svg)$/));

const restImages=importAll(require.context('../assets' ,false,/\.(png|jpe?g|svg)$/));

const bannerImages1=importAll(require.context('../assets/PhoneScreen',false,/\.(png|jpe?g|svg)$/));

const getRandomImage=(imageKeys)=>{
  const randomIndex=Math.floor(Math.random() * imageKeys.length);
  return imageKeys[randomIndex];
};

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
                 width:"40px",
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
                 width:"150px",
                 height:"40px",
                 borderRadius:"50px"
                },
            },
        },
    },
  });
  export default function Agri({ isAuthenticated, setIsAuthenticated }) {

    const [menuActive, setMenuActive] = useState(false);
    const navigate = useNavigate();

  const agriMachineImage=getRandomImage(Object.keys(categoryImages).filter(key=>key.includes('Agriculture-Machine')));
  const cattleImage=getRandomImage(Object.keys(categoryImages).filter(key=>key.includes('cattles')));
  const fertilizerImage=getRandomImage(Object.keys(categoryImages).filter(key=>key.includes('fertilizer')));
  const FinshedProductImage=getRandomImage(Object.keys(categoryImages).filter(key=>key.includes('FinishedProduct')));
  const RawProductImage=getRandomImage(Object.keys(categoryImages).filter(key=>key.includes('RawProduct')));
  const ToolsImage=getRandomImage(Object.keys(categoryImages).filter(key=>key.includes('Tool')));



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
      const response = await axios.post("https://agrivibess.onrender.com/login/logout", {}, { withCredentials: true });
      console.log("Logout response:", response.data);
  
      setIsAuthenticated(false);
      navigate("/"); 
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
    <div className='social-icon'>
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
      href={`https://wa.me/${process.env.REACT_APP_PHONE_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{color: "#25D366", fontSize: "32px" }}
    >
      <WhatsAppIcon fontSize="large" />
    </a>
    </div>
);
//----------------------------------------------------HAMBERGUR LOGIC---------------------------------------------------------------------------------------


 

  const handleMenuToggle = () => {
    console.log("Menu Active:", menuActive);
    setMenuActive(!menuActive);
  };

  

  return (
    <div className="Full">

<div className="Ribbon">
  <table className="container">
    <thead>
    <tr className="row1">
        <td><Link to ="/"><img className="logo"  src={restImages['SmallOnly.png']} alt="AgriVibes Logo" /></Link></td>

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
                  label="Find Tractor and more"
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
                  <MenuItem
  onClick={handleClose}
  component="a"
  href="https://mail.google.com/mail/?view=cm&fs=1&to=agrivibes07@gmail.com&su=Query%20Enquiry"
  target="_blank"
  rel="noopener noreferrer"
>
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


<div className="Banner-image1">
    <div className="slide-wrapper">

 

  <div className="slide-image"key= {bannerImages1["BananaRes4.jpg"]}>
 <Writings />
 <Icon />
 <Icon1/>
   <Link to="/sell/Rawproduct"><img src={bannerImages1["BananaRes4.jpg"]} alt="banana"/></Link>
 </div>

 <div className="slide-image" key={bannerImages1["For2.jpg"]} >
 <Writings />
 <Icon/>
 <Icon1/>
 <Link to="/sell/Finishedproduct"><img src={bannerImages1["For2.jpg"]} alt="goods" /></Link>
 </div>

 <div className="slide-image" key={bannerImages1["MobileRes-cow1.jpg"]} >
 <Writings />
 <Icon/>
 <Icon1/>
    <Link to="/sell/Livestock"><img src={bannerImages1["MobileRes-cow1.jpg"]} alt="cattles" /></Link>
 </div>

 <div className="slide-image" key={bannerImages1["MobRes-Grains1.jpg"]} >
 <Writings />
 <Icon/>
 <Icon1/>
   <Link to="/sell/Finishedproduct"><img src={bannerImages1["MobRes-Grains1.jpg"]} alt="FinishedProduct" /></Link>
 </div>

 <div className="slide-image"key= {bannerImages1["FertilizerTry.jpg"]}>
 <Writings />
 <Icon/>
 <Icon1/>
   <Link to="/sell/Fertilizers"><img src={bannerImages1["FertilizerTry.jpg"]} alt="Fertilizer"/></Link>
 </div>
 
 <div className="slide-image"key= {bannerImages1["MobileRes-Wheat.jpg"]}>
 <Writings />
 <Icon/>
 <Icon1/>
   <Link to="/sell/Rawproduct"><img src={bannerImages1["MobileRes-Wheat.jpg"]} alt="wheat"/></Link>
 </div>

 <div className="slide-image" key={bannerImages['Tractor-5.jpg']}>
 <Writings />
 <Icon/>
 <Icon1/>
<Link to="/sell/Machine"><img src={bannerImages1["Tractor-5.jpg"]} alt="Tractor" /></Link>
 </div>


</div>
</div>




<div className="categoryHead">
<h1>Top Category</h1>
</div>

<div className="Category-image">


<div className="Agri Machine">
<Link to='/sell/Machine' className="linked">
  <img src={categoryImages[agriMachineImage]} alt='Agri-Machine'/>
  <h3>Agricultural Machine</h3>
  </Link>
</div>



<div className="Agri Cows">
<Link to='/sell/Livestock' className="linked">
<img src={categoryImages[cattleImage]} alt='Cattels'/>
<h3>Livestock</h3>
</Link>
</div>



<div className="Agri Fertilizer">
<Link to='/sell/Fertilizers' className="linked">
<img src={categoryImages[fertilizerImage]} alt='Fertilizer'/>
<h3>Organic Fertilizers</h3>
</Link>
</div>



<div className="Agri Product">
<Link to='/sell/Finishedproduct' className="linked">
<img src={categoryImages[FinshedProductImage]} alt='FinishedProduct'/>
<h3>Agricultural Products</h3>
</Link>
</div>



<div className="Agri rawProduct">
<Link to='/sell/Rawproduct' className='linked'>
<img src={categoryImages[RawProductImage]} alt='RowProduct'/>
<h3>Agricultural Rawproducts</h3>
</Link>
</div>



<div className="Agri Tools">
<Link to='/sell/Tools' className="linked">
<img src={categoryImages[ToolsImage]} alt='Tools'/>
<h3>Agricultural Equipments</h3>
</Link>
</div>
</div>


<div className='Namalvar'>

<h1>Let Us Know</h1>


<div className='border'>
<img src={NamalvarFormal} alt='Scientist' className='scientist-pic' />



<h3 className='Quotes'>"The soil is not a commodity, it’s our responsibility."</h3>

<span className='namalvarPara'><strong>G. Nammazhvar (6 April 1938 – 30 December 2013)</strong> was a renowned Indian agricultural scientist and environmental
 activist. Born in Ilangadu, Tanjore, he dedicated his life to promoting organic farming and sustainable agriculture.
  A graduate of Annamalai University, he worked tirelessly to move farmers away from chemical fertilizers and towards 
  eco-friendly practices. He was a prominent leader in organic farming in Tamil Nadu and contributed to several NGOs like
   Vanaham and Kudumbam. His legacy continues to inspire modern-day organic movements.</span>

</div>
</div>

<h1 className='PoetHeading'>The Greatness of Farming!</h1>

<div className='Thiruvalluvar'>
<h4 >உழுவ துண்டு வாழ்வாரே வாழ்வார் மற்றெல்லாம்<br/>
தொழுவதாற் பேரும் அளறு.</h4>
<h4>Farmers alone truly live; all others live by depending on them</h4>
<h4 className='poet1'>Thiruvalluvar – The Universal Poet of Ethics</h4>
</div>

<div className='Bharathiyar'>
  <h4>ஒரு பொழுதுக்கு உணவில்லை என்றால் இந்த ஜகத்தினை அழித்திடுவோம்!</h4>
  <h4>If even one person has no food to eat for a single meal, we shall destroy this entire world!</h4>
  <h4 className='poet2'>Mahakavi Bharathiyar – The Poet of Freedom</h4>
</div>

<h1 className='FactOfFarmers'>The Forgotten Farmers</h1>
<div className='Formers'>
  <strong className='AboutFarmers'>The people who sell tractors are rich. Those who sell fertilizer are rich. 
  The people who sell agricultural equipment are rich, and even those who sell seeds are rich. 
  Yet the farmers who actually practice agriculture remain poor...? and they are dying. Over 112,000 farmers have died 
  by suicide in the past ten years. Let’s make a change and protect our farmers. We need your ideas—connect with us to make a difference.</strong>

<div className='ContactButton'>
  <Button
  className='ContactButt1'
  component="a"
  href="https://mail.google.com/mail/?view=cm&fs=1&to=sanjaymuthulakshmi@gmail.com&su=Having%20an%20Idea&body=Hi,%20I%20have%20an%20Idea%20to%20discuss%20with%20you!"
  target="_blank"
  sx={{borderRadius:"50px",backgroundColor:"#0f172a"}}
size='small'
  startIcon={<WorkIcon />}
  variant="contained"
  color="primary"
>
  Contact Me
</Button>
</div>
</div>

<h1 className='MeetCreator'>Meet the Creator</h1>
<div className='Creator'>


<img src={Portfolio}
alt = 'Developer'
className='Developer-pic'
/>

<span className='Job-asking'><strong>Hi, I’m Sanjay Thanigaivelu, the creator of Agrivibes.</strong> With a passion
 for sustainable agriculture and a degree in Information Technology,
 I started this platform to empower farmers with the tools and knowledge they need to thrive. 
 If my skills and vision resonate with your organization, feel free to reach out."</span>

<div className='button'>
<ThemeProvider theme={theme2}>
<Button  variant='contained' color='primary' size='small'className='AboutMe' startIcon={<AccountCircleIcon/>} onClick={()=>window.open("https://myfirstportfolioweb.netlify.app/")}>About Me</Button>
<Button
  component="a"
  size='small'
  href="https://mail.google.com/mail/?view=cm&fs=1&to=sanjaymuthulakshmi@gmail.com&su=Hiring%20Inquiry&body=Hi,%20I%20am%20interested%20in%20discussing%20an%20opportunity%20with%20you!"
  target="_blank"
  startIcon={<ContactMailIcon />}
  variant="contained"
  color="primary"
  className='HireMe'
>
  Hire Me
</Button>

</ThemeProvider>
</div>

</div>

        <div className="Footer">
          <table className="Footer inside">
          <tbody>
          <tr>
            <td className="foot logo">
            <Link to ="/" className="footLink"><img className="logo"  src={restImages['SmallOnly.png']} alt="AgriVibes Logo" /></Link>
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
          <td className="foot follow">Follow Us<br/><Link to='https://www.instagram.com/sanjay_thanigaivelu/' className="footLink insta"><FontAwesomeIcon icon={faInstagram} /></Link>  <Link to='https://linkedin.com/in/sanjay-thanigaive07' className="footLink linkdin"><FontAwesomeIcon icon={faLinkedin} />  </Link><Link to='https://github.com/SanjayThanigaivelu' className="footLink git"><FontAwesomeIcon icon={faGithub}/></Link></td>
          <td className="foot Copyright">&#169;2024 AgriVibes. All rights are reserved</td>
          </tr>
          </tbody>
          </table>
        </div>

<div className='Footer1'>
  
 <div className='logo1'>
 <Link to ="/" className="footLink1"><img className="logoimg"  src={restImages['SmallOnly.png']} alt="AgriVibes Logo" /></Link>
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
