
import React,{useState,useEffect} from 'react';
import { useForm, Controller} from 'react-hook-form';
import { Link,useNavigate } from 'react-router-dom';
import { TextField, Box , InputAdornment ,IconButton,Button,Typography, CircularProgress, Modal} from '@mui/material/';
import { Email, Subject, Visibility, VisibilityOff } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './Reg.module.css';
import axios from 'axios';

import IndianFormerBg2 from '../assets/IndianFormerBg2.png'
import { text } from '@fortawesome/fontawesome-svg-core';
import { ToastContainer, toast } from 'react-toastify';


// Validation schema using Yup
const schema = yup.object().shape({
  FullName: yup
    .string()
    .matches(/^[a-zA-Z\s]{3,25}$/, 'Enter a valid name (3-25 characters, letters and spaces only)')
    .required('Full Name is required'),
  PhoneNumber: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  Email: yup
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
    
});
//Validating Schema for OTP
const otpSchema = yup.object().shape({
  emailOtp: yup
    .string()
    .matches(/^\d{5}$/, 'Email OTP must be a 5-digit number')
    .required('Email OTP is required'),

   // phoneOtp: yup
    //.string()
    //.matches(/^\d{5}$/, 'Phone OTP must be a 5-digit number')
    //.required('Phone OTP is required'),
    });
    //-----------------------------------------------------------------------------------------------
//All Use States
export default function Registration() {
  const [apiLoading, setApiLoading] = useState(false);
  const [otpLoading, setOtp]=useState(false);
  const [otpbutt,OtpSendButton]=useState(false);
  const [showPass,setShowPassword1]=useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [formdetails,setFormDetails]=useState();
  const [OTPID,setOtpID]=useState()

  const handleotpModelOpen=()=>setIsOtpModalOpen(true);
  const handleotpModelClose=()=>setIsOtpModalOpen(false);

  const navigate = useNavigate();
  //----------------------------------------------------------Timer functions-----------------------------------------------
  
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
//------------------------------------------------------Database Checker-----------------------------------------------------

function submitNow(formData) {
  
  try {
    // Extract and validate inputs 
    let mailCheck = formData.Email ? formData.Email.toString() : "";
    let phoneCheck = formData.PhoneNumber ? formData.PhoneNumber.toString() : "";

    if (!mailCheck || !phoneCheck) {
      alert("Please provide both Email and Phone Number.");
      return;
    }
setFormDetails(formData)
    // Set loading state to true
    setApiLoading(true);

    // Make API request
    axios.post("https://agrivibess.onrender.com/findUser", {
      Email: mailCheck,
      PhoneNumber: phoneCheck,
    })
      .then((response) => {
         // Debugging response
        if (response.data.exists) {
          alert("You are already registered. Please proceed to login...");
          setApiLoading(false);
          resetForm({
            FullName: "", 
            PhoneNumber: "",
            Email: "",
            Password: "",
            RePassword: ""
          });
        } else {
          setApiLoading(false);
          handleotpModelOpen();
        }
         // Reset loading state
      })
      .catch((error) => {
        console.error("Error Calling the API:", error); // Debugging error
        alert("An error occurred while checking your details. Please try again later.");
        setApiLoading(false);
      });
  } catch (error) {
    console.error("Unexpected Error:", error); // Debugging unexpected errors
    setApiLoading(false); // Reset loading state in case of unexpected errors
  }
}
//------------------------------------------------------------OTP Generator-------------------------------------------------------

  function otpGenerator(email,phone){
  
    setOtp(true);
    axios.post('https://agrivibess.onrender.com/send-email', {
      to: email, 
      subject: 'AgriVibes OTP Authentication',
      text: `The OTP will be sent shortly. Please check your inbox`,
      //phoneNo:phone
  })
  .then(response => {
      toast('Email sent successfully');
      setOtp(false);
      OtpSendButton(true);
      startTimer();
      console.log(response.data.emailOTP)
      setOtpID(response.data.emailOTP);
  })
  .catch(error => {
      console.error('Error sending email:', error);
      toast('Failed to send email. Please try again.');
      setOtp(false);
      OtpSendButton(false);
      
  });
  }
 
//--------------------------------------------------------------OTP Validator------------------------------------------------
function otpValidator(otpData){
const email=otpData.emailOtp;
//const phone=otpData.phoneOtp;

axios.post('https://agrivibess.onrender.com/validation',{
  EmailOTP: email,
 // PhoneOTP:phone
})
  .then(response => {
    if(response.data.message){
    stopTimer();
   
reset({
  emailOtp: "",
  //phoneOtp: ""
});
resetForm({
  FullName: "", 
  PhoneNumber: "",
  Email: "",
  Password: "",
  RePassword: ""
})
handleotpModelClose();
OtpSendButton(false);
    console.log(response.data); // Handle success
    //redirect....
  storing();
     
}
  })

  .catch(error => {
    const errorMessage = error.response?.data?.error || "Failed to login. Try again...";
    toast(errorMessage)
    OtpSendButton(false);
    stopTimer();
    reset({
      emailOtp: "",
      //phoneOtp: "",
    });
  });
  }
//------------------------------------------------------------------------------------------------
  const { handleSubmit, control, formState: { errors },getValues,reset:resetForm } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
    FullName: '', // Initialize with an empty string or default value
    PhoneNumber: '',
    Email: '',
    Password: '',
    RePassword: '',
   },
  mode: 'onChange' 
  });
