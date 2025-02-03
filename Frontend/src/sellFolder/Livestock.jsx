import React,{useState, useRef} from 'react'
import '../sellFolder/sell.css'
import { useForm, Controller} from 'react-hook-form';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {  Radio,FormControl,
    FormControlLabel,
    FormLabel,RadioGroup, Typography,TextField, Box ,ToggleButton, ToggleButtonGroup, Grid, InputAdornment ,IconButton,Button, CircularProgress, Modal,InputLabel,
  Select,MenuItem,FormHelperText,} from '@mui/material/';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import cow from '../assets/Banner/cows 6-banner.jpg';
import { LoadScript } from "@react-google-maps/api";
import Autocomplete from "@mui/material/Autocomplete";
import { ToastContainer, toast } from 'react-toastify';
import cow1 from '../assets/PhoneScreen/MobileRes-cow1.jpg'

const libraries = ["places"];
function Livestock() {
  const[CircularProgress1,setCircularProgress]=useState(false);
    
    
      const statesList = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi",
        "Jammu and Kashmir",
        "Ladakh",
        "Lakshadweep",
        "Puducherry",
      ];
       const schema=yup.object().shape({
              CattleType:yup
              .string()
              .required("Please Enter the Cattle Type")
              .matches(
                  /^[a-zA-Z ]+$/,
                  "Cattle Type can only contain alphabets, and spaces."
                )
                .max(35, "Cattle Type must be at most 35 characters."),

                BreadName: yup
        .string()
        .required("Please Enter the BreadName")
        .matches(/^[a-zA-Z0-9 ]+$/, "Bread Name can only contain alphabets, numbers, and spaces.")
        .max(35, "Bread Name must be at most 35 characters."),
                  

                  age:yup
                              .number()
                              .required("Age is required.")
                    .typeError("Age must be a number.") 
                    .integer("Age must be an integer.") 
                    .min(0, "Age cannot be negative.") 
                    .max(50, "age must be a valid number."),

                   HealthCondition: yup.string().required("No of Owners is required"),

                   Vaccinated: yup.string().required('Please select an option.'),
                   VacinationName: yup.string().test('vaccination-name-required', 'Vaccination name is required if vaccinated', function(value) {
                     const { Vaccinated } = this.parent;  // Access the Vaccinated value
                     if (Vaccinated === 'Yes' && !value) {
                       return this.createError({ message: 'Vaccination name is required.' });
                     }
                     return true;
                   }),

          NoOfOwners: yup.string().required("No of Owners is required"),
                
                Description:yup
                    .string()
                    .required("Description is required")
                    .min(10,"Description must be at least 10 characters")
                    .max(2000,"Description must not exceed 2000 characters"),

                     setPrice:yup
                    .number()
                    .required("Price is Required")
                    .typeError("Price must be a number.") 
                      .integer("Years must be an integer.")
                    .min(0,"Price should not be zero or less than zero"),


                    Images: yup
                      .array()
                      .required("All 5 images are required.")
                      .test("exactLength", "All 5 image slots must be filled.", (value) => 
                        value && value.filter(Boolean).length === 5 // Ensures all slots are filled
                      )
                      .of(
                        yup
                          .mixed()
                          .required("Each image slot must contain an image.")
                          .test(
                            "fileType",
                            "Uploaded file must be an image.",
                            (value) => value && value.type.startsWith("image/")
                          )
                      ),

                State: yup
                .string()
                .required("Please select a state"),

                District:yup
                .string()
                .required("Please select your District"),
                                              
                      Address: yup
                        .string()
                        .required("Address is required.")
                        .min(5, "Address must be at least 20 characters long.")
                        .max(100, "Address must not exceed 100 characters.")
                        .matches(
                          /^[a-zA-Z0-9\s,.\-#/():]+$/,
                          "Address can only contain alphabets, numbers, and common special characters (, . - # / ())."
                        ),


                        PinCode: yup
                        .string()
                        .required("Pin Code is required.")
                        .matches(
                          /^[1-9][0-9]{5}$/,
                          "Pin Code must be a 6-digit number starting with a non-zero digit."
                        ),           
       })
   //---------------------------------------------Theme---------------------------------------------------------------------------------  
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
                            minWidth: '150px', // Set a minimum width for the button
                 height: '50px',
                           },
                       },
                   },
               },
             });
       
             const { handleSubmit,watch, control, formState: { errors},getValues,reset,setValue,trigger } = useForm({
                 resolver: yupResolver(schema),
                 defaultValues: {
                    CattleType: '', // Initialize with an empty string or default value
                    BreadName: '',
                 age: '',
                 HealthCondition:'',
                 Vaccinated:'',
                 VacinationName:'',
                 NoOfOwners: '',
                 Description:'',
                 setPrice:'',
                 Images:Array(5).fill(null),
                 State:'',
                 Address:'',
                 PinCode:''
                },
               mode: 'onChange' 
               });
       
