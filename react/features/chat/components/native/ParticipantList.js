// @flow

import React from 'react';
import { FlatList, Text, View } from 'react-native';

import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';

import ParticipantItem from './ParticipantItem';
import styles from './styles';


/**
 * Implements a container to render all the participant list in a chat modal.
 */
class ParticipantList extends React.Component {
    /**
     * Instantiates a new instance of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderListEmptyComponent = this._renderListEmptyComponent.bind(this);
        this._renderParticipantList = this._renderParticipantList.bind(this);
    }

    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const data = this.props._participants || [];

        return (
            <FlatList
                ListEmptyComponent = { this._renderListEmptyComponent }
                data = { data }
                keyExtractor = { this._keyExtractor }
                keyboardShouldPersistTaps = 'always'
                renderItem = { this._renderParticipantList }
                style = { styles.participantsContainer } />
        );
    }


    _keyExtractor: Object => string

    /**
     * Key extractor for the flatlist.
     *
     * @param {Object} item - The flatlist item that we need the key to be
     * generated for.
     * @param {number} index - The index of the element.
     * @returns {string}
     */
    _keyExtractor(item, index) {
        return `key_${index}`;
    }

    _renderListEmptyComponent: () => React$Element<any>;

    /**
     * Renders a message when there are no participant in the conference yet.
     *
     * @returns {React$Element<any>}
     */
    _renderListEmptyComponent() {
        const { _styles, t } = this.props;

        return (
            <View style = { styles.emptyComponentWrapper }>
                <Text style = { _styles.emptyComponentText }>
                    { t('chat.noParticipantMessage') }
                </Text>
            </View>
        );
    }

    _renderMessageGroup: Object => React$Element<any>;

    /**
     * Renders a participant item.
     *
     * @param {Array<Object>} participant - The participant data to render.
     * @returns {React$Element<*>}
     */
    _renderParticipantList({ item: participant }) {
        console.log('item', participant);

        return <ParticipantItem participant = { participant } />;
    }
}

/**
 * Maps part of the redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const participants = state['features/base/participants'];
    const tracks = state['features/base/tracks'];

    return {
        _participants: participants,
        _tracks: tracks,
        _styles: ColorSchemeRegistry.get(state, 'Chat')
    };
}

export default translate(connect(_mapStateToProps)(ParticipantList));
