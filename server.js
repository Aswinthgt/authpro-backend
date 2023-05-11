const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoute = require("./routes/authRoutes");
const profileRoute = require("./routes/profileRoutes");
const  adminRoute  = require('./routes/adminRoutes');
const userRoute = require('./routes/userRoutes');
const fast2sms = require("fast-two-sms");
const unirest = require("unirest");

const app = express();

app.use(cors());
app.use(express.static("/uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.use("/auth", authRoute);
app.use("/profile", profileRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);


app.post("/sms", async (req, res) => {
try{
  var sms = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

  sms.query({
    "authorization": process.env.OTP_AUTH,
    "variables_values": "2299",
    "route": "otp",
    "numbers": "9999999999"
  });
  
  sms.headers({
    "cache-control": "no-cache"
  });
  
  
  sms.end(function (ress) {
    if (ress.error) {
      console.log(ress.error);
    }
  
    console.log(ress.body);
  });
}catch(e){
  console.log(e);
}
  


})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
