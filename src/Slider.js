import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rheostat from 'rheostat';
import 'rheostat/initialize';
import 'rheostat/css/rheostat.css';
import './scss/Slider.scss';

class Slider extends Component {
    getParsedRange() {
        const { max, min, value, rangeStringSeparator } = this.props;

        const parts = value.split(rangeStringSeparator);

        if (parts.length === 2) {
            return parts.map((n) => (Number(n)));
        }

        if (value.indexOf(rangeStringSeparator) === 0) {
            return [
                min,
                Number(parts[0])
            ];
        }

        return [
            Number(parts[0]),
            max
        ];
    }

    getValues() {
        const { min, max, value, range, rangeStringSeparator } = this.props;

        if (!value) {
            return range ? [min, max] : [min];
        }

        if (range && rangeStringSeparator) {
            return this.getParsedRange();
        }

        return range ? value : [Number(value)];
    }

    pitComponent({ style, children }) {
        return (
            <div
                style={{
                    ...style,
                    background: '#B2B2B2',
                    width: 1,
                    height: children % 10 === 0 ? 6 : 4,
                    top: 20,
                }}
            />
        );
    }

    renderSlider() {
        const { min, max, onUpdate, rangeStringSeparator, ticks, width } = this.props;

        const pitConfig = ((t) => {
            if (!t) {
                return {};
            }
            return {
                pitComponent: this.pitComponent,
                pitPoints: t
            };
        })(ticks);

        return (
            <div
                className="orizzonte__slider-wrapper"
                style={{
                    width: width ? `${ width }px` : null
                }}
            >
                <Rheostat
                    max={ max }
                    min={ min }
                    onValuesUpdated={ (slider) => {
                        const { values } = slider;

                        if (rangeStringSeparator && values.length === 2) {
                            return onUpdate(
                                values.map((n) => (String(n))).join(rangeStringSeparator)
                            );
                        }

                        return onUpdate(
                            values.length === 2 ? values : values[0]
                        );
                    }}
                    values={ this.getValues() }
                    { ...pitConfig }
                />
            </div>
        );
    }

    renderCaption() {
        const { label } = this.props;

        if (!label) {
            return null;
        }

        return (
            <div
                className="orizzonte__filter-caption"
            >
                { label }
            </div>
        );
    }

    render() {
        return (
            <div
                className="orizzonte__filter"
            >
                { this.renderCaption() }
                { this.renderSlider() }
            </div>
        );
    }
}

Slider.displayName = 'OrizzonteSlider';

Slider.propTypes = {
    disabled: PropTypes.bool,
    /** Label for this filter section */
    label: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    /** Internal callback for when filter value has changed */
    onUpdate: PropTypes.func,
    /** Symbol to prefix the values with (e.g. currency) */
    prefix: PropTypes.string,
    /** Whether to show a date range picker or a single day picker */
    range: PropTypes.bool,
    /** When using a range separator, the range will be stored as (separated) string */
    rangeStringSeparator: PropTypes.string,
    ticks: PropTypes.array,
    /** The selected value */
    value: PropTypes.array,
    width: PropTypes.number
};

Slider.defaultProps = {
    disabled: false,
    label: null,
    max: 100,
    min: 1,
    onUpdate: () => {},
    prefix: null,
    range: false,
    rangeStringSeparator: null,
    ticks: null,
    value: [1],
    width: 300
};

export default Slider;
