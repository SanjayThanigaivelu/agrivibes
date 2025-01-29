import React,{useState,useContext,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { useForm, Controller} from 'react-hook-form';

import style from '../UserProfile/profile.module.css'
import axios from 'axios';
import EventIcon from '@mui/icons-material/Event';
import MailIcon from '@mui/icons-material/Mail';

import   '../LandingPage/AgriVibes.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram ,faLinkedin,faGithub} from '@fortawesome/free-brands-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {Grid, Card, CardContent, CardMedia,createTheme, Box, Menu, MenuItem,InputAdornment , Button,ThemeProvider,IconButton,CircularProgress,Modal,Typography} from "@mui/material"
import {Visibility, VisibilityOff } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import KeyIcon from '@mui/icons-material/Key';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // Import warning icon

import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import Skeleton from '@mui/material/Skeleton';

import logo from '../assets/AgriVibesFinal.jpg'

import FavoriteIcon from '@mui/icons-material/Favorite';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Flag from 'react-world-flags';
import { LoadScript } from '@react-google-maps/api';
import { Autocomplete, TextField } from "@mui/material";

import {LocationContext} from '../Context/LocationContext.jsx';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Noresult from '../assets/No-result.jpeg'
import { ToastContainer, toast } from 'react-toastify';

function Profile({ isAuthenticated, setIsAuthenticated }) {
 
  const[userData1,setUserData]=useState(null);
const[userProduct,setUserProduct]=useState();
const [loading, setLoading] = useState(true); // Add a loading state
const [error, setError] = useState(null); // Add an error state
const [anchorEl, setAnchorEl] = useState(null);


const [anchorEl1, setAnchorEl1] = useState(null);
const [language, setLanguage] = useState('');
const [isOpen, setIsOpen] = useState(false);


const [options, setOptions] = useState([]);
const [isApiLoaded, setIsApiLoaded] = useState(false);

const [open1, setOpen1] = useState(false);
const [open2, setOpen2] = useState(false);
const [open3, setOpen3]=useState(false);
  const [showPass,setShowPassword1]=useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //----------------------------------------------------------Password Visibility---------------------------------------------------
  const handleClickShowPass=()=>setShowPassword1(!showPass);
  const handleClickShowPassword = () => setShowPassword(!showPassword); // Toggle password visibility
  const handleMouseDownPassword = (event) => event.preventDefault(); // Prevent default behavior on mouse down



  
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

//--------------------------------------------------------------------------------THEME 1----------------------------------------------------------------------------------------------------------
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
                 width:"250px",
                 height:"50px",
                },
            },
        },
    },
  });

//---------------------------------------------------------------------THEME 2---------------------------------------------------------------------------------------------------------------------
  const theme2 = createTheme({
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
                  height:"40px"
                },
            },
        },
    },
  });
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            
  // Open menu on click
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);



const handleClick1 = (event) => {
  setAnchorEl1(event.currentTarget);
  setIsOpen((prevState) => !prevState);
};

const handleClose1 = (lang) => {
  setLanguage(lang);
  setAnchorEl1(null);
  setIsOpen(false)
};
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function Logout(navigate) {
  
try {
  const response = await axios.post("http://localhost:5000/login/logout", {}, { withCredentials: true });
  setIsAuthenticated(false);
  console.log("Logout response:", response.data);
  console.log("IsAuthenticated set to:", false);
  if (navigate) 
    navigate("/");

} catch (error) {
  console.error("Logout failed:", error);
}
}

async function Logout1(navigate) {
  
  try {
    const response = await axios.post("http://localhost:5000/login/logout", {}, { withCredentials: true });
    setIsAuthenticated(false);
    console.log("Logout response:", response.data);
    console.log("IsAuthenticated set to:", false);
    if (navigate) 
      navigate("/register");
  
  } catch (error) {
    console.error("Logout failed:", error);
  }
  }


//----------------------------------------------LOCATION CONTAINER----------------------------------------------------------------
const libraries = ["places"];


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
//------------------------------------------------------SEARCH CONTAINER--------------------------------------------------------
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
//-----------------------------------------------USER DATA API CALLING---------------------------------------------------------------------------------
  
