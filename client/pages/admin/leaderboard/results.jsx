'use strict';

const PropTypes = require('prop-types');
const React = require('react');
const Moment = require('moment');

const propTypes = {
    level: PropTypes.string,
    items: PropTypes.object,
    data: PropTypes.array,
    query: PropTypes.object,
    position: PropTypes.number
};


class Results extends React.Component {
    render() {

        let rowDescription;

        // Find out if we're sorting in reverse order
        let sortDescending = undefined;
        if ((this.props.query) && (typeof this.props.query.sort === 'string')) {
            if (this.props.query.sort === '-score') {
                sortDescending = true;
                rowDescription = 'Rank';
            }
            else if (this.props.query.sort === 'score') {
                sortDescending = false;
                rowDescription = 'Rank';
            }
            else {
                rowDescription = 'Row';
            }
        }
        else {
            rowDescription = 'Rank'; // Default sort is always -score
        }

        let count = 0;
        if ((this.props.items) && (typeof this.props.items.begin === 'number')) {
            if ((typeof sortDescending !== 'undefined') && (!sortDescending)) {
                count = (this.props.items.total - ((this.props.query.page - 1) * this.props.query.limit)) + 1;
            }
            else {
                count = this.props.items.begin - 1;
            }
        }

        let rows = [];
        if (Array.isArray(this.props.data)) {
            rows = this.props.data.map((record) => {

                const timestamp = record.timestamp;
                const score = record.score;

                let activeClass = '';
                if (count === this.props.position) {
                    activeClass = 'active-state';
                }

                if ((typeof sortDescending !== 'undefined') && (!sortDescending)) {
                    count -= 1;
                }
                else {
                    count += 1;
                }

                return (
                    <tr id={record.userId} className={activeClass} key={record._id}>
                        <td>{count}</td>
                        <td>{typeof record.username === 'undefined' ? '?' : record.username}</td>
                        <td className="timestamp">{Moment(timestamp).locale('en-gb').format('LLL')}</td>
                        <td>{score}</td>
                    </tr>
                );
            });
        }

        return (
            <div className="table-responsive leaderboard-table">
                <table className="table table-striped table-results">
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>{rowDescription}</th>
                            <th style={{ width: 'auto' }}>Username</th>
                            <th className="timestamp">Timestamp</th>
                            <th style={{ width: '15%' }}>Score</th>
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
