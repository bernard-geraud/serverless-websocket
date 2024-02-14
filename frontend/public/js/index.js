const WEBSOCKET_API =
  "ws://localhost:3001";
let web_socket;

const buildMessage = (data) => {
  if (data && typeof data != Object) {
    data = JSON.parse(data);
  }
  const { sender_name, sender_id, msg } = data;
  if (sender_name && sender_id && msg) {
    let sender_class = "";
    if (sender_id == localStorage.user_id) {
      sender_class = "darker";
    }
    $(".mainbody").append(`
         <div class="container ${sender_class}">
            <div class="profile_letter">${sender_name.substr(0, 1)}</div>
            <p class="profile_name">${sender_name}</p>
            <p>${msg}</p>
            <span class="time-right">${moment().fromNow()}</span>
         </div>
      `);

    const objDiv = document.getElementById("mainbody");
    objDiv.scrollTop = objDiv.scrollHeight;
  }
};

function webSocketTest(user_name, user_id) {
  if ("WebSocket" in window) {
    console.log("WebSocket is supported by your Browser!");
    user_name = "kaeyros"; user_id = 123;
    let ws = new WebSocket(
      `${WEBSOCKET_API}?user_name=${user_name}&user_id=${user_id}`
    );

    ws.onopen = function () {
      web_socket = ws;
    };

    ws.onmessage = function (evt) {
      buildMessage(evt.data);
    };

    ws.onclose = function () {
      console.log("Connection is closed...");
    };
  } else {
    console.log("WebSocket NOT supported by your Browser!");
  }
}

$(document).ready(function () {
  let { user_name, user_id } = localStorage;
  $("#user_name").html(user_name);
  webSocketTest(user_name, user_id);

  const btn =  document.getElementById('message');
  btn.addEventListener('click', () => {
    user_name = "kaeyros"; user_id = 123; msg = "Message test!!!!";
    web_socket.send(
        `{"sender_id":"${user_id}","sender_name":"${user_name}", "msg":"${msg}"}`
    );
  });
//   $("#message").keypress(function (e) {
//     var key = e.which;
//     if (key == 13) {
//         const msg = $("#message").val();
//       if (!msg.trim()) {
//         return false;
//       }

//       if (web_socket) {
//         web_socket.send(
//           `{"sender_id":"${user_id}","sender_name":"${user_name}", "msg":"${msg}"}`
//         );
//         $("#message").val("");
//       }
//     }
//   });
});