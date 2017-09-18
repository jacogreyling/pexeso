module.exports = function(array) {
    let arrayLength = array.length;
    let shuffleArray =[];
    let reshuffleArray =[];
    let sourceArray = array;

    while (arrayLength !== 0 ) {

        //reduce the remaining elements by 1
        let remainingElements = arrayLength--;

        // Pick a remaining element…
        let randomElement = Math.floor(Math.random() * remainingElements);

        //move random element in to shuffle array
        shuffleArray.push(sourceArray.splice(randomElement, 1)[0]);

        // Find tiles next to each other
        if (shuffleArray.length > 2){
            let length = shuffleArray.length;
            if (shuffleArray[(length - 2)].id == shuffleArray[(length - 1)].rel){
                reshuffleArray.push(length-1);
            }
        }
    }
   
    //move tiles that were next to each other
    reshuffleArray.forEach(function(element) {
        //Tile to Move
        let elementToMove = shuffleArray.splice(element,1)[0];

        //New Position 
        let newPosition = Math.floor(Math.random() * (shuffleArray.length - reshuffleArray.length));

        //Insert Element @ New Position
        shuffleArray.splice(newPosition, 0, elementToMove);
    });

    return shuffleArray;
}
