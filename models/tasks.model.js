const mongoose = require("mongoose");
const tasksSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    required: true,
    enum: ["Done", "Archived", "Pending", "Working", "Review"],
    default: "Pending",
  },
  assignedTo: { type: mongoose.SchemaTypes.ObjectId, ref: "Users" },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  isDeleted: { type: Boolean, default: false },
});

tasksSchema.pre("save", function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  next();
});
tasksSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Task = mongoose.model("Tasks", tasksSchema);

module.exports = Task;
