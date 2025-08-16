import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState({});
  const [status, setStatus] = useState("");

  // Fetch messages from backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/contact/all`) // You’ll add this backend route below
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleResponseChange = (id, value) => {
    setResponses({ ...responses, [id]: value });
  };

  const handleSendReply = async (id) => {
    const response = responses[id];
    if (!response) return alert("Response cannot be empty.");

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/contact/reply/${id}`, {
        response,
      });
      setStatus("Reply sent successfully!");
      setResponses((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error(err);
      setStatus("Failed to send reply.");
    }
  };

  return (
    <div className="container mt-4">

      <h2>Contact Messages</h2>
      
      {status && <div className="alert alert-info">{status}</div>}
      {messages.map((msg) => (
        <div key={msg.id} className="card my-3">
          <div className="card-body">
            <h5 className="card-title">{msg.name} ({msg.email})</h5>
            <p className="card-text">{msg.message}</p>

            {msg.response ? (
              <div className="alert alert-success">
                <strong>Replied:</strong> {msg.response}
              </div>
            ) : (
              <>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Type your response here..."
                  value={responses[msg.id] || ""}
                  onChange={(e) => handleResponseChange(msg.id, e.target.value)}
                ></textarea>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => handleSendReply(msg.id)}
                >
                  Send Reply
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminContactMessages;
