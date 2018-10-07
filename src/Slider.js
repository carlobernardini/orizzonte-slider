import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rheostat from 'rheostat';
import 'rheostat/initialize';
import 'rheostat/css/rheostat.css';
import './scss/Slider.scss';

const Caption = ({ children }) => {
    if (!children) {
        return null;
    }

    return (
        <div
            className="orizzonte__filter-caption"
        >
            { children }
        </div>
    );
};

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
        const { min, max, onUpdate, rangeStringSeparator, sliderProps, ticks, width } = this.props;

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
                    onChange={ (slider) => {
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
                    { ...sliderProps }
                />
            </div>
        );
    }

    renderLabels() {
        const { hideLabels, postfix, prefix } = this.props;

        if (hideLabels) {
            return null;
        }

        const values = this.getValues();

        return (
            <ul
                className="orizzonte__slider-labels"
            >
                { values.map((v) => (
                    <li
                        className="orizzonte__slider-label"
                    >
                        { `${ prefix || '' }${ v }${ postfix || '' }` }
                    </li>
                ))}
            </ul>
        );
    }

    render() {
        const { label } = this.props;

        return (
            <div
                className="orizzonte__filter"
            >
                <Caption>
                    { label }
                </Caption>
                { this.renderSlider() }
                { this.renderLabels() }
            </div>
        );
    }
}

Slider.displayName = 'OrizzonteSlider';

Slider.propTypes = {
    disabled: PropTypes.bool,
    hideLabels: PropTypes.bool,
    /** Label for this filter section */
    label: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    /** Internal callback for when filter value has changed */
    onUpdate: PropTypes.func,
    /** Symbol to postfix the values with (e.g. distance unit) */
    postfix: PropTypes.string,
    /** Symbol to prefix the values with (e.g. currency unit) */
    prefix: PropTypes.string,
    /** Whether to show a date range picker or a single day picker */
    range: PropTypes.bool,
    /** When using a range separator, the range will be stored as (separated) string */
    rangeStringSeparator: PropTypes.string,
    /** Optional props to be passed on to the rheostat component */
    sliderProps: PropTypes.object,
    /** Array of points on which to render ticks */
    ticks: PropTypes.array,
    /** The selected value */
    value: PropTypes.array,
    width: PropTypes.number
};

Slider.defaultProps = {
    disabled: false,
    hideLabels: false,
    label: null,
    max: 100,
    min: 1,
    onUpdate: () => {},
    postfix: null,
    prefix: null,
    range: false,
    rangeStringSeparator: null,
    sliderProps: {},
    ticks: null,
    value: [1],
    width: 300
};

Caption.propTypes = {
    children: PropTypes.string
};

Caption.defaultProps = {
    children: null
};

export default Slider;
