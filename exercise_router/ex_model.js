const mongoose = require('mongoose');


const exerciseDataSchema = mongoose.Schema({
    user: { type: String, required: true },
    exerciseData: {},
});

exerciseDataSchema.methods.apiRepr = () => ({
    id: this.id,
    user: this.projectName,
    exerciseData: this.exerciseData,
});

const ExerciseData = mongoose.model('exercise_data', exerciseDataSchema);

module.exports = ExerciseData;
