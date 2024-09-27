const ORIGIN = location.origin;
let source = null;

document.getElementById("origin").textContent = ORIGIN;

async function getStatus() {
  const response = await fetch(`${ORIGIN}/status`);
  statusResponse = await response.text();
  document.getElementById("client-terminal").textContent = statusResponse;
}

async function subscribe() {
  const eventSource = new EventSource(`${ORIGIN}/subscribe`);
  eventSource.onmessage = (event) => {
    document.getElementById(
      "subscribe-terminal"
    ).innerHTML += `<p>${event.data}</p>`;
  };
  eventSource.onopen = () => getStatus();
  eventSource.onerror = () => getStatus();
  source = eventSource;
}

async function unsubscribe() {
  source.close();
  source = null;
  getStatus();
}

async function publish() {
  const messageContainer = document.getElementById("message");
  await fetch(`${ORIGIN}/publish`, {
    method: "POST",
    body: JSON.stringify({
      message: messageContainer.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  messageContainer.value = "";
}

getStatus();