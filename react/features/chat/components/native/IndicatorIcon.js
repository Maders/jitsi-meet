// @flow

import React from 'react';

import { BaseIndicator } from '../../../base/react';

import styles from './styles';

type Props = {

    /**
     * The name of the icon to be used as the indicator.
     */
    icon: string,

};

/**
 * Handles clicking / pressing the button, and opens the appropriate dialog.
 *
 * @private
 * @param {Props} props - Props of component.
 * @returns {ReactElement}
 */
function IndicatorIcon(props: Props) {
    return (<BaseIndicator
        icon = { props.icon }
        iconStyle = { styles.indicatorIcon } />);
}

export default IndicatorIcon;
