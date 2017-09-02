'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');


class Stat extends MongoModels {
    static create(userId, stats, callback) {

        const document = {
            userId: userId,
            figures: {
                won: stats.figures.won,
                lost: stats.figures.lost,
                abandoned: stats.figures.abandoned
            },
            highscores: {
                casual: stats.highscores.casual,
                medium: stats.highscores.medium,
                hard: stats.highscores.hard
            },
            flips: {
                total: stats.flips.total,
                matched: stats.flips.matched,
                wrong: stats.flips.wrong
            },
            lastPlayed: new Date()
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


Stat.collection = 'stats';


Stat.schema = Joi.object().keys({
    _id: Joi.object(),
    userId: Joi.string().lowercase().required(),
    figures: Joi.object().keys({
        won: Joi.number().integer(),
        lost: Joi.number().integer(),
        abandoned: Joi.number().integer()
    }),
    highscores: Joi.object().keys({
        casual: Joi.number().integer(),
        medium: Joi.number().integer(),
        hard: Joi.number().integer()
    }),
    flips: Joi.object().keys({
        total: Joi.number().integer(),
        mmatched: Joi.number().integer(),
        wrong: Joi.number().integer()
    }),
    lastPlayed: Joi.date()
});


Stat.indexes = [
    { key: { userId: 1, unique: 1 } }
];


module.exports = Stat;
