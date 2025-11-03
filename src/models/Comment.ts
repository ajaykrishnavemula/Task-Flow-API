import mongoose, { Schema } from 'mongoose';
import { IComment, ICommentAttachment } from '../interfaces/Comment';

// Comment attachment schema
const CommentAttachmentSchema: Schema = new Schema<ICommentAttachment>({
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Comment schema
const CommentSchema: Schema = new Schema<IComment>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    attachments: [CommentAttachmentSchema],
    mentions: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  { timestamps: true }
);

// Add attachment method
CommentSchema.methods.addAttachment = async function (
  attachment: ICommentAttachment
): Promise<void> {
  this.attachments.push(attachment);
  await this.save();
};

// Remove attachment method
CommentSchema.methods.removeAttachment = async function (
  attachmentId: string
): Promise<void> {
  this.attachments = this.attachments.filter(
    (attachment: ICommentAttachment & { _id?: mongoose.Types.ObjectId }) =>
      attachment._id && attachment._id.toString() !== attachmentId
  );
  await this.save();
};

// Add mention method
CommentSchema.methods.addMention = async function (
  userId: mongoose.Types.ObjectId
): Promise<void> {
  if (!this.mentions.includes(userId)) {
    this.mentions.push(userId);
    await this.save();
  }
};

// Remove mention method
CommentSchema.methods.removeMention = async function (
  userId: mongoose.Types.ObjectId
): Promise<void> {
  this.mentions = this.mentions.filter(
    (id: mongoose.Types.ObjectId) => id.toString() !== userId.toString()
  );
  await this.save();
};

// Comment reaction schema
const CommentReactionSchema: Schema = new Schema({
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reaction: {
    type: String,
    enum: ['👍', '👎', '❤️', '😂', '😮', '😢', '🎉'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to ensure a user can only have one reaction per comment
CommentReactionSchema.index({ comment: 1, user: 1 }, { unique: true });

// Create models
const Comment = mongoose.model<IComment>('Comment', CommentSchema);
const CommentReaction = mongoose.model('CommentReaction', CommentReactionSchema);

export { Comment, CommentReaction };

// Made with Bob
