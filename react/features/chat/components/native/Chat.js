// @flow

import React from 'react';

import { translate } from '../../../base/i18n';
import { JitsiModal } from '../../../base/modal';
import { connect } from '../../../base/redux';
import { CHAT_VIEW_MODAL_ID } from '../../constants';
import AbstractChat, {
    _mapDispatchToProps,
    _mapStateToProps,
    type Props
} from '../AbstractChat';

import ChatInputBar from './ChatInputBar';
import MessageContainer from './MessageContainer';
import MessageRecipient from './MessageRecipient';
import ParticipantList from './ParticipantList';

/**
 * The type of the React {@link Component} state of {@link Chat}.
 */
type State = {

    /**
     * The user select chat tab
     */
    activeTab: string,

};

const CHAT_TABS = { chat: { value: 'chat',
    label: 'chat.tabs.chat' },
participants: { value: 'participants',
    label: 'chat.tabs.participants' } };

/**
 * Implements a React native component that renders the chat window (modal) of
 * the mobile client.
 */
class Chat extends AbstractChat<Props, State> {
    /**
     * Creates a new instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            activeTab: CHAT_TABS.chat.value
        };
        this._onClose = this._onClose.bind(this);
        this._renderContent = this._renderContent.bind(this);
        this._headerLabel = this._headerLabel.bind(this);
        this._rightButtonLabel = this._rightButtonLabel.bind(this);
        this._toggleTab = this._toggleTab.bind(this);
        this._handleChangeTab = this._handleChangeTab.bind(this);
    }

    /**
     * Toggling tabs value.
     *
     * @param {string} current - The current tab value.
     * @private
     * @returns {string}
     */
    _toggleTab(current) {
        // eslint-disable-next-line no-negated-condition
        return current !== CHAT_TABS.chat.value
            ? CHAT_TABS.chat.value
            : CHAT_TABS.participants.value;
    }

    /**
     * Handler function to toggle active tabs state.
     *
     * @private
     * @returns {void}
     */
    _handleChangeTab() {
        this.setState(({ activeTab }) => {
            return { activeTab: this._toggleTab(activeTab) };
        });
    }

    /**
     * Header label of Chat Modal.
     *
     * @private
     * @returns {string}
     */
    _headerLabel() {
        const { activeTab } = this.state;

        return CHAT_TABS[activeTab].label;
    }

    /**
     * Forward button label of Chat Modal.
     *
     * @private
     * @returns {string}
     */
    _rightButtonLabel() {
        const { activeTab } = this.state;

        return CHAT_TABS[this._toggleTab(activeTab)].label;
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        return (
            <JitsiModal
                headerProps = {{
                    headerLabelKey: this._headerLabel(),
                    onPressForward: this._handleChangeTab,
                    forwardLabelKey: this._rightButtonLabel()
                }}
                modalId = { CHAT_VIEW_MODAL_ID }
                onClose = { this._onClose }>
                {this._renderContent()}
            </JitsiModal>
        );
    }

    /**
     * Render Chat Modal content based on active tab state.
     *
     * @returns {void}
     */
    _renderContent() {
        const { activeTab } = this.state;

        if (activeTab === CHAT_TABS.chat.value) {
            return (
                <>
                    <MessageContainer messages = { this.props._messages } />
                    <MessageRecipient />
                    <ChatInputBar onSend = { this.props._onSendMessage } />
                </>
            );
        }

        return <ParticipantList />;
    }

    _onClose: () => boolean;

    /**
     * Closes the modal.
     *
     * @returns {boolean}
     */
    _onClose() {
        this.props._onToggleChat();

        return true;
    }
}

export default translate(connect(_mapStateToProps, _mapDispatchToProps)(Chat));
