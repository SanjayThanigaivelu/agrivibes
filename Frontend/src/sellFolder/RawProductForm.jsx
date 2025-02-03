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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Link } from 'react-router-dom';
import wheat from '../assets/Banner/wheat-4.jpeg';
import { LoadScript } from "@react-google-maps/api";
import Autocomplete from "@mui/material/Autocomplete";
import { ToastContainer, toast } from 'react-toastify';
import banana from '../assets/PhoneScreen/BananaRes4.jpg'
import { format, parse, isValid } from "date-fns";
import { enGB } from "date-fns/locale";

const libraries = ["places"];

function RawProductForm() {
  
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
        NameOfProduct:yup
        .string()
        .required("Please Enter the Product Name")
        .matches(
            /^[a-zA-Z0-9 ]+$/,
            "Product can only contain alphabets, numbers, and spaces."
          )
          .max(35, "Product name must be at most 35 characters."),

      WeightinKg: yup
  .number()
  .required("Please enter the weight in kg.")
  .typeError("Weight must be a valid number.") // Ensures the input is a number
  .min(1, "Weight must be at least 1 kg.") // Minimum weight
  .max(1000, "Weight cannot exceed 1000 kg."),

 PackedOn: yup
   .date()
   .required("PackedOn date is required.")
   .typeError("PackedOn must be a valid date.") 
   .test(
     "withinLast3Years",
     "PackedOn date must be within the last 3 years but not a future date.",
     (value) => {
       if (!value) return false;
       const threeYearsAgo = new Date();
       threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
       const today = new Date();
       today.setHours(0, 0, 0, 0);
       return value >= threeYearsAgo && value <= today; // ✅ Fix: Allow today
     }
   ),

  ExpiryDate:yup
                 .date()
                 .required("Expiry Date  is required.")  // Ensure the field is required
                 .typeError("Expiry Date must be a valid date.")  // Ensure the field is a valid date
                 .test(
                   "validRange",
                   "Expiry Date must be between today and the next 3 years.",
                   (value) => {
                     if (!value) return false;  // Fail if no value is provided
                     const today = new Date();
                     const threeYearsFromNow = new Date();
                     threeYearsFromNow.setFullYear(today.getFullYear() + 3);
                     return value >= today && value <= threeYearsFromNow;  // Ensure the date is within range
                   }
                 ),
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
.min(0,"Price should not be zero or less than zero")
.max(8500000,"Price should not be greater than 8500000"),

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

     const theme = createTheme({
             components: {
               MuiOutlinedInput: {
                 styleOverrides: {
                   root: {
                     // Default border color when the input is not focused or hovered
                     "& .MuiOutlinedInput-notchedOutline": {
                       borderColor: "black", // Default border color
                     },
                     "&:hover .MuiOutlinedInput-notchedOutline": {
                       borderColor: "red", // Red border on hover if there's an error
                     },
                     // Focused border color will be controlled by the error state (red) or green if valid
                     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                       borderColor: "#66bb6a", // Green when focused and valid (if no error)
                     },
                   },
                 },
               },
               MuiInputLabel: {
                 styleOverrides: {
                   root: {
                     "&.Mui-focused": {
                       color: "#66bb6a", // Focused label color
                     },
                   },
                 },
               },
             },
           });
           


      const { handleSubmit,watch, control, formState: { errors },getValues,reset,setValue,trigger } = useForm({
          resolver: yupResolver(schema),
          defaultValues: {
        NameOfProduct: '', // Initialize with an empty string or default value
        WeightinKg: '',
          PackedOn: '',
          ExpiryDate: '',
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

//---------------------------------------------------------IMAGES---------------------------------------------------------------------
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


//------------------------------------------------------------------------------------------------------------------------------------
        const featuresValue = watch("Features", "");

        // Calculate the word count
        const wordCount = featuresValue.trim().split(/\s+/).filter(Boolean).length;

        const featuresValue1=watch("Description","");
        const wordCount1=featuresValue1.trim().split(/\s+/).filter(Boolean).length;
        const { category } = useParams();

//-----------------------------------------------DATA STORING---------------------------------------------------------------------------

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
             NameOfProduct: '', // Initialize with an empty string or default value
        WeightinKg: '',
          PackedOn: '',
          ExpiryDate: '',
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
              NameOfProduct: '', // Initialize with an empty string or default value
            WeightinKg: '',
          PackedOn: '',
          ExpiryDate: '',
          Description:'',
          setPrice:'',
          Images:Array(5).fill(null),
          State:'',
          District:'',
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
    <div className='rawProduct-full'>
    <div className="bannerImage">
    <div className="content">
          <h1>Agrivibes...Vibes of Modern Agriculture</h1>
          <h2>You Grow, We Sell</h2>
          </div>
    <Link to={" "}><img className='tractor' src={wheat} alt="RawProduct-Wheat"/></Link>
    <Link to={" "}><img className='tractor1' src={banana} alt="RawProduct-Banana"/></Link>
    </div>
<div className="bannerTitle"><h1>Sell Agriculture RawProduct</h1></div>
        <div className='heading'><h1>Post Your AD</h1></div>
        <div className='Form'>
         <br/>
         <Box component="form" onSubmit={handleSubmit(AllData)}  noValidate autoComplete="off"
           sx={{ '& .MuiTextField-root': { m: 1 } }}>

           <Controller
                     name="NameOfProduct"
                     control={control}
                     render={({ field }) => (
                       <TextField className='MachineName'
                       {...field}
                       error={!!errors.NameOfProduct}
              helperText={errors. NameOfProduct?.message}
              label="Product Name *"
              disabled={isSubmitting}
              variant="outlined" sx={{"& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.NameOfProduct ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.NameOfProduct ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
    marginLeft:"0px"
    }
    }} />
  )}
  />
<br/><br/><br/>
<Controller
                     name="WeightinKg"
                     control={control}
                     render={({ field }) => (
                       <TextField className='BrandName'
                       {...field}
                       error={!!errors. WeightinKg}
              helperText={errors. WeightinKg?.message}
              label="Weight in Kg*"
              disabled={isSubmitting}
              variant="outlined" sx={{"& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.WeightinKg? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.WeightinKg ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
    marginLeft:"0px"
    } 
    }} />
  )}
  />
  <br/><br/><br/>
  <ThemeProvider theme={theme}>
  <LocalizationProvider dateAdapter={AdapterDateFns} locale={enGB}>
  <Controller
  name="PackedOn"
  control={control}
  render={({ field, fieldState }) => (
    <DatePicker
      className="DatePicker"
      {...field}
      label="Packed On *"
      disableFuture
      inputFormat="dd/MM/yyyy"
      mask="__/__/____"
      minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 3))}
      value={
        field.value && isValid(new Date(field.value)) 
          ? new Date(field.value) 
          : null
      }
      onChange={(value) => {
        if (!value || isNaN(value.getTime())) {
          field.onChange(null);
          return;
        }
        field.onChange(value); 
      }}
      renderInput={(params) => (
        <TextField
          className="DatePicker"
          {...params}
          error={fieldState?.isTouched && !!fieldState?.error}
          helperText={fieldState?.isTouched && fieldState?.error?.message}
          disabled={isSubmitting}
          variant="outlined"
        />
      )}
    />
  )}