useEffect(()=>{
BasicUserData();
ProductData();
    },[])

    async function BasicUserData() {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Reset any previous error
      try {
        const response = await axios.get("http://localhost:5000/profile/userData", {
          withCredentials: true,
        });
        console.log("Response Data:", response.data);
    
        if (response.data.result?.length > 0) {
          setUserData(response.data.result[0]); // Set user data
        } else {
          setUserData(null); // Handle empty array case
        }
      } catch (error) {
        if (error.response) {
          console.error("Error:", error.response.data.error);
          setError(error.response.data.error); // Set error message
        } else {
          console.error("Network or server error:", error.message);
          setError("Network or server error");
        }
      } finally {
        setLoading(false); // Loading is done
      }
    }
//---------------------------------------------PRODUCT API--------------------------------------------------------------------------------------------------------



function ProductData(){
    axios.get("http://localhost:5000/profile/SellingUserData",{ withCredentials: true })
    .then((response)=>{
        setUserProduct(response.data.user)
    }).catch((error)=>{
        if (error.response) {
            console.error("Error:", error.response.data.error);
          } else {
            console.error("Network or server error:", error.message);
          }
    })
 }
//--------------------------------------------------------EDIT PROFILE SECTION----------------------------------------------------------------------------------

const schema = yup.object().shape({
    NewName: yup
        .string()
        .matches(/^[a-zA-Z\s]{3,25}$/, 'Enter a valid name (3-25 characters, letters and spaces only)')
        .required('Full Name is required'),
        NewPhoneNumber: yup
            .string()
            .matches(/^\d{10}$/, 'Phone number must be 10 digits')
            .required('Phone number is required'),
            NewEmail: yup
                .string()
                .email('Enter a valid email')
                .matches(/^[a-z\d.-]+@[a-z\d.-]+\.[a-z]{2,}$/, 'Please enter a valid Gmail address')
                .required('Email is required'),

})

 const { handleSubmit, control, formState: { errors },getValues,reset:resetForm } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
    NewName: '', 
    NewPhoneNumber: '',
    NewEmail: ''
   },
  mode: 'onChange' 
  });
//--------------------------------------------------------------BOX MODEL 1 OPEN & CLOSE------------------------------------------------------------------------------------------------------
function editProfile(){
setOpen1(true);
 }

 const editProfileClose = () => {
    setOpen1(false);
    resetForm({
NewName:'',
NewPhoneNumber:'',
NewEmail:''
    })
  };

//---------------------------------------------------------------BOX MODEL 1 ON SUBMIT HANDLER------------------------------------------------------------------------------------------------ 
 const[DataInfo,setDataInfo]=useState();

const onSubmit = (data) => {
    console.log('Submitted Data:', data);
setDataInfo(data);
    editProfileClose(); // Close modal after submission
    openProfile1();
  };
//------------------------------------------------------------BOX MODEL 2--------------------------------------------------------------------------------------------------------

const schema1 = yup.object().shape({

OTP: yup
    .string()
    .trim() // Trims leading/trailing spaces
    .matches(/^\d{5}$/, 'OTP must be 5 digits')
    .required('OTP is required'),

})

const { handleSubmit:handleSubmit1, control:control1, formState: { errors:errors1 },getValues1,reset:resetForm1 } = useForm({
  resolver: yupResolver(schema1),
  defaultValues: {
 OTP:""
 },
mode: 'onSubmit' 
});



function openProfile1(){
  setOpen2(true);
}

function closeProfile2() {
  console.log("reached closing funcion of box model 2")
  setOpen2(false); // Close modal
}
//----------------------------------------------------------------------BOX MODEL 3-----------------------------------------------------------------------------------------------------------------
function OpenDeleteBox(){
  setOpen3(true)
}

function closeDeleteBox(){
  setOpen3(false);
}
//------------------------------------------------------------------SCHEMA 2 START-----------------------------------------------
const schema2 = yup.object().shape({
EmailDelete: yup
.string()
.email('Enter a valid email')
.matches(/^[a-z\d.-]+@[a-z\d.-]+\.[a-z]{2,}$/, 'Please enter a valid Gmail address')
.required('Email is required'),
 Password: yup
    .string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
      'Password: 8-25 chars, with uppercase, lowercase, number, and special character like(@,$,&,!,%,*)')
    .required('Password is required'),
  RePassword: yup
    .string()
    .oneOf([yup.ref('Password'), null], 'Passwords must match')
    .required('Confirm password is required'),
})