//------------------------------------------------------------IMAGE STORING------------------------------------------------------------------
               const [images, setImages] = useState(Array(5).fill(null));
      const [isSubmitting, setIsSubmitting] = useState(false);
      const imagesRef = useRef([]);
               
      const handleFileChange = (index, file) => {
        const updatedImages = [...images];
        updatedImages[index] = file || null; // Set to null if no file is selected
        setImages(updatedImages); // Update the state
      
        // Inform react-hook-form about the change
        setValue(`Images[${index}]`, file || null);
      
        // Manually trigger validation
        trigger("Images");
      };
      //-------------------------------------------------------------------------------------------------------------------
      const [Vacinatedd,setVacinated]=useState(true); 
      const vaccinatedValue = watch('Vaccinated');
        const featuresValue = watch("Features", "");

        // Calculate the word count
        const wordCount = featuresValue.trim().split(/\s+/).filter(Boolean).length;

        const featuresValue1=watch("Description","");
        const wordCount1=featuresValue1.trim().split(/\s+/).filter(Boolean).length;
        const { category } = useParams();


//----------------------------------------DATA SUBMISION-------------------------------------------------------------------------
        function AllData(formData) {
          setIsSubmitting(true);
          setCircularProgress(true);
          const formDataToSend = new FormData();
        
          // Append each form data, including images
          for (const key in formData) {
            if (key === "Images") {
              // Append files from the Images array
              formData.Images.forEach((file, index) => {
                formDataToSend.append("Images", file);
              });
            } else {
              formDataToSend.append(key, formData[key]);
            }
          }
        
          formDataToSend.append("category", category); // Add category separately if needed
        
        
          // Send the FormData using Axios
          axios.post("http://localhost:5000/sell/upload-product", formDataToSend, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data", // Important for file upload
            },
          })
          .then((response) => {
            console.log("Product uploaded successfully:", response.data);
            toast("Product uploaded successfully!");
            setCircularProgress(false);
            setIsSubmitting(false)
            reset({
                CattleType: '', // Initialize with an empty string or default value
                BreadName: '',
             age: '',
             HealthCondition:'',
             Vaccinated:'',
             VacinationName:'',
             NoOfOwners: '',
             Description:'',
             setPrice:'',
             Images:Array(5).fill(null),
             State:'',
             District:'',
             Address:'',
             PinCode:''
            });
            imagesRef.current.forEach((input) => {
              input.value = ""; // Manually clear each image input field
            });
            setImages(Array(5).fill(null));
          })
          .catch((error) => {
            console.error("Error uploading product:", error.response?.data || error.message);
            toast("Error uploading product. Please try again.");
            reset({
                CattleType: '', // Initialize with an empty string or default value
                BreadName: '',
             age: '',
             HealthCondition:'',
             Vaccinated:'',
             VacinationName:'',
             NoOfOwners: '',
             Description:'',
             setPrice:'',
             Images:Array(5).fill(null),
             State:'',
             Address:'',
             PinCode:''
            });
            setCircularProgress(false);
            setIsSubmitting(false);
            imagesRef.current.forEach((input) => {
              input.value = ""; // Manually clear each image input field
            });
            setImages(Array(5).fill(null));
          });
        }
 //-------------------------------------------AUTOCOMPLETE OF DISTRICT AND STATE------------------------------------------------------   
       
                                    const [placeOptions, setPlaceOptions] = useState([]); // State to store place options
                                                                 
                                                                 // Step 2: Function to fetch place suggestions
                                                                 const fetchPlaceSuggestions = (input) => {
                                                                   const service = new window.google.maps.places.AutocompleteService();
                                                                   service.getPlacePredictions(
                                                                     { input, types: ["(cities)"] },
                                                                     (predictions, status) => {
                                                                       if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                                                                         const formattedOptions = predictions.map((prediction) => ({
                                                                           label: prediction.description, // Display this in the dropdown
                                                                           value: prediction.place_id,   // Store place ID
                                                                         }));
                                                                         setPlaceOptions(formattedOptions); // Update state with new options
                                                                       } else {
                                                                         console.error("Failed to fetch place suggestions:", status);
                                                                       }
                                                                     }
                                                                   );
                                                                 };
                                                              

  return (
    <div className='liveStack-full'>
<div className="bannerImage">
    <div className="content">
          <h1>Agrivibes...Vibes of Modern Agriculture</h1>
          <h2>You Grow, We Sell</h2>
          </div>
    <Link to={" "}><img className='tractor' src={cow} alt="tractor machine"/></Link>
    <Link to={" "}><img className='tractor1' src={cow1} alt="tractor machine"/></Link>
    </div>

    <div className="bannerTitle"><h1>Sell LiveStock</h1></div>
        <div className='heading'><h1>Post Your AD</h1></div>
        <div className='Form'>
         <br/>
         <Box component="form" onSubmit={handleSubmit(AllData)}  noValidate autoComplete="off"
           sx={{ '& .MuiTextField-root': { m: 1 } }}>

           <Controller
                     name="CattleType"
                     control={control}
                     render={({ field }) => (
                       <TextField className='MachineName'
                       {...field}
                       error={!!errors.CattleType}
              helperText={errors.CattleType?.message}
              label="LiveStock Type *"
              disabled={isSubmitting}
              variant="outlined" sx={{"& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.CattleType ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.CattleType ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
      marginLeft:"0px" 
    },
    }} />
  )}
  />
