import React from 'react';
import Orizzonte, { Group } from 'orizzonte';
import Slider from 'orizzonte-slider';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withInfo } from '@storybook/addon-info';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withState } from '@dump247/storybook-state';
import 'orizzonte/dist/orizzonte.min.css';

const stories = storiesOf('Orizzonte Calendar', module);

// eslint-disable-next-line react/prop-types
const component = ({ store }) => {
    const { groups, query } = store.state;

    return (
        <Orizzonte
            query={ query }
            groupTopLabels
            onChange={ (queryObject) => {
                console.log(queryObject);
                store.set({
                    query: queryObject
                });
            }}
            onGroupAdd={ () => {
                console.log('Add group');
            }}
            onGroupRemove={ () => {
                console.log('Remove group');
            }}
        >
            {
                groups.map((group, i) => {
                    const { filters, ...rest } = group;

                    return (
                        <Group
                            key={ `${ group.name }-${ i }` }
                            { ...rest }
                        >
                            { filters }
                        </Group>
                    );
                })
            }
        </Orizzonte>
    );
};

stories.add('Default', withState({
    query: {},
    groups: [{
        included: true,
        label: 'Price range slider',
        filters: [
            <Slider
                prefix="$"
                fieldName="pricerange"
                key="1"
                selectedLabel={ (value) => {
                    const parts = value.split('__');

                    if (parts.length === 1) {
                        if (value.indexOf('__') === 0) {
                            parts.unshift(null);
                        } else {
                            parts.push(null);
                        }
                    }

                    if (!parts[0] && parts[1]) {
                        return `Until $${ parts[1] }`;
                    }
                    if (parts[0] && !parts[1]) {
                        return `From $${ parts[0] }`;
                    }

                    return `$${ parts[0] } — $${ parts[1] }`;
                }}
                ticks={[...Array(19).keys()].map(i => (i + 1) * 5)}
                rangeStringSeparator="__"
                range
            />
        ]
    }]
})(
    withInfo()(component)
));
