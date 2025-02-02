
import React,{useState, useRef} from 'react'
import '../sellFolder/sell.css'
import { useForm, Controller} from 'react-hook-form';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, Box ,ToggleButton, ToggleButtonGroup, Grid, InputAdornment ,IconButton,Button,Typography, CircularProgress, Modal,  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,} from '@mui/material/';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { LoadScript } from "@react-google-maps/api";
import Autocomplete from "@mui/material/Autocomplete";
import tractor from '../assets/Banner/AgriMachine-banner-1.jpg'
import { relative } from 'path-browserify';
import { ToastContainer, toast } from 'react-toastify';
import Tractor1 from '../assets/PhoneScreen/Tractor-5.jpg'


function AgricultureMachineForm() {

 
  const[CircularProgress1,setCircularProgress]=useState(false);
   const [images, setImages] = useState(Array(5).fill(null));
   const [isSubmitting, setIsSubmitting] = useState(false); 
         const imagesRef = useRef([]);
  const [placeOptions, setPlaceOptions] = useState([]);
  
  // Define fetchPlaceSuggestions
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
          setPlaceOptions(formattedOptions); // Update state
        } else {
          console.error("Failed to fetch place suggestions:", status);
        }
      }
    );
  };


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
        MachineName:yup
        .string()
        .required("Please Enter the Machine Name")
        .matches(
            /^[a-zA-Z0-9 ]+$/,
            "MachineName can only contain alphabets, numbers, and spaces."
          )
          .max(35, "Machine name must be at most 35 characters."),

        BrandName:yup
            .string()
            .required("Please Enter the  Brand Name")
            .matches(
                /^[a-zA-Z0-9 ]+$/,
                "Brand Name can only contain alphabets, numbers, and spaces."
              )
              .max(25, "MachineName must be at most 35 characters."),

            years:yup
            .number()
            .required("Years is required.")
  .typeError("Years must be a number.") 
  .integer("Years must be an integer.") 
  .min(0, "Years cannot be negative.") 
  .max(9999, "Years must be a valid number."),

 NoOfOwners: yup.string().required("No of Owners is required"),

  Features:yup
  .string()
  .required("Features is required.")
  .min(10, "Features must be at least 10 characters.")
  .max(1500, "Features must not exceed 1500 characters."),

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
                            .required("Please select your state"),

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

      const { handleSubmit,watch, control, formState: { errors },getValues,reset,setValue } = useForm({
          resolver: yupResolver(schema),
          defaultValues: {
         MachineName: '', // Initialize with an empty string or default value
          BrandName: '',
          years: '',
          NoOfOwners: '',
          Features: '',
          Description:'',
          setPrice:'',
          Images:Array(5).fill(null),
          State:'',
          District:'',
          Address:'',
          PinCode:''
         },
        mode: 'onChange' 
        });

  // Handle file change for each input
  const handleFileChange = (index, file) => {
    const updatedImages = [...images];
    updatedImages[index] = file || null; 
    setImages(updatedImages); // Update the state
    setValue(`Images[${index}]`, file || null); // Inform react-hook-form about the change
  };



        const featuresValue = watch("Features", "");

        // Calculate the word count
        const wordCount = featuresValue.trim().split(/\s+/).filter(Boolean).length;

        const featuresValue1=watch("Description","");
        const wordCount1=featuresValue1.trim().split(/\s+/).filter(Boolean).length;
        const { category } = useParams();



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
              MachineName: "",
              BrandName: "",
              years:"",
              NoOfOwners:"",
              Features:"",
              Description:"",
              setPrice:"",
              Images:Array(5).fill(null),
              State:'',
              District:'',
              Address:"",
              PinCode:"",
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
              MachineName: "",
              BrandName: "",
              years:"",
              NoOfOwners:"",
              Features:"",
              Description:"",
              setPrice:"",
              Images:Array(5).fill(null),
              State:'',
              District:'',
              Address:"",
              PinCode:"",
            });
            setCircularProgress(false);
            setIsSubmitting(false);
            imagesRef.current.forEach((input) => {
              input.value = ""; // Manually clear each image input field
            });
            setImages(Array(5).fill(null));
          });
        }
        


  return (
    <div className= 'machine-full'>

    <div className= 'bannerImage'>
    <div className= 'content'>
          <h1>Agrivibes...Vibes of Modern Agriculture</h1>
          <h2>You Grow, We Sell</h2>
          </div>
    <Link to={" "}><img className='tractor' src={tractor} alt="tractor machine"/></Link>
    
    
<Link to= {" "}><img className='tractor1' src={Tractor1} alt='tractor1'/></Link>

    </div>

    <div className="bannerTitle"><h1>Sell Agriculture Machine</h1></div>
        <div className='heading'><h1>Post Your AD</h1></div>
        <div className='Form'>
         <br/>
         <Box component="form" onSubmit={handleSubmit(AllData)}  noValidate autoComplete="off"
           sx={{ '& .MuiTextField-root': { m: 1 } }}>

           <Controller
                     name="MachineName"
                     control={control}
                     render={({ field }) => (
                       <TextField className='MachineName'
                       {...field}
                       error={!!errors. MachineName}
              helperText={errors. MachineName?.message}
              label="Machine Name *"
              disabled={isSubmitting}
              variant="outlined" sx={{"& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.MachineName ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.MachineName ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
      marginLeft:"0px" 
    },
    }} />
  )}
  />

