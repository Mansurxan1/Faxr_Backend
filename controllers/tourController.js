import Tour from '../models/Tour.js';
import asyncHandler from "../middleware/asyncHandler.js";

export const getAllTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).json({
    status: 'success',
    data: tours
  });
});

export const getTourById = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  
  if (!tour) {
    res.status(404);
    throw new Error('Тур не найден');
  }
  
  res.status(200).json({
    status: 'success',
    data: tour
  });
});

export const createTour = asyncHandler(async (req, res) => {
  const newTour = await Tour.create(req.body);
  
  if (!newTour) {
    res.status(400);
    throw new Error('Неверные данные тура');
  }

  res.status(201).json({
    status: 'success',
    data: newTour
  });
});

export const updateTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!tour) {
    res.status(404);
    throw new Error('Тур не найден');
  }

  res.status(200).json({
    status: 'success',
    data: tour
  });
});

export const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    res.status(404);
    throw new Error('Тур не найден');
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 