<br/><br/><br/>
<Controller
                     name="BreadName"
                     control={control}
                     render={({ field }) => (
                       <TextField className='BrandName'
                       {...field}
                       error={!!errors.BreadName}
              helperText={errors.BreadName?.message}
              label="Bread Name *"
              disabled={isSubmitting}
              variant="outlined" sx={{"& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.BreadName ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.BreadName ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
      marginLeft:"0px" 
    },
    }} />
  )}
  />
  <br/><br/><br/>
  <Controller
                       name="age"
                       control={control}
                       render={({ field }) => (
                         <TextField className='BrandName'
                         {...field}
                         error={!!errors.age}
                helperText={errors.age?.message}
                label="Age of LiveStock *"
                disabled={isSubmitting}
                variant="outlined" sx={{"& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
          borderColor: errors.age ? 'red' : '#66bb6a', // Green for correct validation
        }
      },
      "& .MuiFormLabel-root.Mui-focused": {
        color: errors.age ? 'red' : '#66bb6a', // Green for label color
      }, "& .MuiFormHelperText-root": {
        marginTop: '5px',
        marginLeft:"0px" ,
      },
      }} />
    )}
    />
    <br/><br/><br/>
     <Typography className='HeadingOwner1'
        variant="h6"
      >
        Health Condition of LiveStock *
      </Typography>
       <Controller
              name="HealthCondition"
              control={control}
              defaultValue=""
              disabled={isSubmitting}
              render={({ field }) => (
                <ToggleButtonGroup className='Owner1'
                  {...field}
                  exclusive
                  onChange={(e, value) => field.onChange(value)} // Ensures proper integration with react-hook-form
                  aria-label="Health Condition of LiveStock"
                  sx={{
                    gap: 1,
            "& .MuiToggleButtonGroup-grouped": {
          border: "1px solid rgba(0, 0, 0, 0.23)", 
          borderRadius:"8px",
          margin: "0 8px 8px 0",
        },
                  }}
                >
                  <ToggleButton value="Very Good" aria-label="Very Good" className="owner-btn1">Very Good</ToggleButton>
                  <ToggleButton value="Good" aria-label="Good" className="owner-btn1">Good</ToggleButton>
                  <ToggleButton value="Avg" aria-label="Average" className="owner-btn1">Avg</ToggleButton>
                  <ToggleButton value="Bad" aria-label="Bad" className="owner-btn1">Bad</ToggleButton>
                </ToggleButtonGroup>
              )}
            />
            {errors.HealthCondition && (
              <Typography color="error" variant="body2" sx={{ marginLeft: "10px",marginTop:"10px" }}>
                {errors.HealthCondition.message}
              </Typography>
            )}
            <br/><br/>
            <FormControl className='options'
  component="fieldset"
  error={!!errors.Vaccinated}
  sx={{
    '& .MuiFormLabel-root': {
      color: !!errors.Vaccinated ? 'red' : 'black', // Default to black, red if error
      '&.Mui-focused': {
        color: !!errors.Vaccinated ? 'red' : '#66bb6a', // Green when focused, red if error
      },
    },
    '& .MuiRadio-root': {
      color: 'black', // Default to black
      '&.Mui-checked': {
        color: '#66bb6a', // Green when selected
      },
      '&:hover': {
        color: 'red', // Red on hover
      },
    },
  }}
