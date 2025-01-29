import React, { useEffect, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom';
import {TextField,Box,Button, InputAdornment,IconButton, Modal, Typography,CircularProgress} from '@mui/material';
import { createTheme , ThemeProvider} from '@mui/material/styles';
import styles from './loginstyle.module.css';
import * as yup from 'yup';
import bgremoveAgriVibes1 from '../assets/bgremoveAgriVibes1.png'
import { useForm,Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {Visibility, VisibilityOff } from '@mui/icons-material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
const[PasswordShow,setPassVisibility]=useState(false);
const[PasswordShow1,setPassVisibility1]=useState(false);
const[PasswordShow2,setPassVisibility2]=useState(false);
const[forgetBoxOpen,setForgetBox]=useState(false);
const[forgetBoxOpen1,setForgetBox1]=useState(false);
const[disableEmail,setDisableEmail]=useState(false);
const[disableOTP,setDisableOTP]=useState(true);
const [timeRemaining, setTimeRemaining] = useState(0);
const [timerActive, setTimerActive] = useState(false);
const[CircularProgress1,setCircularProgress]=useState(false);
const[CircularProgress2,setCircularProgress2]=useState(false);
const[CircularProgress3,setCirularProgress3]=useState(false);
const[OTPData,setOTPData]=useState();
const[getEmail,setEmail]=useState();


const schema=yup.object().shape({
  Email:yup
  .string()
  .email('Enter a valid email')
  .matches(/^[a-z\d.-]+@[a-z\d.-]+\.[a-z]{2,}$/, 'Please enter a valid Gmail address')
.required('Email is required'),
Password:yup
.string()
.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,'Password: 8-25 chars, with uppercase, lowercase, number, and special character like(@,$,&,!,%,*)')
.required('Password is required')
})
//-------------------------------------OTP BOXE-1-------------------------------------------------------------
const forgetSchema=yup.object().shape({
  EMAIL:yup
  .string()
  .email('Enter a valid email')
  .matches(/^[a-z\d.-]+@[a-z\d.-]+\.[a-z]{2,}$/, 'Please enter a valid Gmail address')
.required('Email is required'),
})
//------------------------------------OTP BOX-1-----------------------------------------------------------
const forgetSchema1=yup.object().shape({
  emailOTP:yup
  .string()
  .matches(/^\d{5}$/, 'Email OTP must be a 5-digit number')
  .required('Email OTP is required'),
})
//--------------------------------------OTP BOX-2-----------------------------
const PasswordSchema=yup.object().shape({
  Password1:yup
.string()
.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,'Password: 8-25 chars, with uppercase, lowercase, number, and special character like(@,$,&,!,%,*)')
.required('Password is required'),

RePassword: yup
    .string()
    .oneOf([yup.ref('Password1'), null], 'Passwords must match')
    .required('Confirm password is required'),
})
//------------------------------------------------------------------------------
const {handleSubmit,control,formState:{errors},reset}=useForm({
  resolver:yupResolver(schema),
  defaultValues:{
    Email:'',
    Password:'',
  },
  mode:'onChange'
});
//------------------------------------------------------------------------------------
const { handleSubmit: handleForgetSubmit,control: forgetControl,formState: { errors: forgetErrors }, reset: resetForget } = useForm({
  resolver: yupResolver(forgetSchema),
  defaultValues:{
    EMAIL: '',
  },
  mode: 'onChange',
});

const {handleSubmit:handleForgetSubmit1,control:forgetControl1,formState:{errors:forgetErrors1},reset:resetForget1}=useForm({
  resolver:yupResolver(forgetSchema1),
  defaultValues :{
    emailOTP:'',
  },
  mode:'onChange',
});

//-----------------------------------------------------------------------------------------
const {handleSubmit:Passwordsub,control:PassControl,formState:{errors:PassErrors},reset:PassReset}=useForm({
  resolver:yupResolver(PasswordSchema),
  defaultValues:{
    Password1:'',
    RePassword:''
  },
  mode:'onSubmit',
})

 const theme = createTheme({
  palette: {
    primary: {
      main: '#66bb6a',  
    },
    secondary: {
      main: '#81c784',
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
               
              },
          },
      },
  },
});
const startTimer=()=>{
  setTimeRemaining(5*60);
  setTimerActive(true);
};
const stopTimer=()=>{
  setTimerActive(false);
  setTimeRemaining(0);
}
const formatTime=(time)=>{
  const minute=Math.floor(time/60);
  const second=time%60;
  return `${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}`;
};