//-----------------------------------------------------------------------------------
  const { handleSubmit:handleOtpFormSubmit, control: otpControl, formState: { errors: otpErrors } ,reset} = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: {
      emailOtp: '',
     // phoneOtp: '',
    },
    mode: 'onChange',
  });

  //--------------------------------------------------------STORING------------------------------------------------------------------
 
  function storing(){
     console.log(formdetails);
     axios.post('https://agrivibess.onrender.com/storage',{
       userInfo:formdetails
     }).then(response=>{
       if(response.status===200){
         console.log("Loged in....succesfully");
         toast("You have been loged in...")
      
         axios.post('https://agrivibess.onrender.com/deleteOtp',{
           Id:OTPID
         }).then(response=>{
           if(response.status===200){
             console.log("Deleted succesfully");
             navigate('/agri'); 
           }
         }).catch(error=>{
           console.log(error+"cant able to delete the OTP Block...")
         })
       }
     }).catch(error=>{
       const errorMessage = error.response?.data?.error || "Failed to login. Try again...";
      console.log( "Backend Error:", error.response?.data || error);
       toast(errorMessage)
     })
     }
   
   

//----------------------------------------------------------Password Visibility---------------------------------------------------
  const handleClickShowPass=()=>setShowPassword1(!showPass);
  const handleClickShowPassword = () => setShowPassword(!showPassword); // Toggle password visibility
  const handleMouseDownPassword = (event) => event.preventDefault(); // Prevent default behavior on mouse down

  const theme = createTheme({
    palette: {
      primary: {
        main: '#66bb6a', // Default color for primary buttons
      },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                  padding: '3px 20px',
                 
                    borderRadius: '20px',
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
                 
                },
            },
        },
    },
  });
