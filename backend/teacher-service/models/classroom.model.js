const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
  name: { type: String, required: true },        
  description: { type: String, default: "" },  
  teacherId: {                                   
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentIds: [{                                
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now }, 
});

const Classroom = mongoose.model("Classroom", ClassroomSchema);

module.exports = Classroom;