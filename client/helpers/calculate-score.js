module.exports = function(data) {
    const elapsed = (new Date() - data.start) / 1000;
    const TIMEOUT = 90, POINTS = 5;

    let matched = 0;
    if ((typeof data.flips.matched !== 'undefined') && (!isNaN(data.flips.matched))) {
        matched = data.flips.matched;
    }

    let wrong = 0;
    if ((typeof data.flips.wrong !== 'undefined') && (!isNaN(data.flips.wrong))) {
        matched = data.flips.wrong;
    }

    let score = 0;
    switch(data.level) {
        case "casual":
            score = Math.round(((matched * POINTS) - wrong) * (TIMEOUT - elapsed));
            break;
        case "medium":
            score = Math.round(((matched * POINTS) - wrong) * (TIMEOUT - elapsed));
            break;
        case "hard":
            score = Math.round(((matched * POINTS) - wrong) * (TIMEOUT - elapsed));
            break;
        default:
            // Do nothing
    }

    return score;
}
