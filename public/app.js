
const chat = document.getElementById("chat");
const field = document.getElementById("message");
const send = document.getElementById("send");
const mic = document.getElementById("mic");

const history = [];

function addMessage(text, type) {
  const bubble = document.createElement("div");
  bubble.className = "message " + type;
  bubble.textContent = text;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const text = field.value.trim();

  if (!text) return;

  field.value = "";
  addMessage(text, "user");

  history.push({
    role: "user",
    content: text
  });

  send.disabled = true;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: history
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "දෝෂයක් ඇතිවුණා.");
    }

    history.push({
      role: "assistant",
      content: data.reply
    });

    addMessage(data.reply, "bot");

  } catch (error) {
    addMessage(
      error.message || "සම්බන්ධතාවයේ දෝෂයක් ඇතිවුණා.",
      "bot"
    );
  } finally {
    send.disabled = false;
  }
}

send.addEventListener("click", sendMessage);

field.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Sinhala voice input
const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();

  recognition.lang = "si-LK";
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    field.value += event.results[0][0].transcript;
  };

  mic.addEventListener("click", function() {
    recognition.start();
  });

} else {
  mic.disabled = true;
}
