'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');


class Statistic extends MongoModels {
    static create(userId, stats, callback) {

        const document = {
            userId: userId,
            figures: {
                won: stats.figures.won,
                lost: stats.figures.lost,
                abandoned: stats.figures.abandoned
            },
            highscores: {
                casual: {
                    score: stats.highscores.casual.score,
                    timestamp: undefined
                },
                medium: {
                    score: stats.highscores.medium.score,
                    timestamp: undefined
                },
                hard: {
                    score: stats.highscores.hard.score,
                    timestamp: undefined
                }
            },
            flips: {
                total: stats.flips.total,
                matched: stats.flips.matched,
                wrong: stats.flips.wrong
            },
            lastPlayed: undefined
        };

        this.insertOne(document, (err, docs) => {

            if (err) {
                return callback(err);
            }

            callback(null, docs[0]);
        });
    }

    static findByUserId(userId, callback) {

        const query = { 'userId': userId.toLowerCase() };

        this.findOne(query, callback);
    }
}


Statistic.collection = 'statistics';


Statistic.schema = Joi.object().keys({
    _id: Joi.object(),
    userId: Joi.string().lowercase().required(),
    figures: Joi.object().keys({
        won: Joi.number().integer(),
        lost: Joi.number().integer(),
        abandoned: Joi.number().integer()
    }).required(),
    highscores: Joi.object().keys({
        casual: Joi.object().keys({
            score: Joi.number().integer(),
            timestamp: Joi.date()
        }),
        medium: Joi.object().keys({
            score: Joi.number().integer(),
            timestamp: Joi.date()
        }),
        hard: Joi.object().keys({
            score: Joi.number().integer(),
            timestamp: Joi.date()
        }),
    }).required(),
    flips: Joi.object().keys({
        total: Joi.number().integer(),
        matched: Joi.number().integer(),
        wrong: Joi.number().integer()
    }).required(),
    lastPlayed: Joi.date().required()
});


Statistic.indexes = [
    { key: { userId: 1, unique: 1 } }
];


module.exports = Statistic;
