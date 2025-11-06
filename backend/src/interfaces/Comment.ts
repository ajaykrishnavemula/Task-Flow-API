import { Document, Types } from 'mongoose';

/**
 * Comment attachment interface
 */
export interface ICommentAttachment {
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
}

/**
 * Comment interface
 */
export interface IComment extends Document {
  task: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  attachments: ICommentAttachment[];
  mentions: Types.ObjectId[];
  isEdited: boolean;
  editedAt?: Date;
  parentComment?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  addAttachment(attachment: ICommentAttachment): Promise<void>;
  removeAttachment(attachmentId: string): Promise<void>;
  addMention(userId: Types.ObjectId): Promise<void>;
  removeMention(userId: Types.ObjectId): Promise<void>;
}

/**
 * Comment reaction interface
 */
export interface ICommentReaction extends Document {
  comment: Types.ObjectId;
  user: Types.ObjectId;
  reaction: '👍' | '👎' | '❤️' | '😂' | '😮' | '😢' | '🎉';
  createdAt: Date;
}

