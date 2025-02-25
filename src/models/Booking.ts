import { Schema, model, Document, Types } from 'mongoose';
import { ITour } from './Tour';

interface ICustomer {
  name: string;
  email: string;
  phone: string;
}

export interface IBooking extends Document {
  tour: Types.ObjectId | ITour;
  customer: ICustomer;
  passengers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  tour: {
    type: Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  passengers: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

bookingSchema.index({ tour: 1, createdAt: -1 });

export default model<IBooking>('Booking', bookingSchema); 