import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { globalSubHeader, currentVsTippingSubHeader, untilTippingSubHeader, hardcodedTippingPoint, FIVE_YEAR, ALL, PROJECTION } from '../../constants';
import './infoColumn.css';
import { calculatePercentageDiff, calculateAverageRate, calculateDiff, calculateYearsUntil } from './utils';

const calculateSubHeader = (rangeType = '') => {
  const formatStr = str => str.replace('_', ' ');
  return {
    diffPPMSubHeader: `IN THE PAST ${rangeType ? formatStr(rangeType) : ''}`,
    diffAveragePPMSubHeader: `AVERAGE RATE IN THE LAST ${
      rangeType === PROJECTION ? formatStr(FIVE_YEAR) : ''
    }`,
    diffPercentSubHeader: `IN THE PAST ${
      rangeType ? formatStr(rangeType) : ''
    } (%)`,
  };
};

export const InfoColDiv = ({ statInfo, subHeader }) => (
  <div className="info-col">
    <div className="info-wrapper">
      <div className="stat-info"> {statInfo} </div>
      <div className="sub-header"> {subHeader} </div>
    </div>
  </div>
);
InfoColDiv.propTypes = {
  statInfo: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  subHeader: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};
InfoColDiv.defaultProps = {
  statInfo: '',
  subHeader: '',
};
// TODO: Should we be passing data or just first item ????
class InfoColumnHOC extends Component {
  constructor(props) {
    super(props);
    const { diffPPMSubHeader, diffAveragePPMSubHeader, diffPercentSubHeader } = calculateSubHeader();
    this.state = {
      ppmDiff: 0,
      diffPPMSubHeader,
      diffAveragePPMSubHeader,
      ppmPercentDiff: 0,
      diffPercentSubHeader,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rangeType !== ALL) {
      this.updatePpmDiffInfo(nextProps.data, nextProps.rangeType);
    }
  }

  updatePpmDiffInfo = (data = [], rangeType) => {
    const previous = data[0] ? data[0].ppm : 0;
    const { currentPpm, priorDatePpm } = this.props;
    const { diffPPMSubHeader, diffAveragePPMSubHeader, diffPercentSubHeader } = calculateSubHeader(
      rangeType,
    );

    const ppmAverageRateDiff = calculateAverageRate(priorDatePpm, currentPpm, 5); // TODO - no hard coding to five years
    const yearsUntilTipping = calculateYearsUntil(currentPpm, hardcodedTippingPoint, ppmAverageRateDiff);

    this.setState({
      ppmDiff: `${calculateDiff(previous, previous ? currentPpm : 0)} PPM`,
      ppmPercentDiff: `${calculatePercentageDiff(
        previous,
        previous ? currentPpm : 0,
      )} %`,
      diffPPMSubHeader,
      diffAveragePPMSubHeader,
      diffPercentSubHeader,
      ppmAverageRateDiff: `${ppmAverageRateDiff} PPM / YEAR`,
      yearsUntilTipping: `${yearsUntilTipping} YEARS`,
    });
  };

  render() {
    const { rangeType, currentPpm } = this.props;
    const {
      ppmDiff,
      diffPPMSubHeader,
      diffAveragePPMSubHeader,
      ppmPercentDiff,
      diffPercentSubHeader,
      ppmAverageRateDiff,
      yearsUntilTipping,
    } = this.state;
    if (rangeType !== ALL && rangeType !== PROJECTION) {
      return (
        <div className="flex-grid">
          <InfoColDiv
            statInfo={`${currentPpm} PPM`}
            subHeader={globalSubHeader}
          />
          <InfoColDiv statInfo={ppmDiff} subHeader={diffPPMSubHeader} />
          <InfoColDiv
            statInfo={ppmPercentDiff}
            subHeader={diffPercentSubHeader}
          />
        </div>
      );
    } else if (rangeType === ALL) {
      return (
        <div className="flex-grid">
          <InfoColDiv
            statInfo={`${currentPpm} PPM`}
            subHeader={globalSubHeader}
          />
        </div>
      );
    }
    return (
      <div className="flex-grid">
        <InfoColDiv
          statInfo={`${currentPpm} / ${hardcodedTippingPoint} PPM`}
          subHeader={currentVsTippingSubHeader}
        />
        <InfoColDiv
          statInfo={ppmAverageRateDiff}
          subHeader={diffAveragePPMSubHeader}
        />
        <InfoColDiv
          statInfo={yearsUntilTipping}
          subHeader={untilTippingSubHeader}
        />
      </div>
    );
  }
}
InfoColumnHOC.propTypes = {
  rangeType: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  currentPpm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  priorDatePpm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default InfoColumnHOC;
