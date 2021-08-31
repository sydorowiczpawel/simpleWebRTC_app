import {
  Chat,
  ChatComposers,
  ChatInput,
  ChatInputTextArea,
  ChatList,
  Peer,
  StayDownContainer
} from '@andyet/simplewebrtc';
import SendIcon from 'material-icons-svg/components/baseline/Chat';
import ChatIcon from 'material-icons-svg/components/baseline/ChatBubbleOutline';
import KeyboardArrowDownIcon from 'material-icons-svg/components/baseline/KeyboardArrowDown';
import React from 'react';
import styled, { css } from 'styled-components';
import { TalkyButton } from '../styles/button';
import mq from '../styles/media-queries';
import { colorToString } from '../utils/colorify';
import emojify from '../utils/emojify';
import Linkify from './Linkify';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(var(--vh, 1vh) * 50);
  max-height: calc(var(--vh, 1vh) * 100);
  border-top: ${({ theme }) => css`1px solid ${colorToString(theme.border)}`};
  z-index: 300;
  background-color: ${({ theme }) => colorToString(theme.background)};
  overflow: hidden;

  & .msg:last-of-type {
    border-bottom: none;
  }
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   min-height: calc(var(--vh, 1vh) * 50);
//   max-height: calc(var(--vh, 1vh) * 100);
//   border-top: ${({ theme }) => css`1px solid ${colorToString(theme.border)}`};
//   z-index: 300;
//   background-color: ${({ theme }) => colorToString(theme.background)};
//   overflow: hidden;

//   & .msg:last-of-type {
//     border-bottom: none;
//   }

  ${mq.SMALL_DESKTOP} {
    width: 33%;
    border-top: none;
    border-left: ${({ theme }) => css`1px solid ${colorToString(theme.border)}`};
  }
`;

// const staydownContainerClass = css`
//   flex: 1;
//   overflow: scroll;
//   height: 0px; /* This is important to get Flexbox to overflow properly. */
//   margin-bottom: 16px;
// `;

const Header = styled.button`
  text-align: left;
  border: none;
  border-top: ${({ theme }) => css`1px solid ${colorToString(theme.border)}`};
  border-bottom: ${({ theme }) => css`1px solid ${colorToString(theme.border)}`};
  display: block;
  padding: 10px;
  font-size: 18px;
  outline: none;
  background-color: ${({ theme }) => colorToString(theme.background)};
  svg {
    fill: ${({ theme }) => colorToString(theme.foreground)};
    vertical-align: middle;
    font-size: 20px;
    margin-right: 5px;
  }
`;

const StyledStayDownContainer = styled(StayDownContainer)({
  flex: 1,
  overflow: 'scroll',
  height: '0px',
  marginBottom: '16px'
});

const InputContainer = styled.div`
  padding: 5px;
  border: ${({ theme }) => css`1px solid ${colorToString(theme.border)}`};
  border-radius: 5px;
  margin: 5px;

  textarea {
    width: 100%;
    height: 90px;
    min-height: 0;
    padding: 8px;
    margin: 0;
    outline: none;
    display: block;
    font-size: 14px;
    font-family: inherit;
    resize: none;
    border: none;
  }
  input {
    margin-right: 5px;
  }
  label {
    font-size: 12px;
  }

  &.chat-disabled {
    background: ${({ theme }) =>
      css`
        ${colorToString(theme.border)}
      `};

    textarea {
      background: ${({ theme }) =>
        css`
          ${colorToString(theme.border)}
        `};
    }
  }
`;

const Message = styled.div`
  border-bottom: ${({ theme }) => css`1px solid ${colorToString(theme.border)}`};
  position: relative;
  padding: 10px;
  font-size: 14px;
  p {
    margin: 0;
  }
`;

const MessageAuthor = styled.p({
  fontWeight: 'bold'
});

const MessageTime = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${({ theme }) => colorToString(theme.foreground)};
  font-size: 12px;
`;

const MessageText = styled.p({
  wordBreak: 'break-all'
});

interface ChatMessageGroupProps {
  chats: Chat[];
  peer: Peer | undefined;
}

const ChatMessageGroup: React.SFC<ChatMessageGroupProps> = ({ chats, peer }) => (
  <Message className="msg" key={chats[0].id}>
    <MessageAuthor>{chats[0].displayName ? chats[0].displayName : 'Anonymous'}</MessageAuthor>
    <MessageTime>{chats[0].time.toLocaleTimeString()}</MessageTime>
    {chats.map(message => (
      <MessageText key={message.id}>
        <Linkify text={emojify(message.body)} />
      </MessageText>
    ))}
  </Message>
);

const ComposersContainer = styled.div({
  minHeight: '20px',
  fontSize: '12px',
  textAlign: 'center'
});

interface Props {
  disabled?: boolean;
  roomAddress: string;
  toggleChat: () => void;
}

// ChatContainer renders all the UI for the chat room inside a Room. It
// includes a message display embedded inside a StayDownContainer so that
// it remains scrolled to the bottom, a ChatInput to type messages, and a
// text element that displays currently typing peers.
const ChatContainer: React.SFC<Props> = ({ roomAddress, toggleChat, disabled }) => (
  <Container>
    <Header onClick={toggleChat}>
      <KeyboardArrowDownIcon />
      <ChatIcon />
      <span>Chat</span>
    </Header>
    <StyledStayDownContainer>
      <ChatList
        room={roomAddress}
        renderGroup={({ chats, peer }) => (
          <ChatMessageGroup key={chats[0].id} chats={chats} peer={peer} />
        )}
      />
    </StyledStayDownContainer>
    <InputContainer className={disabled ? 'czat niedostępny' : ''}>
      <ChatInput autoFocus disabled={disabled} room={roomAddress} placeholder={disabled ? 'Waiting to join room...' : 'Aa'}
      render={chatProps => (
          <>
            <ChatInputTextArea {...chatProps} />
            {/* <label style={{ display: 'inline-block' }}>
              <input type="checkbox" checked={chatProps.rtt} onChange={() => chatProps.useRealtimeText(!chatProps.rtt)}/>
              <span>Send as I type</span>
            </label> */}
            <TalkyButton onClick={chatProps.sendMessage} style={{ float: 'right' }}>
              {/* <SendIcon /> */}
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
              </span>
            </TalkyButton>
          </>
        )}
      />
    </InputContainer>
    <ComposersContainer>
      <ChatComposers room={roomAddress} />
    </ComposersContainer>
  </Container>
);

export default ChatContainer;
