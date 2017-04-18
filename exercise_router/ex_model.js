const mongoose = require('mongoose');


const exerciseDataSchema = mongoose.Schema({
    userId: { type: String, required: true },
    exerciseData: { type: Object, required: true },
}, { minimize: false });

const ExerciseData = mongoose.model('exercise_datas', exerciseDataSchema);

module.exports = ExerciseData;
