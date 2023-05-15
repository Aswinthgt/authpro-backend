const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoute = require("./routes/authRoutes");
const profileRoute = require("./routes/profileRoutes");
const adminRoute = require('./routes/adminRoutes');
const userRoute = require('./routes/userRoutes');
const { verifyToken } = require("./config/secret");




const app = express();

app.use(cors());
app.use(express.static("/uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use((req, res, next) => {
  const authPath = req.path.split("/")[1];
  if(authPath === "auth") {
    return next();
  }
  verifyToken(req,res,next);
})


app.use("/auth", authRoute);
app.use("/profile", profileRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