>
  <FormLabel component="legend">Vaccinated</FormLabel>
  <Controller
    name="Vaccinated"
    control={control}
    render={({ field }) => (
      <RadioGroup {...field} row>
        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="No" control={<Radio />} label="No" />
      </RadioGroup>
    )}
  />
  {errors.Vaccinated && (
    <Typography color="error" variant="body2">
      {errors.Vaccinated.message}
    </Typography>
  )}
</FormControl>

      <br /><br/>

      {/* Conditionally render and validate VacinationName based on the vaccinated value */}
      <Controller
        name="VacinationName"
        control={control}
        render={({ field }) => (
          <TextField className='BrandName'
            {...field}
            error={!!errors.VacinationName}
            helperText={errors.VacinationName?.message}
            label="Vaccination Name"
            disabled={vaccinatedValue !== 'Yes'} // Disable when "No" is selected
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: errors.VacinationName ? 'red' : '#66bb6a',
                },
              },
              '& .MuiFormLabel-root.Mui-focused': {
                color: errors.VacinationName ? 'red' : '#66bb6a',
              },
              '& .MuiFormHelperText-root': {
                marginTop: '4px',
                marginLeft: '0px',
              },
            }}
          />
        )}
      />
      <br/><br/><br/>
      <Typography 
          variant="h6" 
          className='HeadingOwner'
        >
          No. of Owners *
        </Typography>
         <Controller
                name="NoOfOwners"
                control={control}
                defaultValue=""
                disabled={isSubmitting}
                render={({ field }) => (
                  <ToggleButtonGroup className='Owner'
                    {...field}
                    exclusive
                    onChange={(e, value) => field.onChange(value)} // Ensures proper integration with react-hook-form
                    aria-label="No. of Owners"
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                    marginLeft:"10px",
                    borderRadius: "8px", // Adds border-radius to the entire group
              "& .MuiToggleButtonGroup-grouped": {
            border: "1px solid rgba(0, 0, 0, 0.23)", 
            borderRadius:"8px",
          },
                    }}
                  >
                    <ToggleButton value="1" aria-label="1st"  className="owner-btn">1st</ToggleButton>
                    <ToggleButton value="2" aria-label="2nd"  className="owner-btn">2nd</ToggleButton>
                    <ToggleButton value="3" aria-label="3rd"  className="owner-btn">3rd</ToggleButton>
                    <ToggleButton value="4" aria-label="4th"  className="owner-btn">4th</ToggleButton>
                    <ToggleButton value="4+" aria-label="4+"  className="owner-btn">4+</ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
              {errors.NoOfOwners && (
                <Typography color="error" variant="body2" sx={{ marginLeft: "10px",marginTop:"10px" }}>
                  {errors.NoOfOwners.message}
                </Typography>
              )}
              <br/><br/>
              
              <Controller 
                name="Description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Box sx={{ position: "relative", width: "500px" }}>
                    <TextField className='Description'
                      {...field}
                      error={!!errors.Description}
                      helperText={errors.Description?.message}
                      label="Description *"
                      disabled={isSubmitting}
                      variant="outlined"
                      multiline
                      rows={6}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: errors.Description? 'red' : '#66bb6a',
                          },
                        },
                        "& .MuiFormLabel-root.Mui-focused": {
                          color: errors.Description? 'red' : '#66bb6a',
                        },
                        "& .MuiFormHelperText-root": {
                          marginTop: "5px", // Adjust space between input and error message
                          marginLeft: "0px", // Remove left margin for alignment
                          paddingLeft: "0px", // Remove padding
                          textAlign: "left", // Ensure left-aligned text for helper text
                        },
                      }}
                    />
                    
                    <Typography className='WordCount'
                      variant="caption"
                    >
                      {wordCount1} / 2000 words
                    </Typography>
              
                   
                    <Typography className='DescripText'
                      variant="body2"
                    >
                    Include condition, features and reason for selling
                    </Typography>
                  </Box>
                )}
              />
              
              <br/><br/>
              <Controller
                                   name="setPrice"
                                   control={control}
                                   render={({ field }) => (
                                     <TextField className='Price'
                                     {...field}
                                     error={!!errors.setPrice}
                            helperText={errors.setPrice?.message}
                            label="₹ Price *"
                            disabled={isSubmitting}
                            variant="outlined" sx={{"& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: errors.setPrice ? 'red' : '#66bb6a', // Green for correct validation
                    }
                  },
                  "& .MuiFormLabel-root.Mui-focused": {
                    color: errors.setPrice ? 'red' : '#66bb6a', // Green for label color
                  }, "& .MuiFormHelperText-root": {
                    marginTop: '4px',
                    marginLeft:"0px" 
                  }
                  }} />
                )}
                />
                <br/><br/><br/>
                <Typography variant="h6" className="UploadImages">
  Upload 5 Images
