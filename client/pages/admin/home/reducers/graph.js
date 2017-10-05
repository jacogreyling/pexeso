'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const Moment = require('moment');

const initialState = {
    hydrated: false,
    realtimeData: [],
    data: {
        datasets: [{
            label: 'Casual',
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(83, 187, 212, 0.4)',
            borderColor: 'rgba(83, 187, 212, 1)',
            borderWidth: 2,
            borderCapStyle: 'round',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'round',
            pointRadius: 0,
            pointHitRadius: 10,
            pointBorderColor: 'rgba(83, 187, 212, 1)',
            pointBackgroundColor: 'rgba(83, 187, 212, 0.4)',
            pointBorderWidth: 2,
            pointHoverRadius: 2,
            pointHoverBackgroundColor: 'rgba(83, 187, 212, 1)',
            pointHoverBorderColor: 'rgba(83, 187, 212, 0.4)',
            pointHoverBorderWidth: 4,
            xAxisID: 'timeline',
            yAxisID: 'rounds',
            data: []
        },
        {
            label: 'Medium',
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(87, 193, 180, 0.4)',
            borderColor: 'rgba(87, 193, 180, 1)',
            borderWidth: 2,
            borderCapStyle: 'round',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'round',
            pointRadius: 0,
            pointHitRadius: 10,
            pointBorderColor: 'rgba(87, 193, 180, 1)',
            pointBackgroundColor: 'rgba(87, 193, 180, 0.4)',
            pointBorderWidth: 2,
            pointHoverRadius: 2,
            pointHoverBackgroundColor: 'rgba(87, 193, 180, 1)',
            pointHoverBorderColor: 'rgba(87, 193, 180, 0.4)',
            pointHoverBorderWidth: 4,
            xAxisID: 'timeline',
            yAxisID: 'rounds',
            data: []
        },
        {
            label: 'Hard',
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(255, 201, 28, 0.4)',
            borderColor: 'rgba(255, 201, 28, 1)',
            borderWidth: 2,
            borderCapStyle: 'round',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'round',
            pointRadius: 0,
            pointHitRadius: 10,
            pointBorderColor: 'rgba(255, 201, 28, 1)',
            pointBackgroundColor: 'rgba(255, 201, 28, 0.4)',
            pointBorderWidth: 2,
            pointHoverRadius: 2,
            pointHoverBackgroundColor: 'rgba(255, 201, 28, 1)',
            pointHoverBorderColor: 'rgba(255, 201, 28, 0.4)',
            pointHoverBorderWidth: 4,
            xAxisID: 'timeline',
            yAxisID: 'rounds',
            data: []
        }]
    }
};
const reducer = function (state = initialState, action) {


    if (action.type === Constants.GET_GAME_SCORES) {

        return ObjectAssign({}, state, {
            hydrated: false
        });
    }

    if (action.type === Constants.GET_GAME_SCORES_RESPONSE) {

        if (action.err) {

            return ObjectAssign({}, state, {
                hydrated: true
            })
        }

        const time = Moment();
        const data = {
            casual: [],
            medium: [],
            hard: []
        };

        // Create temp placeholder for counts
        const tmpData = {
            casual: {},
            medium: {},
            hard: {}
        };

        // Iterate the response array
        for (let item of action.response) {

            const interval = Moment(item.interval).format('H:mm');

            tmpData[item.level][interval] = item.count;

        }

        // Now process 60 minutes and fill in the gaps!
        for (let i = 0; i < 60; ++i) {

            const interval = time.format('H:mm');

            for (let level of ['casual', 'medium', 'hard']) {

                data[level].push({
                    t: Moment(time),
                    y: typeof tmpData[level][interval] !== 'undefined' ? tmpData[level][interval] : 0
                });
            }

            // Take away 1 second, and continue...
            time.subtract(1, 'minute');
        }

        // Create new return object
        let b = ObjectAssign({}, state, {
            hydrated: true,
        });

        // Assign the new data points to the dataset array
        b.data.datasets[0].data = data.casual;
        b.data.datasets[1].data = data.medium;
        b.data.datasets[2].data = data.hard;

        return b;
    }

    if (action.type === Constants.ADD_GAMES_WON) {

        return ObjectAssign({}, state, {
            realtimeData: [...state.realtimeData, action.data]
        });
    }

    if (action.type === Constants.UPDATE_DATASETS) {

        const data = {
            casual: [...state.data.datasets[0].data],
            medium: [...state.data.datasets[1].data],
            hard: [...state.data.datasets[2].data]
        }

        for (let level of ['casual', 'medium', 'hard']) {

            for (let item in action.tmpData[level]) {

                // If it's the same timeslice, just add the count
                if (data[level][0].t.format('H:mm') === action.tmpData[level][item].timestamp.format('H:mm')) {

                    data[level][0].y += action.tmpData[level][item].count;
                }
                else if (data[level][1].t.format('H:mm') === action.tmpData[level][item].timestamp.format('H:mm')) {

                    data[level][1].y += action.tmpData[level][item].count;
                }
                // It's a new timeslice, add it to the array
                else {

                    data[level].unshift({
                        t: Moment(action.tmpData[level][item].timestamp),
                        y: typeof action.tmpData[level][item].count !== 'undefined' ? action.tmpData[level][item].count : 0
                    });
                }
            }

            // We can only have 60 elements at all times (60 minutes)
            while (data[level].length > 60) {
                data[level].pop();
            }
        }

        let b = ObjectAssign({}, state, {
            realtimeData: []
        });

        // Assign the new data points to the dataset array
        b.data.datasets[0].data = data.casual;
        b.data.datasets[1].data = data.medium;
        b.data.datasets[2].data = data.hard;

        return b;
    }


    return state;
};


module.exports = reducer;
