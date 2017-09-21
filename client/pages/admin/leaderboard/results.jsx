'use strict';

const PropTypes = require('prop-types');
const React = require('react');
const ReactRouter = require('react-router-dom');


const Link = ReactRouter.Link;
const propTypes = {
    data: PropTypes.array,
    difficulty: PropTypes.string
};


class Results extends React.Component {
    render() {

        const level = this.props.difficulty;
        let count = 0;
        const rows = this.props.data.map((record) => {

            const timestamp = record.timestamp;
            const score = record.score;
            count += 1;

            return (
                <tr key={record._id}>
                    <td>{count}</td>
                    <td>{record.username}</td>
                    <td>{timestamp}</td>
                    <td>{score}</td>
                </tr>
            );
        });

        return (
            <div className="table-responsive leaderboard-table">
                <table className="table table-striped table-results">
                    <thead>
                        <tr>
                            <th style={{width: '10%'}}>Rank</th>
                            <th style={{width: 'auto'}}>Username</th>
                            <th style={{width: '10%'}}>Timestamp</th>
                            <th style={{width: '15%'}}>Highscore</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

Results.propTypes = propTypes;


module.exports = Results;
