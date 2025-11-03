import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser, IUserProfile } from '../interfaces/User';
import config from '../config';

// User profile schema
const UserProfileSchema = new Schema({
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters'],
  },
  website: {
    type: String,
    trim: true,
    match: [
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please provide a valid URL',
    ],
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters'],
  },
  position: {
    type: String,
    trim: true,
    maxlength: [100, 'Position cannot be more than 100 characters'],
  },
  skills: {
    type: [String],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 20; // Maximum 20 skills
      },
      message: 'Users cannot have more than 20 skills',
    },
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [
      /^(\+\d{1,3}[- ]?)?\d{10}$/,
      'Please provide a valid phone number',
    ],
  },
  dateOfBirth: {
    type: Date,
  },
  socialLinks: {
    twitter: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    facebook: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
  },
});

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't include password in query results by default
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not supported',
      },
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    
    // Phase 2 enhancements
    profile: {
      type: UserProfileSchema,
      default: {},
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function (): string {
  const payload = {
    userId: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
  };
  
  return jwt.sign(
    payload,
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn } as SignOptions
  );
};

// Generate email verification token
UserSchema.methods.generateVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  // Token expires in 24 hours
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  return verificationToken;
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // Token expires in 10 minutes
  this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
  
  return resetToken;
};

export default mongoose.model<IUser>('User', UserSchema);

// Made with Bob