const { handleSubmit:handleSubmit2, control:control2, formState: { errors:errors2 },getValues2,reset:resetForm2 } = useForm({
  resolver: yupResolver(schema2),
  defaultValues: {
 EmailDelete:"",
 Password:"",
 RePassword:""
 },
mode: 'onSubmit' 
});

//----------------------------------------------------------------------TIMER FUNCTION---------------------------------------------------------------------------------------------------------------
const [timeRemaining, setTimeRemaining] = useState(0);
const [timerActive, setTimerActive] = useState(false);

const startTimer = () => {
  setTimeRemaining(5 * 60); // 5 minutes in seconds
  setTimerActive(true);
};

const stopTimer = () => {
  setTimerActive(false);
  setTimeRemaining(0);
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};



  useEffect(() => {
    let timerInterval;
    if (timerActive && timeRemaining > 0) {
      timerInterval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      clearInterval(timerInterval);
      // Optionally, you can disable the OTP field or change button states when the OTP expires
    }
    return () => clearInterval(timerInterval);
  }, [timerActive, timeRemaining]);
//-----------------------------------------------------------------OTP GENERATOR--------------------------------------------------------------------------------

 const [OTPID,setOtpID]=useState();
  const [otpLoading, setOtp]=useState(false);
const [otpbutt,OtpSendButton]=useState(false);

function GenerateOTP(){

const email=DataInfo.NewEmail
    axios.post('http://localhost:5000/send-email', {
      to: email, 
      subject: 'AgriVibes OTP Authentication',
      text: `The OTP will be sent shortly. Please check your inbox`,
      //phoneNo:phone
  })
  .then(response => {
      toast('Email sent successfully');
      setOtp(false);
      startTimer();
      OtpSendButton(true);
      setOtpID(response.data.emailOTP);
  })
  .catch(error => {
      console.error('Error sending email:', error);
      toast('Failed to send email. Please try again.');
      setOtp(false);
      OtpSendButton(false);
      
  });
}
//------------------------------------------------------------------OTP VALIDATOR-------------------------------------------------------------------------------------------------------------------

function otpSumbmit(data1){
  const email1=data1.OTP;

  axios.post('http://localhost:5000/validation',{
    EmailOTP: email1,
  })
    .then(response => {
      if(response.data.message){
      stopTimer();
  resetForm1({
OTP:''
  })
  closeProfile2()

OtpSendButton(false);
    console.log(response.data); 
    storing();    
}
}) .catch(error => {
  const errorMessage = error.response?.data?.error || "Failed to login. Try again...";
  toast(errorMessage)
  OtpSendButton(false);
  stopTimer();
  closeProfile2();
  resetForm1({
   OTP: "",
  });
});
}
//-------------------------------------------------------------------STORING----------------------------------------------------------------------------------------------------------
  async function storing(){
  console.log("Reached Storing Function...");
  try {
    const response = await axios.post("http://localhost:5000/profile/updateUser", {
      userInfoUpdate: DataInfo,
    }, {
      withCredentials: true
    });
    
    if (response.status === 200) {
      toast(response.data.message);
 
      try {
        const deleteResponse = await axios.post('http://localhost:5000/deleteOtp', { Id: OTPID });
        if (deleteResponse.status === 200) {
          Logout(navigate);
        }
      } catch (deleteError) {
          console.error("Unexpected error while deleting OTP:", deleteError);
      }
    }
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.error);
      toast(error.response.data.error);
    } else {
      console.error("Unexpected Error:", error);
    }
  }

}
//-------------------------------------------------------------------DELETE PROFILE---------------------------------------------------------------------------------------------------------------------

