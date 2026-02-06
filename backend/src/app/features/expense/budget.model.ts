import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
    userId: mongoose.Types.ObjectId;
    monthlyLimit: number;
    month: string;
    createdAt: Date;
    updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        monthlyLimit: {
            type: Number,
            required: true,
            min: 0,
        },
        month: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema);
