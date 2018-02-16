'use strict';

const Joi = require('joi');
const Async = require('async');
const MongoModels = require('mongo-models');


class Event extends MongoModels {

    static create(name, callback) {

        const document = {
            name,
            description: '',
            isActive: false,
            timestamp: new Date()
        };

        this.insertOne(document, (err, docs) => {

            if (err) {
                return callback(err);
            }

            callback(null, docs[0]);
        });
    }

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
    isActive: Joi.boolean().default(false).required(),
    timestamp: Joi.date().required()
});


Event.indexes = [
    { key: { name: 1, unique: 1 } }
];


module.exports = Event;
