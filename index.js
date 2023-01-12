const message = document.getElementById('message');
const send = document.getElementById("send");
const chat = document.getElementById("chat");

const firebaseConfig = {
  databaseURL: "https://chatjs-e8555-default-rtdb.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);

const messagesRef = firebase.database().ref('/messages');

const writeMessage = (user, message) => {
  var currentDate = moment().tz("America/Argentina/Buenos_Aires").format("YYYY-MM-DD HH:mm:ss");
  var data = {
    datetime: currentDate,
    user: user,
    message : message
  };
  console.log("DATA: ", data);
  firebase.database().ref("/messages").push(data);
};

const refreshChat = (messages) => {
  chat.innerHTML = "";
  messages.forEach(message => {
    var data = message.val();

    var liElem = document.createElement('li');
    var textElem = document.createTextNode(`${data.datetime} - [${data.user}]: ${data.message}`);
    liElem.appendChild(textElem);
    chat.appendChild(liElem);
  });
  chat.scrollTop = chat.scrollHeight;
};

send.addEventListener("click", function(event){
  event.preventDefault();
  writeMessage('cgcaruzo', message.value);
  message.value = null;
});


messagesRef.on('value', (snapshot) => {
  if (snapshot.exists()) {
    refreshChat(snapshot);  
  }
});