useEffect(()=>{
  let timerInterval;
  if(timerActive && timeRemaining>0){
    timerInterval=setInterval(()=>{
      setTimeRemaining((prevTime)=>prevTime-1);
    },1000);
  }
  else if(timeRemaining===0){
    clearInterval(timerInterval);
  }
  return ()=> clearInterval(timerInterval);
},[timerActive,timeRemaining]);


//----------------------------------------------------------------------------------------------------------------------------
function submitNow(formData) {
  try {
    axios.post("http://localhost:5000/login/loginUser", {
      Email: formData.Email,
      Password: formData.Password
    },{
      withCredentials: true, // Ensure cookies are sent
    })
    .then((response) => {
      console.log("API Response:", response);

      if (response.data.exists) {
        // Success case
        toast(response.data.message || "You have been Successfully Logged in...");
        reset({
          Email: "",
          Password: ""
        });
        setIsAuthenticated(true);
        console.log("Document Cookies:", document.cookie);
        navigate("/agri");
      }
    })
    .catch((error) => {
      // Handle backend error responses
      if (error.response) {
        const backendMessage = error.response.data.message;
        if (backendMessage) {
          toast(backendMessage); // Show the specific error message from the backend
          reset({
            Email: "",
            Password: ""
          });
        } else {
          toast("An error occurred. Please try again.");
        }
      } else {
        toast("Unable to connect to the server. Please try again later.");
      }
      console.error("API Error:", error);
      console.log("Document Cookies:", document.cookie);
    });
  } catch (error) {
    // Handle unexpected errors in the frontend
    toast("Unexpected Error occurred.");
    console.error("Unexpected Error:", error);
  }
}
//--------------------------------EMAIL CHECKER---------------------------------------------------------------
function emailChecker(Data) {
  setCircularProgress(true);
  setEmail(Data.EMAIL);
  try {
    axios
      .post("http://localhost:5000/login/emailChecking", {
        Email: Data.EMAIL,
        subject: "AgriVibes OTP For Password Reset", // Ensure "subject" is lowercase here, as expected by the backend
        text: "The OTP will be sent shortly. Please check your inbox",
      })
      .then((response) => {
        // Successful response handling
        if (response.status === 200) {
          toast("Email Verified and Reset OTP is sent to your Email");
          setCircularProgress(false);
          setDisableOTP(false);
          setDisableEmail(true);
          startTimer();
          setOTPData(response.data.emailOtp);
          setDisableEmail(true);
        }
      })
      .catch((serverError) => {
        // Specific server-side error handling
        if (serverError.response) {
          const status = serverError.response.status;
          const message = serverError.response.data.message;

          
          if (status === 400 && message && message.includes("Mail id was not found")) {
            
            toast("Email not found. Please register to continue.");
            setCircularProgress(false);
        resetForget({
          EMAIL:""
        })
        boxModelClose();
         
          } else if (status === 500) {
            toast("Failed to send OTP. Please try again later.");
            setCircularProgress(false);
        resetForget({
          EMAIL:""
        })
        boxModelClose();
          } else {
            toast(`Unexpected error: ${message || "Unknown error occurred."}`);
            setCircularProgress(false);
            resetForget({
              EMAIL:""
            })
            boxModelClose();
          }
        } else if (serverError.request) {
          toast("No response from the server. Please check your connection.");
          setCircularProgress(false);
        resetForget({
          EMAIL:""
        })
        boxModelClose();
        } else {
          toast(`Error: ${serverError.message || "An unknown error occurred."}`);
          setCircularProgress(false);
        resetForget({
          EMAIL:""
        })
        boxModelClose();
        }

      });
  } catch (error) {
    toast(`An error occurred: ${error.message}`);
    setCircularProgress(false);
    resetForget({
      EMAIL:""
    })
    boxModelClose();
  }
}
//--------------------------------------------VALIDATE OTP--------------------------------------------------------------------
function OtpChecker(OTPData){
setCircularProgress2(true);
  axios.post("http://localhost:5000/login/otpValidator",{
    EmailOTP:OTPData.emailOTP
  }).then((response)=>{
    if (response.status === 200){
      stopTimer();
      setCircularProgress2(false);
      toast("OTP Verfication is succesfull...");
      resetForget1({
        emailOTP:''
      })
      resetForget({
        EMAIL:''   
      })
      boxModel1();
      boxModelClose();
      DeleteOTP();
      setDisableEmail(false);
    }
  }).catch(error=>{
    setCircularProgress2(false);
    stopTimer();
    const errorMessage=error.response?.data?.error ||"Failed to Verify the OTP. Try again..."
  toast(errorMessage)
  resetForget1({
    emailOTP:''
  })
  resetForget({
    EMAIL:''   
  })
  boxModelClose();
  setDisableEmail(false);
  })
  }
