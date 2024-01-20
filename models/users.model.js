const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["Employee", "Manager"],
    default: "Employee",
  },
});

const User = mongoose.model("Users", usersSchema);

module.exports = User;
