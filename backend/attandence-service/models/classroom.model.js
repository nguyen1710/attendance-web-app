const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
  owner: {type: String, require: true},
  name: { type: String, required: true },       
  description: { type: String, default: "" },  
  teacherEmails: [{                                   
    type: String,
    ref: "User",
    required: true,
  }],
  studentEmails: [{                                
    type: String,
    ref: "User",
  }],
  createdAt: { type: Date, default: Date.now }, 
  updatedAt: { type: Date, default: Date.now }, 
});

const Classroom = mongoose.model("Classroom", ClassroomSchema);

module.exports = Classroom;