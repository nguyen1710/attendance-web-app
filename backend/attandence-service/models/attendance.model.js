import mongoose from "mongoose";

const attendanceSessionSchema = new mongoose.Schema({
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  owner: {type: String},
  name: {type: String},
  desc: {type:String},
  date: { type: Date, default: Date.now },
  attendees: [{ email: String, photo: String }],
  nonAttendees: [String],  // Danh sách email chưa điểm danh
});

const AttendanceSession = mongoose.model('AttendanceSession', attendanceSessionSchema);
export default AttendanceSession;