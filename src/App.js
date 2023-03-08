import "./styles.css";
import React, { useState, useEffect, useRef } from "react";
import robot from "./openai";
function Loading() {
  return (
    <div className="message loading">
      <span></span>
    </div>
  );
}
function Send(props) {
  const [value, setValue] = useState(undefined);
  const { messageList } = props;
  const insertMessage = async () => {
    if ((value ?? "") === "") {
      return;
    }
    if (messageList.map((i) => i.loading).includes(true)) {
      return;
    }
    document.querySelector(".message-input").value = null;
    setValue(undefined);
    props.setMessageList({
      id: new Date().getTime(),
      text: value,
      from: "ask",
      loading: false
    });
    let answerId = new Date().getTime() + 1;
    props.setMessageList({
      id: answerId,
      text: value,
      from: "answer",
      loading: true
    });
    try {
      const rs = await robot(value);
      const {
        data: { choices }
      } = rs;
      props.updateMessageList({
        id: answerId,
        text: choices[0].text,
        from: "answer",
        loading: false
      });
    } catch (e) {
      throw e;
    }
  };
  return (
    <div className="message-box">
      <textarea
        type="text"
        className="message-input"
        placeholder="..."
        onChange={(e) => setValue(e.target.value)}
        value={value}
        onKeyDown={(e) => e.keyCode === 13 && insertMessage()}
      ></textarea>
      <button
        type="submit"
        className="message-submit"
        onClick={() => insertMessage()}
      >
        Send
      </button>
    </div>
  );
}
function Message(props) {
  const list = props.messageList;
  const messagesRef = useRef(null);
  // 滚动到底部
  useEffect(() => {
    const cur = messagesRef.current;
    cur.scrollTop = cur.scrollHeight;
  });
  return (
    <div className="messages">
      <div className="messages-content" ref={messagesRef}>
        {list.map((i, idx) =>
          i.loading ? (
            <Loading key={i.id} />
          ) : (
            <div
              className={`${i.from === "ask" && "message-personal"} message`}
              key={i.id}
            >
              {i.text}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [messageList, setMsg] = useState([
    {
      id: 0,
      text: "hey",
      from: "answer",
      loading: false
    }
  ]);
  const setMessageList = (value) => {
    messageList.push(value);
    setMsg([...messageList]);
  };
  const updateMessageList = (value) => {
    const idx = messageList.findIndex((i) => i.id === value.id);
    messageList.splice(idx, 1, value);
    setMsg([...messageList]);
  };
  return (
    <div className="chat">
      <Message messageList={messageList} />
      <Send
        messageList={messageList}
        setMessageList={setMessageList}
        updateMessageList={updateMessageList}
      />
    </div>
  );
}