/>
  </LocalizationProvider>
</ThemeProvider>
  <br/><br/><br/>
 <ThemeProvider theme={theme}>
   <LocalizationProvider dateAdapter={AdapterDateFns} locale={enGB}> 
     <Controller
       name="ExpiryDate"
       control={control}
       render={({ field, fieldState }) => {
         return (
           <DatePicker
             className="DatePicker"
             {...field}
             label="Expiry Date*"
             inputFormat="dd/MM/yyyy" 
             mask="__/__/____"
             minDate={new Date()} 
             maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 3))}
             value={
               field.value && isValid(parse(field.value, "dd/MM/yyyy", new Date())) 
                 ? parse(field.value, "dd/MM/yyyy", new Date()) 
                 : null
             }
             onChange={(value) => {
               if (!value || isNaN(value.getTime())) { // Ensure value is valid
                 field.onChange(null);
                 return;
               }
               const formattedDate = format(value, "dd/MM/yyyy"); 
               field.onChange(formattedDate);
             }}
             renderInput={(params) => (
               <TextField
                 className="DatePicker"
                 {...params}
                 error={!!fieldState.error} 
                 helperText={fieldState.error?.message} 
                 variant="outlined"
                 sx={{
                   "& .MuiOutlinedInput-root": {
                     "& .MuiOutlinedInput-notchedOutline": {
                       borderColor: fieldState.error ? "red" : "black",
                     },
                   },
                 }}
               />
             )}
           />
         );
       }}
     />
   </LocalizationProvider>
</ThemeProvider>

        <br/><br/><br/>

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
        sx={{
          color: "gray",
        }}
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
              variant="outlined" sx={{ "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.setPrice ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.setPrice ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
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
      error={!!errors.State} 
      sx={{"& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.State? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.State ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
    marginLeft:"0px"
    }
    }}>
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
            onChange={(e) => field.onChange(e.target.value)}
            disabled={isSubmitting}
          >
            {statesList.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      <FormHelperText sx={{marginLeft:"0px"}}>{errors.State?.message}</FormHelperText>
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
              variant="outlined" sx={{ "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.Address ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.Address ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
    marginLeft:"0px",
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
              variant="outlined" sx={{"& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: errors.PinCode ? 'red' : '#66bb6a', // Green for correct validation
      }
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: errors.PinCode ? 'red' : '#66bb6a', // Green for label color
    }, "& .MuiFormHelperText-root": {
      marginTop: '4px', // Adjust space between the input and helper text
    marginLeft:"0px"
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

export default RawProductForm