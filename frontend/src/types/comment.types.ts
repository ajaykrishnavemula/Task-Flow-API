// Comment types based on backend Comment model

export interface CommentAttachment {
  _id?: string;
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
}

export interface Comment {
  _id: string;
  task: string;
  user: string;
  content: string;
  attachments: CommentAttachment[];
  mentions: string[];
  isEdited: boolean;
  editedAt?: Date;
  parentComment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentData {
  task: string;
  content: string;
  mentions?: string[];
  parentComment?: string;
}

export interface UpdateCommentData {
  content: string;
  mentions?: string[];
}

export type CommentReaction = '👍' | '👎' | '❤️' | '😂' | '😮' | '😢' | '🎉';

export interface CommentReactionData {
  comment: string;
  user: string;
  reaction: CommentReaction;
  createdAt: Date;
}

export interface AddReactionData {
  commentId: string;
  reaction: CommentReaction;
}

