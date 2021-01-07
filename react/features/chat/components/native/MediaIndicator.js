// @flow

import React from 'react';
import { TouchableOpacity } from 'react-native';

import IndicatorIcon from './IndicatorIcon';

type Props = {
    isMuted?: boolean,
    icon: string,
    muteIcon?: string,
    isModerator?: boolean,
    onClick?: () => void
};

/**
 * MediaIndicator render specific icon indicator based on data.
 *
 * @private
 * @param {Props} props - Props of component.
 * @returns {ReactElement}
 */
function MediaIndicator({
    isMuted,
    icon,
    muteIcon,
    isModerator,
    onClick
}: Props) {
    if (isMuted) {
        return <IndicatorIcon icon = { muteIcon } />;
    }

    if (isModerator && onClick) {
        return (
            <TouchableOpacity onPress = { onClick }>
                <IndicatorIcon icon = { icon } />
            </TouchableOpacity>
        );
    }

    return <IndicatorIcon icon = { icon } />;
}

export default MediaIndicator;
