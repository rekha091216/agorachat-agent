import AC from 'agora-chat'

const appKey = "61501494#1077360";
const conn = new AC.connection({
	appKey: appKey,
	autoReconnectNumMax :20
});

let peerId ='';


const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let userName= '';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();
  return `${h.slice(-2)}:${m.slice(-2)}`;
}

conn.addEventHandler("connection&message", {
	onConnected: () => {
	
	},
	onDisconnected: () => {
	},
	onTextMessage: (message) => {
		console.log(message);
		const from = message.from;
		peerId = from;
		const messageContent = message.msg;
		const msgDiv =document
    .getElementsByClassName("inner1");

	const containerDiv = document.createElement("div");
	containerDiv.className = "container"  ;

	const img = document.createElement("img");
	img.className = "left";
	img.src = "customer.jpeg";
	img.alt = "Customer-" + from;

   containerDiv.appendChild(img);

const pDiv = document.createElement("p");
pDiv.innerText =  messageContent;

containerDiv.appendChild(pDiv);

const spanDiv = document.createElement("span");
spanDiv.className = "time-right";
spanDiv.innerText = formatDate(new Date()).toString();

containerDiv.appendChild(spanDiv);

msgDiv[0].appendChild(containerDiv);

	},
	onTokenWillExpire: (params) => {
		document
			.getElementById("log")
			.appendChild(document.createElement("div"))
			.append("Token is about to expire");
	},
	onTokenExpired: (params) => {
		document
			.getElementById("log")
			.appendChild(document.createElement("div"))
			.append("The token has expired");
	},
	onError: (error) => {
		console.log("on error", error);
	},
});

window.onload = function () {


const loginUI = document.getElementsByClassName("loginname");
loginUI[0].innerText = "";

	document.getElementById("login").onclick = function (e) {
		e.preventDefault();
		const userId = document.getElementById("userId").value;
		const password = document.getElementById("password").value;
		const promiseOpen = new Promise((resolve, reject) => {
			conn.open({
			user: userId,
			pwd: password,
		})
    });

	promiseOpen.then(()=>{
        console.log("Login Success!!")
    });


	const loginform = document.getElementById("loginform");
	loginform.style.visibility = "hidden";

	
	loginUI[0].innerText = "User Id: " + userId;

	const wrapper = document.getElementsByClassName("wrapper")[0];
	wrapper.style.visibility = "visible";

}


	document.getElementById("send_peer_message").addEventListener("keypress", function(event) {
		// If the user presses the "Enter" key on the keyboard
		if (event.key === "Enter") {
		  // Cancel the default action, if needed
		  event.preventDefault();
		  // Trigger the button element with a click
		  document.getElementById("send_peer_message").click();
		}
	  });

	  document.getElementById("peerMessage").addEventListener("keypress", function(event) {
		// If the user presses the "Enter" key on the keyboard
		if (event.key === "Enter") {
		  // Cancel the default action, if needed
		  event.preventDefault();
		  // Trigger the button element with a click
		  document.getElementById("send_peer_message").click();
		}
	  });

	document.getElementById("send_peer_message").onclick = function () {

		if(peerId === ""){
			const error = document.getElementById("displayMsg");
			error.innerText = "Receiver is not logged in";
			return;
		}
		
		let peerMessage = document.getElementById("peerMessage").value.toString();
		let option = {
			from: userId,
			chatType: "singleChat", 
			type: "txt", 
			to: peerId,
			msg: peerMessage, 
		};

	let msg = AC.message.create(option);

    const msgDiv =document
            .getElementsByClassName("inner1");

    const containerDiv = document.createElement("div");
    containerDiv.className = "container darker"  ;

    const img = document.createElement("img");
    img.className = "right";
    img.src = "agent.png";
    img.alt = "Agent";

    containerDiv.appendChild(img);

    const pDiv = document.createElement("p");
    pDiv.innerText =  peerMessage;

    containerDiv.appendChild(pDiv);

    const spanDiv = document.createElement("span");
    spanDiv.className = "time-left";
    spanDiv.innerText = formatDate(new Date()).toString();

    containerDiv.appendChild(spanDiv);

    msgDiv[0].appendChild(containerDiv);

    conn
			.send(msg)
			.then((res) => {
				console.log("send private text success");
            document.getElementById("peerMessage").value ="";
			})
			.catch((error) => {
				console.log("send private text fail", error);
			});
	};
}