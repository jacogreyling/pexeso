'use strict';

module.exports = function (array) {

    let arrayLength = array.length;
    const shuffleArray = [];
    const reshuffleArray = [];
    const sourceArray = array;

    while (arrayLength !== 0 ) {

        // Reduce the remaining elements by 1
        const remainingElements = arrayLength--;

        // Pick a remaining element…
        const randomElement = Math.floor(Math.random() * remainingElements);

        // Move random element in to shuffle array
        shuffleArray.push(sourceArray.splice(randomElement, 1)[0]);

        // Find tiles next to each other
        if (shuffleArray.length > 2){
            const length = shuffleArray.length;
            if (shuffleArray[(length - 2)].id === shuffleArray[(length - 1)].rel){
                reshuffleArray.push(length - 1);
            }
        }
    }

    // Move tiles that were next to each other
    reshuffleArray.forEach((element) => {
        // Tile to move
        const elementToMove = shuffleArray.splice(element,1)[0];

        // New Position
        const newPosition = Math.floor(Math.random() * (shuffleArray.length - reshuffleArray.length));

        // Insert element @ new position
        shuffleArray.splice(newPosition, 0, elementToMove);
    });

    return shuffleArray;
};
