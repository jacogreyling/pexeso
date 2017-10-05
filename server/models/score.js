'use strict';

const Joi = require('joi');
const Async = require('async');
const MongoModels = require('mongo-models');


class Score extends MongoModels {

    static findByUserId(userId, callback) {

        const query = { 'userId': userId.toLowerCase() };

        this.find(query, callback);
    }

    static pagedAggregate(filter, fields, lookup, sort, limit, page, callback) {

        const self = this;
        const output = {
            data: undefined,
            pages: {
                current: page,
                prev: 0,
                hasPrev: false,
                next: 0,
                hasNext: false,
                total: 0
            },
            items: {
                limit,
                begin: ((page * limit) - limit) + 1,
                end: page * limit,
                total: 0
            }
        };

        sort = this.sortAdapter(sort);

        // Build the aggregate pipeline
        const pipeline = [
            {
                $match: filter
            },
            {
                $sort: sort
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            },
            {
                $lookup: lookup
            },
            {
                $project: fields
            }
        ];

        Async.auto({
            count: function (done) {

                self.count(filter, done);
            },
            find: function (done) {

                self.aggregate(pipeline, done);
            }
        }, (err, results) => {

            if (err) {
                return callback(err);
            }

            output.data = results.find;
            output.items.total = results.count;

            // paging calculations
            output.pages.total = Math.ceil(output.items.total / limit);
            output.pages.next = output.pages.current + 1;
            output.pages.hasNext = output.pages.next <= output.pages.total;
            output.pages.prev = output.pages.current - 1;
            output.pages.hasPrev = output.pages.prev !== 0;
            if (output.items.begin > output.items.total) {
                output.items.begin = output.items.total;
            }
            if (output.items.end > output.items.total) {
                output.items.end = output.items.total;
            }

            callback(null, output);
        });
    }

    static groupAggregate(filter, group, fields, sort, callback) {

        const self = this;

        // Build the aggregate pipeline
        const pipeline = [
            {
                $match: filter
            },
            {
                $group: group
            },
            {
                $project: fields
            },
            {
                $sort: sort
            }
        ];

        self.aggregate(pipeline, (err, results) => {

            if (err) {
                return callback(err);
            }

            callback(null, results);
        });
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