function DeleteProfile(data){
  console.log("Reached Delete Function buddy...")
  console.log(data);
axios.post('http://localhost:5000/profile/UserDelete',{
  DeleteUser:data
}).then((response)=>{
  if(response.data.message){
    toast(response.data.message);
    resetForm2({
      EmailDelete:'',
      Password:'',
      RePassword:''
    })
    closeDeleteBox();
    Logout1(navigate);
  }
}).catch(Error=>{
  const Errormessage=Error.response.data.error || "Can 't able to delete the User";
  console.log(Errormessage);
toast(Errormessage);
resetForm2({
  EmailDelete:'',
  Password:'',
  RePassword:''
})
closeDeleteBox();
})
}
//------------------------------------------------------------------DELETE ITEM--------------------------------------------------------------------------------------------------------------------------
function deleteItem(itemID){


axios.post('http://localhost:5000/profile/ProductDelete',{
  ProductId:itemID
}).then((response)=>{
  if(response.data.message){
    toast(response.data.message);
  }
}).catch(error=>{
  const Errormessage=error.response.data.error || "can 't able to delete the product"
  console.log(Errormessage);
})
}


//-------------------------------------------------------------------LOGIC FUNCTION---------------------------------------------------------------------------------------------------------
 const formattedDate = userData1?.createdDate
 ? new Date(userData1.createdDate).toLocaleString('en-US', {
     month: 'long', // Displays the full month name
     year: 'numeric', // Displays the year
   })
 : "N/A";

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
        <Box  
     className='AccountBox'>
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

  
          <td><Link to="/buy" className="sell-button" onClick={handleNavigate}><i className="fas fa-plus"></i>BUY...</Link></td>
      </tr>
      </thead>
  </table>
      </div>

      <div className={style.profileFullLogic}>
      {loading ? (
  <div className={style.skeletonContainer}>
    <Skeleton variant="text" width={150} height={30} /> {/* For name */}
    <Skeleton variant="text" width={200} height={20} /> {/* For email */}
    <Skeleton variant="rectangular" width={300} height={50} /> {/* For button */}
  </div>
) : error ? (
  <p>Error: {error}</p>
) : userData1 ? (
  <div className={style.UserDataContainer1}>
    <h3>{userData1.FullName}</h3>
    <h4>{userData1.Email}</h4>
    <p>
      <EventIcon style={{ marginRight: "8px", verticalAlign: "middle" }} />
      Member since {formattedDate}
    </p>
    <h4>User verified with</h4>
    <MailIcon fontSize="small" style={{ color: 'black' }} className={style.mailIcon} />
    <br /><br />
    <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
    <ThemeProvider theme={theme1}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={editProfile} 
        startIcon={<EditIcon />}
      >
        Edit Profile
      </Button>
    </ThemeProvider>

    <ThemeProvider theme={theme1}>
<Button 
variant='contained'
color="error"
onClick={OpenDeleteBox}
startIcon={<ReportProblemIcon/>}
>
  Delete Profile
</Button>
    </ThemeProvider>
    </div>

  </div>
) : (
  <div className={style.noResult}>
    <p>No user data available.</p>
  </div>
)}

