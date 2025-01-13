import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  receiver: { type: String, required: true }, // Người nhận thông báo
  classId: {type: String},
  sender: { type: String, required: true },   // Nội dung thông báo
  title: { type: String, required: true },   // Nội dung thông báo
  className: { type: String, required: true },   // Nội dung thông báo
  status: { type: String, default: 'Unread' }, // Trạng thái: Đọc hoặc chưa đọc
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo thông báo
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
