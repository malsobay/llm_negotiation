import React from "react";
import { Avatar } from "./Avatar";

export class Chat extends React.Component {
  state = { open: false, focused: false };

  constructor(props) {
    super(props);

    this.messagesRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.messagesRef.current) {
      return;
    }

    if (
      (!prevState.open && this.state.open) ||
      (!prevState.focused && this.state.focused)
    ) {
      this.messagesRef.current.scrollTop =
        this.messagesRef.current.scrollHeight;
    }
    if (prevProps.messages.length !== this.props.messages.length) {
      this.messagesRef.current.scrollTop =
        this.messagesRef.current.scrollHeight;
    }
  }

  clearTimeout = () => {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  };

  handleMouseEnterOpen = () => {
    this.clearTimeout();
  };

  handleMouseLeaveOpen = () => {
    this.closeTimeout = setTimeout(() => {
      this.setState({ open: false });
    }, 1000);
  };

  renderOpen() {
    const { messages, avatar, onNewMessage } = this.props;

    return (
      <div
        className="absolute w-full h-full px-2 py-2 pointer-events-auto flex flex-col justify-end "
        // onMouseEnter={this.handleMouseEnterOpen}
        // onMouseLeave={this.handleMouseLeaveOpen}
      >
        <div className="rounded-2xl outline outline-2 outline-gray-300 pb-2 max-h-[75%] flex flex-col font-mono bg-white/95">
          <div className="overflow-auto px-2 pb-2" ref={this.messagesRef}>
            <Messages messages={messages} showNoMessages />
          </div>
          <div className="px-2">
            <Input
              // autoFocus={false}
              autoFocus={true}
              avatar={avatar}
              onNewMessage={onNewMessage}
              onFocus={() => {
                this.setState({ focused: true });
              }}
              onBlur={() => {
                this.setState({ focused: false });
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  handleMouseEnterClosed = () => {
    this.setState({ open: true });
  };

  handleMouseLeaveClosed = () => {
    this.closeTimeout = setTimeout(() => {
      this.setState({ open: false });
    }, 2000);
  };

  renderClosed() {
    const { messages, avatar, onNewMessage } = this.props;

    return (
      <div
        className="absolute bottom-0 w-full font-mono pointer-events-auto"
        // onMouseEnter={this.handleMouseEnterClosed}
        // onMouseLeave={this.handleMouseLeaveClosed}
      >
        <div className="pb-4 pl-4 w-full font-mono">
          {messages.length > 3 && (
            <button
              // onClick={() => this.setState({ open: true })}
              onClick={() => this.setState({ focused: true })}
              className="text-gray-400 pl-2"
            >
              See full conversation
            </button>
          )}
          <div className="pb-2">
            <Messages maxSize={100} messages={messages.slice(-3)} />
          </div>
          <div className="pr-4">
            <Input
              avatar={avatar}
              onNewMessage={onNewMessage}
              onFocus={() => {
                this.setState({ focused: true });
              }}
              onBlur={() => {
                this.clearTimeout();
                this.setState({ focused: false, open: false });
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.open || this.state.focused) {
      return this.renderOpen();
    } else {
      return this.renderClosed();
    }
  }
}

function Messages({ messages, maxSize = 0, showNoMessages = false }) {
  if (messages.length === 0) {
    if (showNoMessages) {
      return (
        <div className="h-full min-h-[4rem] w-full flex justify-center items-center">
          No messages yet
        </div>
      );
    } else {
      return null;
    }
  }

  return messages.map((message, i) => {
    let sliced = false;
    let text = message.text;
    if (maxSize > 0 && message.text.length > maxSize) {
      text = text.slice(0, maxSize);
      sliced = true;
    }

    return (
      <div className="pl-2 flex items-start space-x-2" key={message.id}>
        <div className="w-6 h-6 pt-2 py-0.5 shrink-0">
        {<img
            className="h-full w-full rounded-md shadow bg-white p-1"
            src={`https://avatars.dicebear.com/api/identicon/1.svg`}
            alt="Avatar"
          />}
        </div>

        <div className="p-2">
          {text}
          {sliced ? <span className="text-gray-400 pl-2">[...]</span> : ""}

          {/* 
            <span className="text-gray-400 pl-2">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
           */}
        </div>
      </div>
    );
  });
}

class Input extends React.Component {
  state = { text: "" };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.text.length > 1024) {
      e.preventDefault();

      alert("Max message length is 1024");

      return;
    }

    this.props.onNewMessage(this.state.text);
    this.setState({ text: "" });
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      this.handleSubmit(e);
      this.resize(e);
    }
  };

  handleKeyUp = (e) => {
    this.resize(e);
  };

  resize(e) {
    e.target.style.height = "inherit";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  }

  render() {
    const { avatar, onFocus, onBlur, autoFocus } = this.props;

    return (
      <form
        onSubmit={this.handleSubmit}
        className="w-full font-semibold flex flex-row items-start rounded-xl pl-2 pr-1 py-1 ring-2 bg-gray-50 ring-gray-200 focus-within:ring-gray-400 space-x-2"
      >
        <div className="w-6 h-6 py-0.5 shrink-0">
        {avatar}
        </div>

        <textarea
          autoFocus={autoFocus}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          className="peer resize-none w-full py-1 pl-2 pr-0 ring-none border-none leading-snug bg-transparent placeholder:text-gray-300 text-md focus:ring-0 text-gray-600"
          rows={1}
          placeholder="Say something..."
          value={this.state.text}
          onChange={(e) => {
            this.setState({ text: e.currentTarget.value });
          }}
        />

        <button
          type="submit"
          className="py-0.5 px-2 rounded-lg bg-transaprent text-gray-300 peer-focus:text-gray-500 mt-[1px]"
        >
          Send
        </button>
      </form>
    );
  }
}


function randID() {
  return Math.random().toString(16).slice(8);
}
