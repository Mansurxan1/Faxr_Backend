import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: [String],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true, // количество ночей
  },
  destinations: [
    {
      city: {
        type: String,
        required: true,
      },
      nights: {
        type: Number,
        required: true,
      },
    },
  ],
  price: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    perPerson: {
      type: Boolean,
      default: true,
    },
  },
  included: [
    {
      type: String, // например: "перелет", "трансфер", "проживание" и т.д.
    },
  ],
  hotels: [
    {
      name: {
        type: String,
        required: true,
      },
      stars: {
        type: Number,
        min: 1,
        max: 5,
      },
      city: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model("Tour", tourSchema);