<br/><br/><br/>
<Controller
                     name="BrandName"
                     control={control}
                     render={({ field }) => (
                       <TextField className='BrandName'
                       {...field}
                       error={!!errors.BrandName}
              helperText={errors.BrandName?.message}
              label="Brand *"
              disabled={isSubmitting}
              variant="outlined" sx={{"& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.BrandName ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.BrandName ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
      marginLeft:"0px" 
    },
    }} />
  )}
  />
  <br/><br/><br/>
  <Controller
                     name="years"
                     control={control}
                     render={({ field }) => (
                       <TextField className='Year'
                       {...field}
                       error={!!errors.years}
              helperText={errors.years?.message}
              label="Year of Purchased *"
              disabled={isSubmitting}
              variant="outlined" sx={{"& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.years ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.years ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '5px',
      marginLeft:"0px" ,
    },
    }} />
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
   <ToggleButton value="1" aria-label="1st" className="owner-btn">1st</ToggleButton>
  <ToggleButton value="2" aria-label="2nd" className="owner-btn">2nd</ToggleButton>
  <ToggleButton value="3" aria-label="3rd" className="owner-btn">3rd</ToggleButton>
  <ToggleButton value="4" aria-label="4th" className="owner-btn">4th</ToggleButton>
  <ToggleButton value="4+" aria-label="4+" className="owner-btn">4+</ToggleButton>
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
  name="Features"
  control={control}
  defaultValue=""
  render={({ field }) => (
    <Box sx={{ position: "relative", width: "500px" }}>
      <TextField className='Features'
        {...field}
        error={!!errors.Features}
        helperText={errors.Features?.message}
        label="Features *"
        disabled={isSubmitting}
        variant="outlined"
        multiline
        rows={6}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: errors.Features ? 'red' : '#66bb6a',
            },
          },
          "& .MuiFormLabel-root.Mui-focused": {
            color: errors.Features ? 'red' : '#66bb6a',
          },
          "& .MuiFormHelperText-root": {
            marginTop: "5px", // Adjust space between input and error message
            marginLeft: "0px", // Remove left margin for alignment
            paddingLeft: "0px", // Remove padding
            textAlign: "left", // Ensure left-aligned text for helper text
          },
        }}
      />
      
      {/* Word Counter */}
      <Typography className='WordCount'
        variant="caption"
        sx={{
          color: wordCount > 1500 ? "red" : "gray",
        }}
      >
        {wordCount} / 1500 words
      </Typography>

      {/* Instruction Line at Bottom */}
      <Typography className='FeatureError'
        variant="body2"
      >
      key features of your Machine(e.g. brand, model, age, type)
      </Typography>
    </Box>
  )}
/>
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
      
      {/* Word Counter */}
      <Typography className='WordCount'
        variant="caption"
        sx={{
          color: wordCount1 > 2000 ? "red" : "gray",
        }}
      >
        {wordCount1} / 2000 words
      </Typography>

      {/* Instruction Line at Bottom */}
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
      marginTop: '4px', // Adjust space between the input and helper text
      marginLeft:"0px" 
    },

    }} />
  )}
  />

  <br/><br/><br/>
  
  <Typography variant="h6" className='UploadImages'>
  Upload 5 Images
</Typography>

<Grid container spacing={0} rowGap={2} columnGap={0} className="UploadGrid">
  {Array.from({ length: 5}).map((_, index) => (
    <Grid item xs={12} sm={6} md={4} lg={2.5} key={index} sx={{ height: "100px", overflow: "hidden" }}>
      <Controller
        name={`Images[${index}]`}
        control={control}
        render={({ field }) => (
          <Box className= 'UploadBox'
          >
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
                  height: "100%", // Button should take the full height
                  padding: 0,
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid black",
                  borderRadius: 0,
                  backgroundColor: "white", // Maintain background color consistency
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

{errors.Images && (
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
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY} libraries={["places"]}>
      
          {/* Autocomplete for District */}
          <Controller
            name="District"
            control={control}
            render={({ field }) => (
              <Autocomplete className='District'
                {...field}
                options={placeOptions} // Dynamically fetched options
                getOptionLabel={(option) => option.label || ""}
                value={placeOptions.find((option) => option.label === field.value) || null} // Bind the selected value
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
                    disabled={isSubmitting}
                    helperText={errors.District?.message}
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
    }, "& .MuiFormHelperText-root": {
    
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
              variant="outlined" sx={{ display:"relative","& .MuiOutlinedInput-root": {
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

export default AgricultureMachineForm