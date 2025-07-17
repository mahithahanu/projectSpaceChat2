// import React, { useEffect, useState, useRef } from "react";
// import { TextMsg, MediaMsg, LinkMsg, ReplyMsg, DocMsg } from "./MsgTypes";
// import { socket, connectSocket } from "../../socket";
// import axios from "axios";

// const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// const Message = ({ from, to ,setConversationId}) => {

//   const bottomRef = useRef(null);

//   useEffect(() => {
//     if (!from || !to) return;
//     connectSocket(from);
//   }, [from]);

//   useEffect(() => {
//     if (!from || !to || !isValidMongoId(from) || !isValidMongoId(to)) return;

//     socket.emit("start_conversation", { from, to });

// const handleStartChat = (conversation) => {
//   setConvId(conversation._id);
//   if (typeof setConversationId === "function") {
//     console.log("✅ Calling parent setConversationId with:", conversation._id);
//     setConversationId(conversation._id);
//   }
// };



//     socket.on("start_chat", handleStartChat);

//     return () => {
//       socket.off("start_chat", handleStartChat);
//     };
//   }, [from, to]);

//   useEffect(() => {
//     if (!convId) return;

//     socket.emit("get_messages", { conversation_id: convId }, (messages) => {
//       setMsgs(messages || []);
//     });

//     const handleNewMessage = ({ conversation_id, message }) => {
//       if (conversation_id === convId) {
//         setMsgs((prev) => [...prev, message]);
//       }
//     };

//     socket.on("new_message", handleNewMessage);

//     return () => {
//       socket.off("new_message", handleNewMessage);
//     };
//   }, [convId]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [msgs]);



//   return (
//     <>
//       {msgs.map((msg, idx) => {
//         const MsgComponent =
//           {
//             Text: TextMsg,
//             Media: MediaMsg,
//             Document: DocMsg,
//             Link: LinkMsg,
//             Reply: ReplyMsg,
//           }[msg.type] || (() => <div>Unsupported message type</div>);

//         return (
//           <MsgComponent
//             key={idx}
//             el={{ ...msg, incoming: msg.from !== from }}
//           />
//         );
//       })}
//       <div ref={bottomRef} />

      
//     </>
//   );
// };

// export default Message;


import React, { useEffect, useState, useRef } from "react";
import { TextMsg, MediaMsg, LinkMsg, ReplyMsg, DocMsg } from "./MsgTypes";
import { socket, connectSocket } from "../../socket";

const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const Message = ({ from, to, setConversationId }) => {
  const [msgs, setMsgs] = useState([]);
  const [convId, setConvId] = useState(null); // ✅ FIXED
  const bottomRef = useRef(null);

  // Connect socket
  useEffect(() => {
    if (!from || !to) return;
    connectSocket(from);
  }, [from]);

  // Start conversation
  useEffect(() => {
    if (!from || !to || !isValidMongoId(from) || !isValidMongoId(to)) return;

    socket.emit("start_conversation", { from, to });

    const handleStartChat = (conversation) => {
      setConvId(conversation._id);
      if (typeof setConversationId === "function") {
        console.log("✅ Calling parent setConversationId with:", conversation._id);
        setConversationId(conversation._id); // Send to Footer
      }
    };

    socket.on("start_chat", handleStartChat);

    return () => {
      socket.off("start_chat", handleStartChat);
    };
  }, [from, to, setConversationId]);

  // Fetch old messages
  useEffect(() => {
    if (!convId) return;

    socket.emit("get_messages", { conversation_id: convId }, (messages) => {
      setMsgs(messages || []);
    });

    const handleNewMessage = ({ conversation_id, message }) => {
      if (conversation_id === convId) {
        setMsgs((prev) => [...prev, message]);
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [convId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  return (
    <>
      {msgs.map((msg, idx) => {
        const MsgComponent =
          {
            Text: TextMsg,
            Media: MediaMsg,
            Document: DocMsg,
            Link: LinkMsg,
            Reply: ReplyMsg,
          }[msg.type] || (() => <div>Unsupported message type</div>);

        return (
          <MsgComponent
            key={idx}
            el={{ ...msg, incoming: msg.from !== from }}
          />
        );
      })}
      <div ref={bottomRef} />
    </>
  );
};

export default Message;