//------------------------------------------------------------Form Starts-----------------------------------------------------------
  return (
    <div className={styles.register}>
    <div className={styles.container}>
    
    <div className={styles.Inputfeild}>
   
    <Typography variant='h4' className={styles.heading}>Sign up</Typography>

    
    
    <br/>
      <Box component="form" onSubmit={handleSubmit(submitNow)} noValidate autoComplete="off"
           sx={{ '& .MuiTextField-root': { m: 1 } }} className='Input'>

        {/* Full Name Field */}
        <Controller
          name="FullName"
          control={control}
          render={({ field }) => (
            <TextField className= {styles.FullName}
              {...field} 
              disabled={apiLoading}
              error={!!errors.FullName}
              helperText={errors.FullName?.message}
              label="Full Name"
              variant="standard"
              sx={{height: '80px' ," & .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
    color: errors.FullName ?'#FF0000':'#66bb6a',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: errors.FullName ?'#FF0000':'#66bb6a',
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
 


<br/>
        {/* Phone Number Field */}
        <Controller
          name="PhoneNumber"
          control={control}
          render={({ field }) => (
            <TextField className= {styles.PhoneNumber}
              {...field} disabled={apiLoading}
              error={!!errors.PhoneNumber}
              helperText={errors.PhoneNumber?.message}
              label="Phone Number"
              variant="standard"
             
            
              sx={{height: '80px', "& .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
    color: errors.PhoneNumber ?'#FF0000':'#66bb6a',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: errors.PhoneNumber ?'#FF0000':'#66bb6a',
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
            />
          )}
        />


 


<br/>
        {/* Email Field */}
        <Controller
          name="Email"
          control={control}
          render={({ field }) => (
            <TextField className= {styles.Email}
              {...field} disabled={apiLoading}
              error={!!errors.Email}
              helperText={errors.Email?.message}
              label="Email"
              variant="standard"
              sx={{height: '80px', "& .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
    color: errors.Email ?'#FF0000':'#66bb6a',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: errors.Email ?'#FF0000':'#66bb6a',
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
            />
          )}
        />

     
<br/>
        {/* Password Field */}
        <Controller
          name="Password"
          control={control}
          render={({ field }) => (
            <TextField className= {styles.Password}
              {...field} disabled={apiLoading}
              error={!!errors.Password}
              helperText={errors.Password?.message}
              label="Password"
              type={showPass ? 'text' : 'password'}
              variant="standard"
              sx={{height: '80px', "& .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
    color: errors.Password?'#FF0000':'#66bb6a',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: errors.Password ?'#FF0000':'#66bb6a',
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

  
<br/>
        {/* Confirm Password Field */}
        <Controller
          name="RePassword"
          control={control}
          render={({ field }) => (
            <TextField className={styles.RePassword}
              {...field} disabled={apiLoading}
              error={!!errors.RePassword}
              helperText={errors.RePassword?.message}
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'} // Toggle the type based on visibility state
              variant="standard"
              
              
              sx={{height: '80px', "& .MuiFormHelperText-root": { marginTop: '4px' }, '& label.Mui-focused': {
    color: errors.RePassword?'#FF0000':'#66bb6a',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: errors.RePassword ?'#FF0000':'#66bb6a',
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

     
<br/><br/>

<ThemeProvider theme={theme}>

 {apiLoading ? (<CircularProgress/>):(<Button disabled={apiLoading} variant="contained" color="primary" type="submit" startIcon={<HowToRegIcon />} size='small' className={styles.RegisterButt} >
  Register
</Button> )}
</ThemeProvider>

<h5 className={styles.login}>Registered?<Link to="/" className={styles.log}> log in</Link></h5>
      </Box>
      </div>
      <div className={styles.images}>
      <img src={IndianFormerBg2} alt="former" className="former-img"/>
    </div>
    

{/* OTP Model */}
 
 

<div className={`${styles.container} ${isOtpModalOpen ? 'blur-background' :''}`}   >
<Modal open={isOtpModalOpen} onClose={handleotpModelClose} BackdropProps={{
          onClick: (e) => e.stopPropagation() // Override the default close behavior for clicks on the backdrop
        }}>
        <Box className={styles.Box1}
          onClick={(e) => e.stopPropagation()}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Verify Your OTP
          </Typography>
          <Box component="form" onSubmit={handleOtpFormSubmit(otpValidator)} className={styles.Box2}>
          {/* Email OTP Field */}
          <Controller
          name="emailOtp"
                control={otpControl}
                render={({ field }) => (
                  <TextField className={styles.emailOTP}
                    {...field}
                    label="Email OTP"
                    error={!!otpErrors.emailOtp}
                    helperText={otpErrors.emailOtp?.message ||" "}
                    fullWidth
                    sx={{
    // Styling for the TextField wrapper
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: otpErrors.emailOtp ? "red" : "#66bb6a", // Dynamic border color
      },
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: otpErrors.emailOtp ? "red" : "#66bb6a", // Dynamic label color
    },
    "& .MuiFormHelperText-root": {
      minHeight: "20px", // Consistent helper text height
    },
  }}
              />
            )}
          />
          
          {/* Phone OTP Field */}
          {/*
          <Controller
           name="phoneOtp"
                control={otpControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone OTP"
                    error={!!otpErrors.phoneOtp}
                    helperText={otpErrors.phoneOtp?.message||" "}
                    fullWidth
                    sx={{
    // Styling for the TextField wrapper
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: otpErrors.phoneOtp ? "red" : "#66bb6a", // Dynamic border color
      },
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: otpErrors.phoneOtp ? "red" : "#66bb6a", // Dynamic label color
    },
    "& .MuiFormHelperText-root": {
      minHeight: "20px", // Consistent helper text height
    },
  }}
              />
            )}
          />
*/}

           {timerActive && (
              <Typography variant="body2" sx={{ mt: 2, color: 'red' }}>
                Time Remaining: {formatTime(timeRemaining)}
              </Typography>
            )}

          <Box  className={styles.Box3} sx={{ mt: 1, display: "flex", gap: 2, justifyContent: "center"  }}> 
          <ThemeProvider theme={theme1}>
          {otpLoading ? (<CircularProgress/>): (<Button variant='contained' disabled={otpbutt} color="primary"  onClick={()=>otpGenerator(getValues("Email"),getValues("PhoneNumber"))} startIcon={<SendIcon />} >Send OTP</Button>)}
          <Button variant="contained" color="primary" type="submit"  startIcon={<VerifiedIcon />}>
            Confirm OTP
          </Button>
          </ThemeProvider>
          </Box>
          </Box>
        </Box>
      </Modal>
    </div>
    </div>
    </div>
  );
}