</Typography>

<Grid container spacing={0} rowGap={2} columnGap={0} className="UploadGrid">
  {Array.from({ length: 5 }).map((_, index) => (
    <Grid item xs={12} sm={6} md={4} lg={2.5} key={index} sx={{ height: "100px", overflow: "hidden" }}>
      <Controller
        name={`Images[${index}]`}
        control={control}
        render={({ field }) => (
          <Box className="UploadBox">
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              id={`file-input-${index}`}
              ref={(el) => (imagesRef.current[index] = el)}
              onChange={(e) => handleFileChange(index, e.target.files[0])}
              disabled={isSubmitting}
            />
            <label htmlFor={`file-input-${index}`}>
              <Button
                variant="standard"
                component="span"
                sx={{
                  width: "100%",
                  height: "100%",
                  padding: 0,
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid black",
                  borderRadius: 0,
                  backgroundColor: "white",
                  overflow: "hidden",
                }}
              >
                {images[index] ? (
                  <Typography variant="body2" noWrap>
                    {images[index]?.name}
                  </Typography>
                ) : (
                  <PhotoCamera sx={{ fontSize: 36, color: "gray" }} />
                )}
              </Button>
            </label>
          </Box>
        )}
      />
    </Grid>
  ))}
</Grid>

{errors.Images && !isSubmitting && (
  <Typography color="error" sx={{ marginTop: 2 }}>
    {errors.Images.message || "Please upload valid images."}
  </Typography>
)}