<div className={style.ProductData} style={{ padding: "16px" }}>
  {loading ? (
    <Skeleton variant="rectangular" width="100%" height={200} />
  ) : error ? (
    <p>Error: {error}</p>
  ) : userProduct && userProduct.length > 0 ? (
    <Grid container spacing={3}>
      {userProduct.map((item) => {
        // Dynamically determine the name field
        const name =
          item.BrandName ||
          item.EquipmentName ||
          item.MachineName ||
          item.NameOfProduct ||
          item.FertilizerName ||
          item.CattleType ||
          item.BreadName ||
          "Unnamed Product";

        // Sanitize image paths
        const sanitizedImages =
          item.Images &&
          item.Images.map((img) =>
            img
              .replace(/\/images\/+/g, "/images/") // Replace multiple /images/ with a single one
              .replace(/\/images\/images/, "/images") // Handle redundant nesting
          );

        // Use the sanitized image URL or fallback to a default image
        const imageUrl =
          sanitizedImages && sanitizedImages.length > 0
            ? `http://localhost:5000/sell${sanitizedImages[0]}`
            : "/default-image.jpg";

        return (
          <Grid item xs={12} sm={6} md={3} key={item._id}>
            <Card>
              <CardMedia
                component="img"
                height="250"
                image={imageUrl} // Use sanitized URL
                alt={name}
                onError={(e) => {
                  // Fallback to default image if there's an error
                  e.target.src = "/default-image.jpg";
                }}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ₹{item.setPrice || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {item.email || "No Email Provided"}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  style={{ marginTop: "8px" }}
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  ) :(
        <div className= {style.Noresult}>
        <img src={Noresult} alt='No-Result' className='NoResultImage'/>
        <h2>No Products Found</h2>
        <h4>Post Ad to see in Your Profile.</h4>
        </div>
      )}
    </div>
  
         {/* Modal */}
      <Modal open={open1} onClose={editProfileClose} BackdropProps={{
          onClick: (e) => e.stopPropagation() // Override the default close behavior for clicks on the backdrop
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2"  sx={{ 
    display: 'flex', 
    justifyContent: 'center',  // Center horizontally
    alignItems: 'center',      // Center vertically (if needed)
    textAlign: 'center',       // Center the text itself
    mt: 2                      // Optional: Top margin
  }}>
            Edit Profile
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* New Name Field */}
            <Controller
              name="NewName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="New Name"
                  error={Boolean(errors.NewName)}
                  helperText={errors.NewName?.message}
                   variant="standard"
                   sx={{ width: '40ch', height: '80px', "& .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
    color: errors.NewName ?'#FF0000':'#66bb6a',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: errors.NewName ?'#FF0000':'#66bb6a',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#66bb6a',
    },
    '&:hover fieldset': {
      borderColor: '#66bb6a',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#66bb6a',
    },
  },}}
                />
              )}
            />

 {/* New Phone Number Field */}
 <Controller
              name="NewPhoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="New Phone Number"
                  error={Boolean(errors.NewPhoneNumber)}
                  helperText={errors.NewPhoneNumber?.message}
                  variant="standard"
                   sx={{ width: '40ch', height: '80px', "& .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
    color: errors.NewPhoneNumber ?'#FF0000':'#66bb6a',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: errors.NewPhoneNumber ?'#FF0000':'#66bb6a',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#66bb6a',
    },
    '&:hover fieldset': {
      borderColor: '#66bb6a',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#66bb6a',
    },
  },}}
                />
              )}
            />


            {/* New Email Field */}
            <Controller
              name="NewEmail"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="New Email"
                  error={Boolean(errors.NewEmail)}
                  helperText={errors.NewEmail?.message}
                  variant='standard'
                  sx={{ width: '40ch', height: '80px', "& .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
    color: errors.NewEmail ?'#FF0000':'#66bb6a',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: errors.NewEmail ?'#FF0000':'#66bb6a',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#66bb6a',
    },
    '&:hover fieldset': {
      borderColor: '#66bb6a',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#66bb6a',
    },
  },}}
                />
              )}
            />

           
            {/* Save Button */}
            <ThemeProvider theme={theme2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<SaveIcon />}
            >
              Save Edit
            </Button>
            </ThemeProvider>
          </form>
        </Box>
      </Modal>
    
<div>

      <Modal open={open2} onClose={closeProfile2} BackdropProps={{
          onClick: (e) => e.stopPropagation() // Override the default close behavior for clicks on the backdrop
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ 
    mb: 2, 
    textAlign: 'center', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
            OTP Verification
          </Typography>
          <form onSubmit={handleSubmit1(otpSumbmit)}>
            {/* New Name Field */}

              <Controller
              name="OTP"
              control={control1}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Enter OTP"
                  error={Boolean(errors1.OTP)}
                  helperText={errors1.OTP?.message}
                  variant="standard"
                   sx={{ width: '40ch', height: '80px', "& .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
    color: errors1.OTP ?'#FF0000':'#66bb6a',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: errors1.OTP ?'#FF0000':'#66bb6a',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#66bb6a',
    },
    '&:hover fieldset': {
      borderColor: '#66bb6a',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#66bb6a',
    },
  },}}
                />
              )}
            />
 {timerActive && (
              <Typography variant="body2" sx={{
      display: 'flex',
      justifyContent: 'center', // Center horizontally
      alignItems: 'center',    // Center vertically
      mt: 2,                   // Optional: Add margin-top for spacing
    color: 'red',
    }}>
                Time Remaining: {formatTime(timeRemaining)}
              </Typography>
            )}

 {/* Save Button */}
