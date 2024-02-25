const { Given, When, Then } = require("@cucumber/cucumber");

let exercises = [];

const addExercise = (name, duration) => {
    const existingExercise = exercises.find(exercise => exercise.name === name);
    if (existingExercise) {
        return { success: false, message: 'Exercise already exists' };
    }
    exercises.push({ name, duration });
    return { success: true };
}

const updateExercise = (name, duration) => {
    const exercise = exercises.find(exercise => exercise.name === name);
    if (exercise) {
        exercise.duration = duration;
        return { success: true };
    }
    return { success: false, message: 'Exercise not found' };
}

const deleteExercise = (name) => {
    const index = exercises.findIndex(exercise => exercise.name === name);
    if (index !== -1) {
        exercises.splice(index, 1);
        return { success: true };
    }
    return { success: false, message: 'Exercise not found' };
}

const getExercises = () => {
    return exercises;
}

Given('I have an exercise', function () {
    exercises = [{ name: "Running", duration: 30 }];
});

When('I get all exercises', function () {
    this.exercises = getExercises();
});

Then('I should see my exercise in the list', function () {
    if (this.exercises.length !== 1) {
        throw new Error("Exercise list should have one exercise");
    }
});

Given('I have no exercises', function () {
    exercises = [];
});

When('I add an exercise', function () {
    this.addResult = addExercise("Running", 30);
});

Then('the exercise should be added to my list', function () {
    if (!this.addResult.success) {
        throw new Error("Exercise was not added successfully");
    }
    if (exercises.length !== 1) {
        throw new Error("Exercise list should have one exercise");
    }
});

Given('I have added an exercise named {string}', function (name) {
    this.addResult = addExercise(name, 30);
});

When('I try to add another exercise named {string}', function (name) {
    this.addResult = addExercise(name, 30);
});

Then('I should see an error message that the exercise already exists', function () {
    if (this.addResult.success || this.addResult.message !== 'Exercise already exists') {
        throw new Error("Expected an error message that the exercise already exists");
    }
});

When('I update the {string} exercise to last {int} minutes', function (name, duration) {
    this.updateResult = updateExercise(name, duration);
});

Then('the {string} exercise should show a duration of {int} minutes', function (name, duration) {
    const exercise = exercises.find(exercise => exercise.name === name);
    if (!exercise || exercise.duration !== duration) {
        throw new Error(`Expected the ${name} exercise to show a duration of ${duration} minutes`);
    }
});

When('I delete the {string} exercise', function (name) {
    this.deleteResult = deleteExercise(name);
});

Then('the {string} exercise should no longer be in my list', function (name) {
    const exercise = exercises.find(exercise => exercise.name === name);
    if (exercise) {
        throw new Error(`Expected the ${name} exercise to no longer be in the list`);
    }
});