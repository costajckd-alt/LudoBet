const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://costajc_kd_user:Namirdo8002@cluster0.pyzgezf.mongodb.net/ludobet?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {
  console.log("MongoDB conectado");
})
.catch((err) => {
  console.log(err);
});

module.exports = mongoose;