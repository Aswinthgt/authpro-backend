const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoute = require("./routes/authRoutes");
const profileRoute = require("./routes/profileRoutes");
const adminRoute = require('./routes/adminRoutes');
const userRoute = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.static("/uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use("/auth", authRoute);
app.use("/profile", profileRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