<br/><br/><br/>
     <FormControl className='State'
       error={!!errors.State} // Dynamically apply error styles
       sx={{
         "& .MuiOutlinedInput-root": {
           "&.Mui-focused fieldset": {
             borderColor: errors.State ? 'red' : '#66bb6a', // Red for errors, green for valid
           },
         },
         "& .MuiFormLabel-root.Mui-focused": {
           color: errors.State ? 'red' : '#66bb6a', // Red for errors, green for valid
         },
       }}
     >
       <InputLabel id="state-label">State</InputLabel>
       <Controller
         name="State"
         control={control}
         render={({ field }) => (
           <Select
             {...field}
             labelId="state-label"
             label="State *"
             value={field.value || ""}
             disabled={isSubmitting}
             onChange={(e) => field.onChange(e.target.value)}
           >
             {statesList.map((state) => (
               <MenuItem key={state} value={state}>
                 {state}
               </MenuItem>
             ))}
           </Select>
         )}
       />
       <FormHelperText sx={{ marginLeft: 0}}>{errors.State?.message}</FormHelperText>
     </FormControl>
     
    <br/><br/><br/>

<LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY} libraries={libraries}>
      
      {/* Autocomplete for District */}
      <Controller
        name="District"
        control={control}
        render={({ field }) => (
          <Autocomplete className='District'
            {...field}
            options={placeOptions} // Dynamically fetched options
            getOptionLabel={(option) => option.label || ""}
            value={placeOptions.find((option) => option.label === field.value) || null}
            onInputChange={(event, value) => {
              if (value) fetchPlaceSuggestions(value); // Fetch suggestions when user types
            }}
            onChange={(_, value) => field.onChange(value?.label || "")} // Update the field value with the label
            renderInput={(params) => (
              <TextField className='District'
                {...params}
                label="Enter your town or city *"
                variant="outlined"
                error={!!errors.District}
                helperText={errors.District?.message}
                disabled={isSubmitting}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: errors.District ? "red" : "#66bb6a",
                    },
                  },
                  "& .MuiFormLabel-root.Mui-focused": {
                    color: errors.District ? "red" : "#66bb6a",
                  },
                }}
              />
            )}
          />
        )}
      />
    </LoadScript>
  <br/><br/>
    <Controller
                     name="Address"
                     control={control}
                     render={({ field }) => (
                       <TextField className='Address'
                       {...field}
                       error={!!errors.Address}
              helperText={errors.Address?.message}
              label="Address *"
              disabled={isSubmitting}
              variant="outlined" sx={{display:"relative","& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.Address ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.Address ? 'red' : '#66bb6a', // Green for label color
    }
    }} />
  )}
  />

  <br/><br/><br/>

  
  <Controller
                     name="PinCode"
                     control={control}
                     render={({ field }) => (
                       <TextField className='PinCode'
                       {...field}
                       error={!!errors.PinCode}
              helperText={errors.PinCode?.message}
              label="PinCode *"
              disabled={isSubmitting}
              variant="outlined" sx={{display:"relative","& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.PinCode ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.PinCode ? 'red' : '#66bb6a', // Green for label color
    }
    }} />
  )}
  />
  <br/><br/><br/>
  <ThemeProvider theme={theme1}>
{CircularProgress1 ? (<CircularProgress/>):(<Button variant="contained" color="primary" type="submit" className='SubmitButt'>
            Post AD
          </Button>)}
          </ThemeProvider>
              
</Box>
    </div>
    </div>
  )
}

export default Livestock