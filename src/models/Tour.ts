import { Schema, model, Document } from 'mongoose';

interface IHotel {
  name: string;
  stars: number;
  city: string;
}

interface IDestination {
  city: string;
  nights: number;
}

interface IPrice {
  amount: number;
  currency: string;
  perPerson: boolean;
}

export interface ITour extends Document {
  name: string;
  startDate: Date;
  duration: number;
  destinations: IDestination[];
  price: IPrice;
  included: string[];
  hotels: IHotel[];
}

const tourSchema = new Schema<ITour>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  destinations: [{
    city: {
      type: String,
      required: true
    },
    nights: {
      type: Number,
      required: true
    }
  }],
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    perPerson: {
      type: Boolean,
      default: true
    }
  },
  included: [{
    type: String
  }],
  hotels: [{
    name: {
      type: String,
      required: true
    },
    stars: {
      type: Number,
      min: 1,
      max: 5
    },
    city: {
      type: String,
      required: true
    }
  }]
});

export default model<ITour>('Tour', tourSchema); 