//-----------------------------------------------DELETE OTP----------------------------------------------------------------------------------
  function DeleteOTP(){
    try{
      axios.post("http://localhost:5000/login/deleteOTP",{
         OTPs:OTPData
      }).then((response)=>{
if(response.status===200){
}
      }).catch(error=>{
        console.log(error+"cant able to delete the OTP Block...")
      })
    }
    catch (error) {
      // Handle unexpected errors in the frontend
      console.error("Unexpectedly Backend Error occured:", error);
    }
  }
//-----------------------------------------------PASSWORD CHANGING-------------------------------------------------------------------------------------------------------
function PasswordChanging(PassData){
 setCirularProgress3(true)
try{
  axios.post("http://localhost:5000/login/passwordChange",{
    Email:getEmail,
    NewPassword:PassData.Password1,
    RePassword:PassData.RePassword
  }).then((response)=>{
    if(response.status===200){
      setCirularProgress3(false);
      toast("Passwords updated successfully.Pleas proceed to login")
      PassReset({
        Password1:'',
        RePassword:''
      })
      boxModelClose1();
      
    }
  }).catch(error=>{
    setCirularProgress3(false);
    toast("Failed to update passwords. Try again later")
    PassReset({
      Password1:'',
      RePassword:''
    })
    boxModelClose1();
  })
}
catch (error) {
  // Handle unexpected errors in the frontend
  console.error("Unexpectedly Backend Error occured:", error);
} 
}



  const handleClickShowPass=()=>setPassVisibility(!PasswordShow);
  const handleClickShowPass1=()=>setPassVisibility1(!PasswordShow1);
  const handleClickShowPass2=()=>setPassVisibility2(!PasswordShow2);
  const handleMouseDownPassword=(event)=>event.preventDefault();
  const handleMouseDownPassword1=(event)=>event.preventDefault();
  const handleMouseDownPassword2=(event)=>event.preventDefault();
  
  const boxModel=()=>setForgetBox(true);
  const boxModelClose=()=>setForgetBox(false);
  const boxModel1=()=>setForgetBox1(true);
  const boxModelClose1=()=>setForgetBox1(false);
try{
return (
    <div className={styles.login}>
<div className={styles.background}>
        <img src={bgremoveAgriVibes1} alt="Large Logo" className={styles.large}/>
       
      </div>
 <Box
      component="form" onSubmit={handleSubmit(submitNow)} noValidate autoComplete='off'
      sx={{
        '& .MuiTextField-root': {m: 1}
      }}
    
    >

<div className={styles.content}>

    <img src={bgremoveAgriVibes1} alt='Logo' className={styles.logo2}></img>

  <Controller
  name="Email"
  control={control}
  render={({field})=>(
    <TextField 
    {...field}
    error={!!errors.Email} helperText={errors.Email?.message} label="Email"
     id="Email-id" 
variant="outlined" sx={{ width: '40ch',"& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.Email ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.Email ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
    },
    height: '50px',
    
    }} />
  )}
  />
 <br/><br/>
 <Controller 
 name="Password"
 control={control}
 render={({field})=>(
  
    <TextField
    {...field}  
    error={!!errors.Password}
    helperText={errors.Password?.message} 
    label="Password" 
    type={PasswordShow?'text':'password'}
    //autoComplete="new-password" // Disables browser's built-in password manager suggestions
     variant="outlined" sx={{ width: '40ch',"& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.Password ? 'red' : '#66bb6a',
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.Password ? 'red' : '#66bb6a', 
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
    },
    height: '80px',
    
    }}
InputProps={{
  endAdornment:(
    <InputAdornment position='end'>
    <IconButton
      aria-label="toggle password visibility"
    onClick={handleClickShowPass}
    onMouseDown={handleMouseDownPassword}
     >
     {PasswordShow? <VisibilityOff sx={{fontSize:'15px'}}/>:<Visibility sx={{fontSize:'15px'}}/>}
      </IconButton>
    </InputAdornment>
  ),
}}
 />
 )}
 />
    <br/><br/>
    <ThemeProvider theme={theme}> 
    <Button variant="text" size="medium" color="secondary" id='loginButton' type="button"  className={styles.ForgetPassword} onClick={boxModel} disableRipple sx={{ borderRadius: '35px' }}>Forget Password</Button>
    <Button variant="contained" size="medium" color="secondary" id={styles.loginButton} type="submit" sx={{ borderRadius: '35px' }} startIcon={<LockOpenIcon />} >Login</Button>
    </ThemeProvider>