<ThemeProvider theme={theme2}>
  <Box 
    sx={{ 
      display: 'flex',       // Use flexbox
      justifyContent: 'space-between', // Add spacing between buttons
      gap: '16px',           // Space between buttons (adjust as needed)
      mt: 2                  // Optional: Add margin-top for spacing from other elements
    }}
  >
     {otpLoading ? (<CircularProgress/>): (<Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={GenerateOTP}
      disabled={otpbutt}
      startIcon={<KeyIcon />}
    >
      Generate OTP
    </Button>)}

    <Button
      type="submit"
      variant="contained"
      color="primary"
      fullWidth
      startIcon={<FingerprintOutlinedIcon/>}
    >
      Confirm OTP
    </Button>
  </Box>
</ThemeProvider>
</form>
</Box>
</Modal>
</div>







<div>
<Modal open={open3} onClose={closeDeleteBox} BackdropProps={{
          onClick: (e) => e.stopPropagation() // Override the default close behavior for clicks on the backdrop
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ 
    mb: 2, 
    textAlign: 'center', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
           DELETE PROFILE 

          </Typography>
          <form onSubmit={handleSubmit2(DeleteProfile)}>
            {/* New Name Field */}

              <Controller
                      name="EmailDelete"
                      control={control2}
                      render={({ field }) => (
                        <TextField
                          {...field} 
                          error={!!errors2.EmailDelete}
                          helperText={errors2.EmailDelete?.message}
                          label="Email"
                          variant="standard"
                          
                          sx={{ width: '40ch', height: '80px', "& .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
                color: errors2.EmailDelete ?'#FF0000':'#66bb6a',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: errors2.EmailDelete ?'#FF0000':'#66bb6a',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#66bb6a',
                },
                '&:hover fieldset': {
                  borderColor: '#66bb6a',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#66bb6a',
                },
              },}}
                        />
                      )}  
                    />

<Controller
          name="Password"
          control={control2}
          render={({ field }) => (
            <TextField
              {...field} 
              error={!!errors2.Password}
              helperText={errors2.Password?.message}
              label="Password"
              type={showPass ? 'text' : 'password'}
              variant="standard"
              sx={{ width: '40ch', height: '80px', "& .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
    color: errors2.Password?'#FF0000':'#66bb6a',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: errors2.Password ?'#FF0000':'#66bb6a',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#66bb6a',
    },
    '&:hover fieldset': {
      borderColor: '#66bb6a',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#66bb6a',
    },
  } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPass}
                      onMouseDown={handleMouseDownPassword}
                      
                    >
                      {showPass? <VisibilityOff sx={{ fontSize: '15px' }} /> : <Visibility sx={{ fontSize: '15px' }}/>}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

          {/* Confirm Password Field */}
          <Controller
          name="RePassword"
          control={control2}
          render={({ field }) => (
            <TextField
              {...field} 
              error={!!errors2.RePassword}
              helperText={errors2.RePassword?.message}
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'} // Toggle the type based on visibility state
              variant="standard"
              sx={{ width: '40ch', height: '80px', "& .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
    color: errors2.RePassword?'#FF0000':'#66bb6a',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: errors2.RePassword ?'#FF0000':'#66bb6a',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#66bb6a',
    },
    '&:hover fieldset': {
      borderColor: '#66bb6a',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#66bb6a',
    },
  }}}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                     
                    >
                      {showPassword ? <VisibilityOff sx={{ fontSize: '15px'}} /> : <Visibility sx={{ fontSize: '15px'}} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

<Typography 
  variant="body2" 
  sx={{
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center',    // Center vertically
    mt: 2,                   // Add margin-top for spacing
    color: 'red',
  }}
>
  <WarningAmberIcon sx={{ fontSize: '20px', mr: 1,mb:1 }} /> {/* Warning icon with spacing */}
  Profile deletion is permanent. Data is unrecoverable.
</Typography>
           


        <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginTop: '16px' // Add margin if needed for spacing
    }}
  >
<ThemeProvider theme={theme2}>
<Button 
variant='contained'
color="error"
type='submit'
startIcon={<ReportProblemIcon/>}
>
  Delete Profile
</Button>
</ThemeProvider>
</Box>
                    </form>
                    </Box>
                    </Modal>
</div>
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

export default Profile