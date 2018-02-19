import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import windowSize from 'react-window-size';

import './ChartInfo.css';

import {
  InfoColumnHOC,
  LoadingWrapper,
  PpmChart,
  Loading,
  ActiveListWrapper,
  Navigation,
} from '../../components';

import { queryDateRange } from './utils';

import {
  fetchCurrentPpms,
  fetchMonthWeekPpms,
  fetchYearPpms,
  fetchAllPpms,
  fetchAndCalcProjectionPpms,
  fetchOnePriorPpm,
} from './redux/actions';

import { ppmInfoAllSelector, ppmInfoSelector } from './redux/selectors';

import {
  timeHeaderLinks,
  WEEK,
  MONTH,
  YEAR,
  FIVE_YEAR,
  PROJECTION,
  ALL,
} from '../../constants';

const todaysDate = moment().format('YYYY-MM-DD');

const PpmResizedChart = windowSize(PpmChart);

export class ChartInfo extends Component {
  state = {
    rangeType: FIVE_YEAR, // Intitial date range query type
  };

  componentDidMount() {
    // query for current ppm
    this.props.fetchCurrentPpms();
    // Query for five years
    this.queryApi(this.state.rangeType);
  }

  queryApi = (rangeType) => {
    // Need to check if data exists
    const shouldUpdate = this.props[rangeType].length <= 0;
    // Only get query the api if no data exists
    switch (rangeType) {
      case WEEK: {
        if (shouldUpdate) {
          const endpoint = queryDateRange(todaysDate, WEEK, 1);
          this.props.fetchMonthWeekPpms({ rangeType, endpoint });
        }
        break;
      }
      case MONTH: {
        if (shouldUpdate) {
          const endpoint = queryDateRange(todaysDate, MONTH, 1);
          this.props.fetchMonthWeekPpms({ rangeType, endpoint });
        }
        break;
      }
      case YEAR: {
        if (shouldUpdate) {
          const endpoint = queryDateRange(todaysDate, YEAR, 1);
          this.props.fetchYearPpms({ rangeType, endpoint });
        }
        break;
      }
      case FIVE_YEAR: {
        if (shouldUpdate) {
          const endpoint = queryDateRange(todaysDate, YEAR, 5);
          this.props.fetchYearPpms({ rangeType, endpoint });
        }
        break;
      }
      case PROJECTION: {
        if (shouldUpdate) {
          // For calculating the average rate of ppm increase
          const endpoint = `${queryDateRange(todaysDate, YEAR, 5)}&limit=1`; // TODO - don't hardcode to 5 years
          this.props.fetchOnePriorPpm({ rangeType, endpoint });

          // For drawing the graph
          this.props.fetchAndCalcProjectionPpms();
        }
        break;
      }
      default: {
        if (shouldUpdate) {
          this.props.fetchAllPpms();
        }
      }
    }
  };

  handlePpmClick = (rangeType) => {
    // only call api when the rangeType has changed.
    if (rangeType !== this.state.rangeType) {
      this.setState({ rangeType }, () => {
        this.queryApi(this.state.rangeType);
      });
    }
  };

  render() {
    const { currentPpm, priorDatePpm, loading } = this.props;
    const { rangeType } = this.state;
    return (
      <div>
        <div className="menu-container">
          <Navigation
            menu={
              <ActiveListWrapper
                className="time-choice-header"
                items={timeHeaderLinks}
                onClick={this.handlePpmClick}
              />
            }
          />
        </div>
        <div>
          <InfoColumnHOC
            data={this.props[rangeType]}
            rangeType={rangeType}
            currentPpm={currentPpm}
            priorDatePpm={priorDatePpm}
          />
          <div className="graph-container">
            <LoadingWrapper
              loading={loading}
              renderLoading={() => <Loading />}
              renderDiv={() =>
                (this.props[rangeType].length > 0 ? (
                  <PpmResizedChart
                    data={this.props[rangeType]}
                    rangeType={rangeType}
                  />
                ) : null)
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.ppmInfo.loading,
  error: state.ppmInfo.error,
  [WEEK]: ppmInfoSelector(state, WEEK),
  [MONTH]: ppmInfoSelector(state, MONTH),
  [YEAR]: ppmInfoSelector(state, YEAR),
  [FIVE_YEAR]: ppmInfoSelector(state, FIVE_YEAR),
  [ALL]: ppmInfoAllSelector(state, ALL),
  [PROJECTION]: ppmInfoAllSelector(state, PROJECTION),
  currentPpm: state.ppmInfo.currentPpm,
  priorDatePpm: state.ppmInfo.priorDatePpm,
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchCurrentPpms,
      fetchMonthWeekPpms,
      fetchYearPpms,
      fetchAllPpms,
      fetchAndCalcProjectionPpms,
      fetchOnePriorPpm,
    },
    dispatch,
  );
export default connect(mapStateToProps, mapDispatchToProps)(ChartInfo);
ChartInfo.propTypes = {
  loading: PropTypes.bool.isRequired,
  currentPpm: PropTypes.number.isRequired,
  priorDatePpm: PropTypes.number.isRequired,
  fetchCurrentPpms: PropTypes.func.isRequired,
  fetchMonthWeekPpms: PropTypes.func.isRequired,
  fetchYearPpms: PropTypes.func.isRequired,
  fetchAllPpms: PropTypes.func.isRequired,
  fetchAndCalcProjectionPpms: PropTypes.func.isRequired,
  fetchOnePriorPpm: PropTypes.func.isRequired,
  error: PropTypes.string, // eslint-disable-line
}; // TODO: Update the above create error handling issue
ChartInfo.defaultProps = {
  error: '',
  loading: true,
  currentPpm: 0,
  priorDatePpm: 0,
  [WEEK]: [],
  [MONTH]: [],
  [YEAR]: [],
  [FIVE_YEAR]: [],
  [ALL]: [],
  [PROJECTION]: [],
  queryApi: () => {},
  fetchCurrentPpms: () => {},
  fetchMonthWeekPpms: () => {},
  fetchYearPpms: () => {},
  fetchAllPpms: () => {},
  fetchAndCalcProjectionPpms: () => {},
  fetchOnePriorPpm: () => {},
};
