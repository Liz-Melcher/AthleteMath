console.log("Test data is loaded");

const testData = {
    // Laps-based workouts
    ladder: {
        startLaps: 2,
        changeLaps: 1,
        restLaps: 1,
        rounds: 5,
        endingLaps: null,
        goalTotalLaps: null
    },
    ss: {
        startLaps: 3,
        restLaps: 2,
        rounds: 4,
        goalTotalLaps: null
    },

    // Time-based workouts
    "ladder-time": {
        startTime: 1.5,          // 1.5 minutes
        changeTime: 0.5,         // 0.5-minute increase per round
        restTime: 0.5,           // 30 seconds (converted to 0.5 minutes)
        roundsTime: 5,           // 5 rounds
        endingTime: null,
        goalTotalTime: null
    },
    "ss-time": {
        startTime: 1.5,          // 1.5 minutes
        restTime: 0.5,           // 30 seconds (converted to 0.5 minutes)
        roundsTime: 4,           // 4 rounds
        goalTotalTime: null
    }
};
