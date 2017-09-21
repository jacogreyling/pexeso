'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');


class Score extends MongoModels {

    static findByUserId(userId, callback) {

        const query = { 'userId': userId.toLowerCase() };

        this.find(query, callback);
    }
}


Score.collection = 'scores';


Score.schema = Joi.object().keys({
    _id: Joi.object(),
    userId: Joi.object().required(),
    score: Joi.number().integer().required(),
    level: Joi.string().required(),
    timestamp: Joi.date().required()
});


Score.indexes = [
    { key: { userId: 1, level: 1 } },
    { key: { userId: 1 } }
];


module.exports = Score;
