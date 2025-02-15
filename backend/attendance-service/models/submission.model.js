import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }, // Lớp học
    userEmail: { type: String, required: true },  // Người nộp
    userName:{ type: String, required: true },
    title: { type: String, required: true }, // Tiêu đề đơn
    content: { type: String, required: true }, // Nội dung đơn
    evidence: { type: String }, // Link đến ảnh minh chứng (upload file)
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }, // Trạng thái
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    fromDate: { type: Date, default: Date.now },
    toDate: { type: Date, default: Date.now },
    imageUrl: {type:String}
});

export const Submission = mongoose.model('Submission', submissionSchema);