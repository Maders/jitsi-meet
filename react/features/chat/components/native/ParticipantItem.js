// @flow

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { compose } from 'redux';
import type { Dispatch } from 'redux';

import {
    createRemoteVideoMenuButtonEvent,
    sendAnalytics
} from '../../../analytics';
import { Avatar } from '../../../base/avatar';
import { openDialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import {
    IconMicDisabled,
    IconMicrophone,
    IconCameraDisabled,
    IconRaisedHand,
    IconCamera,
    IconKick
} from '../../../base/icons';
import { MEDIA_TYPE } from '../../../base/media';
import { isLocalParticipantModerator } from '../../../base/participants';
import { Container } from '../../../base/react';
import { connect } from '../../../base/redux';
import { getTrackByMediaTypeAndParticipant } from '../../../base/tracks';
import {
    KickRemoteParticipantDialog,
    MuteRemoteParticipantDialog
} from '../../../remote-video-menu';

import MediaIndicator from './MediaIndicator';
import styles from './styles';

type Participant = {
    id: string,
    name: string,
    avatar?: string,
    role?: string,
    local: boolean,
    pinned?: boolean,
    dominantSpeaker?: boolean,
    email?: string,
    isFakeParticipant?: Boolean,
    raisedHand?: Boolean,
};

type Props = {
    _audioMuted: boolean,
    _videoMuted: boolean,
    _isLocalParticipantModerator: Boolean,
    dispatch: Dispatch<any>,
};

/**
 * ParticipantItem render participant item in chat section.
 *
 * @param {Props} props - Props of component.
 * @returns {ReactElement}
 */
function ParticipantItem(props: Props & { participant: Participant }) {
    const {
        _audioMuted,
        _videoMuted,
        _isLocalParticipantModerator,
        participant,
        dispatch
    } = props;
    const participantID = participant.id;
    const isFakeParticipant = participant.isFakeParticipant;
    const isRaisedHand = Boolean(participant.raisedHand);
    const isLocalParticipant = Boolean(participant.local);
    const hasName = Boolean(participant.name);
    const isModeratorAndisNotLocalParticipant
        = _isLocalParticipantModerator && !isLocalParticipant;

    /**
     * Handle mute sound.
     *
     * @private
     * @returns {void}
     */
    function _handleMute() {
        sendAnalytics(
            createRemoteVideoMenuButtonEvent('mute.button', {
                // eslint-disable-next-line camelcase
                participant_id: participantID
            })
        );

        dispatch(openDialog(MuteRemoteParticipantDialog, { participantID }));
    }

    /**
     * Handle kick participant.
     *
     * @private
     * @returns {void}
     */
    function _handleKick() {
        dispatch(openDialog(KickRemoteParticipantDialog, { participantID }));
    }

    if (isFakeParticipant) {
        return null;
    }

    return (
        <View>
            <Container style = { styles.thumbnailIndicatorContainer }>
                {isModeratorAndisNotLocalParticipant && (
                    <MediaIndicator
                        icon = { IconKick }
                        isModerator = { isModeratorAndisNotLocalParticipant }
                        onClick = { _handleKick } />
                )}
                {isRaisedHand && <MediaIndicator icon = { IconRaisedHand } />}
                <MediaIndicator
                    icon = { IconMicrophone }
                    isModerator = { isModeratorAndisNotLocalParticipant }
                    isMuted = { _audioMuted }
                    muteIcon = { IconMicDisabled }
                    onClick = { _handleMute } />
                <MediaIndicator
                    icon = { IconCamera }
                    isModerator = { isModeratorAndisNotLocalParticipant }
                    isMuted = { _videoMuted }
                    muteIcon = { IconCameraDisabled } />
                {hasName && (
                    <Text style = { styles.displayNameText }>
                        {' '}
                        {participant.name}{' '}
                    </Text>
                )}
                <Avatar
                    participantId = { participantID }
                    size = { 64 } />
            </Container>
        </View>
    );
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {Props} ownProps - The own props of the component.
 * @returns {Props}
 */
function _mapStateToProps(state, ownProps) {
    const { participant } = ownProps;
    const tracks = state['features/base/tracks'];
    const audioTrack = getTrackByMediaTypeAndParticipant(
        tracks,
        MEDIA_TYPE.AUDIO,
        participant.id
    );
    const videoTrack = getTrackByMediaTypeAndParticipant(
        tracks,
        MEDIA_TYPE.VIDEO,
        participant.id
    );

    return {
        _audioMuted: audioTrack?.muted ?? true,
        _videoMuted: videoTrack?.muted ?? true,
        _isLocalParticipantModerator: isLocalParticipantModerator(state)
    };
}

const participantItemConnectWithState = connect(_mapStateToProps);

export default compose(
    translate,
    participantItemConnectWithState
)(ParticipantItem);
