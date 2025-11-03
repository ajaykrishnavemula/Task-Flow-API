import mongoose, { Schema } from 'mongoose';
import { ITask, ISubtask, IAttachment, IRecurrenceRule } from '../interfaces/Task';

// Subtask schema
const SubtaskSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Subtask name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

// Attachment schema
const AttachmentSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Recurrence rule schema
const RecurrenceRuleSchema = new Schema({
  frequency: {
    type: String,
    enum: {
      values: ['daily', 'weekly', 'monthly', 'yearly'],
      message: '{VALUE} is not a valid frequency',
    },
    required: [true, 'Frequency is required for recurring tasks'],
  },
  interval: {
    type: Number,
    default: 1,
    min: [1, 'Interval must be at least 1'],
  },
  endDate: {
    type: Date,
  },
  count: {
    type: Number,
    min: [1, 'Count must be at least 1'],
  },
  daysOfWeek: {
    type: [Number],
    validate: {
      validator: function(v: number[]) {
        return v.every(day => day >= 0 && day <= 6);
      },
      message: 'Days of week must be between 0 (Sunday) and 6 (Saturday)',
    },
  },
  dayOfMonth: {
    type: Number,
    min: [1, 'Day of month must be at least 1'],
    max: [31, 'Day of month cannot be more than 31'],
  },
  monthOfYear: {
    type: Number,
    min: [0, 'Month of year must be between 0 (January) and 11 (December)'],
    max: [11, 'Month of year must be between 0 (January) and 11 (December)'],
  },
});

const TaskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Task name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot be more than 5000 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not supported',
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      validate: {
        validator: function(v: string[]) {
          return v.length <= 10; // Maximum 10 tags
        },
        message: 'Tasks cannot have more than 10 tags',
      },
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    assignedTo: {
      type: [mongoose.Types.ObjectId],
      ref: 'User',
    },
    
    // Phase 2 enhancements
    subtasks: {
      type: [SubtaskSchema],
      default: [],
      validate: {
        validator: function(v: ISubtask[]) {
          return v.length <= 20; // Maximum 20 subtasks
        },
        message: 'Tasks cannot have more than 20 subtasks',
      },
    },
    dependencies: {
      type: [mongoose.Types.ObjectId],
      ref: 'Task',
      default: [],
    },
    attachments: {
      type: [AttachmentSchema],
      default: [],
      validate: {
        validator: function(v: IAttachment[]) {
          return v.length <= 10; // Maximum 10 attachments
        },
        message: 'Tasks cannot have more than 10 attachments',
      },
    },
    isMarkdown: {
      type: Boolean,
      default: false,
    },
    
    // Recurring task properties
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrenceRule: {
      type: RecurrenceRuleSchema,
    },
    parentTaskId: {
      type: mongoose.Types.ObjectId,
      ref: 'Task',
    },
    
    // Task status tracking
    startDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    estimatedTime: {
      type: Number,
      min: [0, 'Estimated time cannot be negative'],
    },
    actualTime: {
      type: Number,
      min: [0, 'Actual time cannot be negative'],
    },
  },
  { timestamps: true }
);

// Add index for better query performance
TaskSchema.index({ createdBy: 1, name: 1 });
TaskSchema.index({ dueDate: 1 }, { sparse: true });
TaskSchema.index({ category: 1 }, { sparse: true });
TaskSchema.index({ tags: 1 }, { sparse: true });
TaskSchema.index({ isRecurring: 1 }, { sparse: true });
TaskSchema.index({ parentTaskId: 1 }, { sparse: true });
TaskSchema.index({ 'subtasks.completed': 1 }, { sparse: true });

// Update completedAt when task is marked as completed
TaskSchema.pre('save', function(this: ITask, next) {
  if (this.isModified('completed') && this.completed) {
    this.completedAt = new Date();
  } else if (this.isModified('completed') && !this.completed) {
    this.completedAt = undefined;
  }
  next();
});

// Middleware to check for circular dependencies
TaskSchema.pre('save', async function(this: ITask, next) {
  if (!this.dependencies || this.dependencies.length === 0) {
    return next();
  }
  
  // Check if this task is in its own dependency chain
  const taskId = this._id;
  const visited = new Set<string>();
  const queue = [...this.dependencies.map(id => id.toString())];
  
  while (queue.length > 0) {
    const currentId = queue.shift();
    
    if (currentId === taskId.toString()) {
      return next(new Error('Circular dependency detected'));
    }
    
    if (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      
      // Find dependencies of the current task
      const task = await mongoose.model<ITask>('Task').findById(currentId);
      if (task && task.dependencies && task.dependencies.length > 0) {
        queue.push(...task.dependencies.map(id => id.toString()));
      }
    }
  }
  
  next();
});

export default mongoose.model<ITask>('Task', TaskSchema);

// Made with Bob