<h4 className={styles.register}>Don&apos;t have an account? <Link to='/register' className={styles.reg}>Register!</Link></h4>
</div>
</Box>




<div className={`${styles.passwordTrouble} ${forgetBoxOpen ? 'blur-background':''}`}>
 <Modal open={forgetBoxOpen} onClose={boxModelClose} BackdropProps={{
  onClick:(e)=> e.stopPropagation()
 }}>
  <Box
  sx={{
    width: 400,
    height: "auto",
    margin: "auto",  
    backgroundColor: "white",
    padding: 3,
    borderRadius: 2,
    boxShadow: 24,
    textAlign: "center",
    position: "absolute", // Ensure it uses `absolute` for the modal positioning
    top: "50%", // Center vertically
    left: "50%", // Center horizontally
    transform: "translate(-50%, -50%)",
  }}
  onClick={(e)=>e.stopPropagation()}
  >
  <Typography variant='h6' sx={{mb:2}}>
    Forget Password
  </Typography>
  <Box component="form"
  id="emailForm"
   onSubmit={handleForgetSubmit(emailChecker)}
  sx={{
    display:'flex',
    flexDirection:'column',
    gap:1,
    alignItems:'stretch', 
    minHeight:100,
  }}
  >
    <Controller
    name="EMAIL"
    control={forgetControl}
    rules={{ required: "Email is required" }}
    render={({field})=>(
      <TextField 
      {...field}
      label="Email"
      disabled={disableEmail}
      error={!!forgetErrors.EMAIL}
      helperText={forgetErrors.EMAIL?.message||" "}
      fullWidth
      sx={{
    // Styling for the TextField wrapper
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: forgetErrors.EMAIL ? "red" : "#66bb6a", // Dynamic border color
      },
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: forgetErrors.EMAIL ? "red" : "#66bb6a", // Dynamic label color
    },
    "& .MuiFormHelperText-root": {
      minHeight: "20px", // Consistent helper text height
    },
      }}
      />
    )}
    /> 
  </Box>
  <Box component="form" onSubmit={handleForgetSubmit1(OtpChecker)}
  id="otpForm"
    sx={{
    display:'flex',
    flexDirection:'column',
    gap:1,
    alignItems:'stretch', 
    minHeight:100,
  }}
  >
    <Controller
    name='emailOTP'
    control={forgetControl1}
    rules={{ required: "OTP is required" }}
    render={({field})=>(
      <TextField
      {...field}
      label="Email OTP"
      error={!!forgetErrors1.emailOTP}
      disabled={disableOTP}
      helperText={forgetErrors1.emailOTP?.message||" "}
      fullWidth
      sx={{
    // Styling for the TextField wrapper
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: forgetErrors1.emailOTP ? "red" : "#66bb6a", // Dynamic border color
      },
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: forgetErrors1.emailOTP ? "red" : "#66bb6a", // Dynamic label color
    },
    "& .MuiFormHelperText-root": {
      minHeight: "20px", // Consistent helper text height
    },
      }}
      />
    )}
    />
    </Box>
  
    {timerActive && (
              <Typography variant="body2" sx={{ mt: 2, color: 'red' }}>
                Time Remaining: {formatTime(timeRemaining)}
              </Typography>
            )}
      {/* Buttons Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2,ml:2.5,mr:2.5,gap:1}}>
        <ThemeProvider theme={theme1}>
          {CircularProgress1 ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled={disableEmail}
              type="submit"
              form="emailForm" // Use `form` attribute to bind to the email form
              startIcon={<MarkEmailReadIcon />}
            >
              Confirm Email
            </Button>
          )}
        </ThemeProvider>
        <ThemeProvider theme={theme1}>
       {CircularProgress2 ?(<CircularProgress/>):(<Button
            variant="contained"
            color="primary"
            disabled={disableOTP}
            type="submit"
            form="otpForm" // Use `form` attribute to bind to the OTP form
            startIcon={<KeyIcon />}
          >
            Confirm OTP
          </Button>)}
        </ThemeProvider>
      </Box>
  </Box>
 </Modal>
  </div> 
  


<div className={`${styles.passwordTrouble1} ${forgetBoxOpen1 ? 'blur-background1':''}`}>
<Modal open={forgetBoxOpen1} onClose={boxModelClose1} BackdropProps={{
  onClick:(e)=> e.stopPropagation()
 }}>
<Box
  sx={{
    width: 400,
    height: "auto",
    margin: "auto",  
    backgroundColor: "white",
    padding: 3,
    borderRadius: 2,
    boxShadow: 24,
    textAlign: "center",
    position: "absolute", // Ensure it uses `absolute` for the modal positioning
    top: "50%", // Center vertically
    left: "50%", // Center horizontally
    transform: "translate(-50%, -50%)",
  }}
  onClick={(e)=>e.stopPropagation()}>
  <Typography variant='h6' sx={{mb:2}}>
    Forget Password
  </Typography>
  <Box component="form" onSubmit={Passwordsub(PasswordChanging)}
  sx={{
    display:'flex',
    flexDirection:'column',
    gap:4,
    alignItems:'stretch', 
    minHeight:200,
  }}
  >
  
  <Controller
    name="Password1"
    control={PassControl}
    render={({field})=>(
      <TextField 
      {...field}
      label="Enter New Password"
      error={!!PassErrors.Password1}
      helperText={PassErrors.Password1?.message||" "}
      type={PasswordShow1?'text':'password'}
      fullWidth
      sx={{
    // Styling for the TextField wrapper
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: PassErrors.Password1 ? "red" : "#66bb6a", // Dynamic border color
      },
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: PassErrors.Password1 ? "red" : "#66bb6a", // Dynamic label color
    },
    "& .MuiFormHelperText-root": {
      minHeight: "20px", // Consistent helper text height
    },
      }}
      InputProps={{
  endAdornment:(
    <InputAdornment position='end'>
    <IconButton
      aria-label="toggle password visibility"
    onClick={handleClickShowPass1}
    onMouseDown={handleMouseDownPassword1}
     >
     {PasswordShow1? <VisibilityOff sx={{fontSize:'15px'}}/>:<Visibility sx={{fontSize:'15px'}}/>}
      </IconButton>
    </InputAdornment>
  ),
}}
      />
    )}
    />

<Controller
    name="RePassword"
    control={PassControl}
    render={({field})=>(
      <TextField 
      {...field}
      label="Confirm New Password"
      error={!!PassErrors.RePassword}
      helperText={PassErrors.RePassword?.message||" "}
      type={PasswordShow2?'text':'password'}
      fullWidth
      sx={{
    // Styling for the TextField wrapper
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: PassErrors.RePassword ? "red" : "#66bb6a", // Dynamic border color
      },
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: PassErrors.RePassword ? "red" : "#66bb6a", // Dynamic label color
    },
    "& .MuiFormHelperText-root": {
      minHeight: "20px", // Consistent helper text height
    },
      }}
      InputProps={{
  endAdornment:(
    <InputAdornment position='end'>
    <IconButton
      aria-label="toggle password visibility"
    onClick={handleClickShowPass2}
    onMouseDown={handleMouseDownPassword2}
     >
     {PasswordShow2? <VisibilityOff sx={{fontSize:'15px'}}/>:<Visibility sx={{fontSize:'15px'}}/>}
      </IconButton>
    </InputAdornment>
  ),
}}
      />
    )}
    />
<Box sx={{mt: 1, display:"flex",gap:2, justifyContent:"center"}}>
<ThemeProvider theme={theme1}>
{CircularProgress3 ? (<CircularProgress/>):(<Button variant='contained' color="primary"  type='submit'  startIcon={<LockIcon />} >Confirm Password</Button>)}
</ThemeProvider> 
    </Box>
  </Box>
  </Box>

</Modal>
</div>
  </div>
  )
} catch(error){
console.error('Error rendering login component:', error);
console.log(styles.large-logo);
  return <div>Error loading component.</div>;

}

}
