module.exports = function(data) {
    const end = new Date();
    const POINTS = 5;

    let matched = 0;
    if ((typeof data.flips.matched !== 'undefined') && (!isNaN(data.flips.matched))) {
        matched = data.flips.matched;
    }

    let wrong = 0;
    if ((typeof data.flips.wrong !== 'undefined') && (!isNaN(data.flips.wrong))) {
        wrong = data.flips.wrong;
    }

    let score = 0;
    if ((typeof data.timeout !== 'undefined') && (!isNaN(data.timeout))) {

        // If the end time is before the start time, something went wrong!
        let elapsed = data.timeout;
        if (end > data.start) {
            elapsed = (end - data.start) / 1000;
        }

        score = Math.round(((matched * POINTS) - wrong) * (data.timeout - elapsed));
    }

    return score;
}
