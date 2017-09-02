module.exports = function(data) {
    const elapsed = (new Date() - data.timestamp) / 1000;

    let score = 0;
    switch(data.level) {
        case "casual":
            score = Math.round(((data.flips.matched * 5) - data.flips.wrong) * (90 - elapsed));
            if (score > data.highscores.casual) {
                data.highscores.casual = score;
            }
            break;
        case "medium":
            score = Math.round(((data.flips.matched * 5) - data.flips.wrong) * (90 - elapsed));
            if (score > data.highscores.medium) {
                data.highscores.medium = score;
            }
            break;
        case "hard":
            score = Math.round(((data.flips.matched * 5) - data.flips.wrong) * (90 - elapsed));
            if (score > data.highscores.hard) {
                data.highscores.hard = score;
            }
            break;
        default:
            // Do nothing
    }
}
