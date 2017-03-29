const mongoose = require('mongoose');


const exerciseDataSchema = mongoose.Schema({
    userId: { type: String, required: true },
    exerciseData: { type: Object, required: true },
});

exerciseDataSchema.methods.apiRepr = () => ({
    id: this.id,
    userId: this.projectName,
    exerciseData: this.exerciseData,
});

const ExerciseData = mongoose.model('exercise_datas', exerciseDataSchema);

module.exports = ExerciseData;
