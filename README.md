
# AgriVibes - Agriculture E-commerce Platform

AgriVibes is an advanced agriculture e-commerce platform built using the **MERN (MongoDB, Express.js, React.js, Node.js) stack**. The platform enables seamless buying and selling of agricultural products while ensuring a user-friendly experience.

---
## Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/SanjayThanigaivelu/agrivibes/agrivibes.git
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Navigate to the respective directory:**
   ```sh
   cd Frontend   # For frontend setup
   cd Backend    # For backend setup
   ```
4. **Start the frontend and backend servers:**
   ```sh
   npm run start
   ```
   This will launch both the frontend and backend services.

---
## Features

✔️ **Diverse Product Categories** – Supports six different agricultural product categories.
✔️ **Dedicated Product Pages** – Each product has a separate, detailed page.
✔️ **User Dashboard** – Users can edit, delete, and manage their posted products.
✔️ **Organic Farming Insights** – Special page offering valuable farming insights.
✔️ **Secure Authentication** – OTP-based registration and login for enhanced security.
✔️ **Location-Based Search** – Products are displayed based on location and search criteria.
✔️ **Responsive Design** – Works seamlessly on all electronic devices.
✔️ **Cookie-Based Session Management** – Avoids unnecessary logins for an enhanced user experience.
✔️ **Easy Buying & Selling Process** – Simplifies transactions and minimizes conflicts.
✔️ **Dynamic Image Handling** – Uses `require.context` for dynamic image imports.

---
## API Documentation

Below is a summary of the APIs used in AgriVibes:

| API Endpoint | Method | Description |
|-------------|--------|-------------|
| `/sell/upload-product` | **POST** | Uploads product details and images |
| `/sell/getProduct` | **GET** | Retrieves all products |
| `/sell/retrieve` | **POST** | Retrieves products based on search and location |
| `/sell/retrieveAll` | **POST** | Retrieves all products based on location |
| `/images/:id` | **GET** | Fetches product images |
| `/loginUser` | **POST** | Handles user login |
| `/registerUser` | **POST** | Handles new user registration |
| `/logout` | **POST** | Logs out the user |

---
## Dynamic Image Handling

AgriVibes dynamically loads images using `require.context` in React. This method allows for efficient and optimized image imports, reducing unnecessary bundle size while ensuring a smooth user experience.

---
## Technologies Used

- **Frontend:** React.js, Material UI, React Hook Form
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** OTP-based login with Nodemailer
- **APIs Used:** Google Maps API for search functionality
- **File Storage:** Multer and GridFS for handling images

---
## Contact & Demo

🔗 **Portfolio:** [Visit my Portfolio](https://myfirstportfolioweb.netlify.app/)

🚀 **Live Demo:** [Click Here to Try](https://agrivibes.netlify.app/agri)

For any inquiries or contributions, feel free to raise an issue or contact me.

---
### 🛠 Contributing

We welcome contributions! Feel free to fork the repository, submit pull requests, or report issues.

---
### 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.


