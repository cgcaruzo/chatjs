const message = document.getElementById('message');
const send = document.getElementById("send");
const chat = document.getElementById("chat");
const user = prompt("What's your name?");
message.focus()

const firebaseConfig = {
  databaseURL: "https://chatjs-e8555-default-rtdb.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);

const messagesRef = firebase.database().ref('/messages').limitToLast(1000);

const writeMessage = (user, message) => {
  let currentDate = moment().tz("America/Argentina/Buenos_Aires").format("YYYY-MM-DD HH:mm:ss");
  let data = {
    datetime: currentDate,
    user: user,
    message : message
  };
  firebase.database().ref("/messages").push(data);
};

const refreshChat = (messages) => {
  chat.innerHTML = "";
  messages.forEach(message => {
    let data = message.val();
    let liElem = document.createElement('li');
    let textElem = document.createTextNode(`
      ${data.datetime} ~ [${data.user}]: ${data.message}
      `);
    liElem.appendChild(textElem);
    chat.appendChild(liElem);
  });
  chat.scrollTop = chat.scrollHeight;
};

send.addEventListener("click", function(event){
  event.preventDefault();
  writeMessage(user, message.value);
  message.value = null;
  message.focus();
});


messagesRef.on('value', (snapshot) => {
  if (snapshot.exists()) {
    refreshChat(snapshot);  
  }
});

