'use strict';

const Joi = require('joi');
const Async = require('async');
const MongoModels = require('mongo-models');


class Event extends MongoModels {

    static findByEvent(event, callback) {

        const query = { 'name': event.toLowerCase() };

        this.findOne(query, callback);
    }

}


Event.collection = 'events';


Event.schema = Joi.object().keys({
    _id: Joi.object(),
    name: Joi.string().token().lowercase().required(),
    description: Joi.string(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    isActive: Joi.boolean().default(false).required(),
    timestamp: Joi.date().required()
});


Event.indexes = [
    { key: { name: 1, unique: 1 } }
];


module.exports = Event;
