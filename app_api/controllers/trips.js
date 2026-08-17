const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');
const { asyncHandler } = require('../middleware/errorHandler');
const tripIndex = require('../utils/tripIndex');

// GET all trips
const tripsList = asyncHandler(async (req, res) => {
  const trips = await Trip.find({});
  res.status(200).json(trips);
});

const tripsSearch = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(200).json([]);
  const matchingCodes = tripIndex.search(q);
  if (matchingCodes.length === 0) return res.status(200).json([]);
  const trips = await Trip.find({ code: { $in: matchingCodes } });
  res.status(200).json(trips);
});

// GET aggregate report: trips grouped by resort with average price and length
const tripsReportByResort = asyncHandler(async (req, res) => {
  const report = await Trip.aggregate([
    {
      // "length" is stored as text (e.g. "5 days"), so pull the leading
      // number out into a real numeric field before averaging it.
      $addFields: {
        lengthDays: {
          $convert: {
            input: { $arrayElemAt: [{ $split: ['$length', ' '] }, 0] },
            to: 'int',
            onError: null,
            onNull: null
          }
        }
      }
    },
    {
      $group: {
        _id: '$resort',
        tripCount: { $sum: 1 },
        avgPricePerPerson: { $avg: '$perPerson' },
        avgLengthDays: { $avg: '$lengthDays' }
      }
    },
    {
      $project: {
        _id: 0,
        resort: '$_id',
        tripCount: 1,
        avgPricePerPerson: { $round: ['$avgPricePerPerson', 2] },
        avgLengthDays: { $round: ['$avgLengthDays', 1] }
      }
    },
    { $sort: { resort: 1 } }
  ]);
  res.status(200).json(report);
});

// GET single trip by code
const tripsReadOne = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ code: req.params.tripCode });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  res.status(200).json(trip);
});

// POST add new trip
const tripsAddTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.create({
    code: req.body.code,
    name: req.body.name,
    length: req.body.length,
    start: req.body.start,
    resort: req.body.resort,
    perPerson: req.body.perPerson,
    image: req.body.image,
    description: req.body.description
  });
  tripIndex.addTrip(trip);
  res.status(201).json(trip);
});

// PUT update trip
const tripsUpdateTrip = asyncHandler(async (req, res) => {
  const oldTrip = await Trip.findOne({ code: req.params.tripCode });
  if (!oldTrip) return res.status(404).json({ message: 'Trip not found' });

  const trip = await Trip.findOneAndUpdate(
    { code: req.params.tripCode },
    req.body,
    { new: true, runValidators: true }
  );
  tripIndex.updateTrip(oldTrip, trip);
  res.status(200).json(trip);
});

// DELETE trip
const tripsDeleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOneAndDelete({ code: req.params.tripCode });
  if (!trip) return res.status(404).json({ message: 'Trip not found' });
  tripIndex.removeTrip(trip);
  res.status(200).json({ message: 'Trip deleted' });
});

module.exports = {
  tripsList,
  tripsSearch,
  tripsReportByResort,
  tripsReadOne,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};