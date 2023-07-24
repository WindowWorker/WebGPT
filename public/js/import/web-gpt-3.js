globalThis.serialize = (obj) => {
  return Object.keys(obj).map(key => {
    return [
      encodeURIComponent(key),
      encodeURIComponent(obj[key])
    ].join('=');
  }).join('&');
}

globalThis.postChat = async function(data = {}) {
  const response = await fetch("https://web-gpt-demo.com/chat", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",

    },
    redirect: "follow",
    referrerPolicy: "no-referrer",

    body: JSON.stringify(data)
  });
  return response.text();
}

globalThis.getChat = async function(data = {}) {

  let query = serialize(data);

  const options = {
    method: 'GET',
    headers: {
      'Accept': 'text/json',
    }
  };

  response = await fetch(`/chat/?${query}`, options);
  return response.text();
}


