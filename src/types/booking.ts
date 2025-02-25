import { Types } from 'mongoose';

export interface CreateBookingBody {
  tour: Types.ObjectId;
  passengers: number;
  customer: {
    name: string;
    phone: string;
  };
}

export interface UpdateBookingStatusBody {
  status: 'pending' | 'confirmed' | 'cancelled';
} 