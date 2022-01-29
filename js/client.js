const socket=io('http://localhost:80');
//Get DOM elements in respective js variables
const form=document.getElementById('send-container');
const messageInput=document.getElementById('messageInp');
const messageContainer=document.querySelector(".container");
const userList=document.querySelector(".user-list");
const pageLeft=document.querySelector(".pageLeft");
const userMenu=document.querySelector(".userMenu");
const chatMenu=document.querySelector(".chatMenu");
//Code which is use to make menu
userMenu.addEventListener('click',()=>{
    userList.classList.add('height');
    userMenu.classList.add('userClick');
    chatMenu.classList.add('chatClick');
});
chatMenu.addEventListener('click',()=>{
    userList.classList.remove('height');
    userMenu.classList.remove('userClick');
    chatMenu.classList.remove('chatClick');
});
//Audio that will play on receiving message
var audio=new Audio('juntos.mp3');
//Function which will append event info to the container
const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('messages');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='right'){
        audio.play();
    }
    //Line of code which will scroll down when container is full
    messageContainer.scrollTop = messageElement.offsetTop - 10;
}
//Function which will write and remove user name into user-list
const writeName=(user)=>{
    const nameElement=document.createElement('div');
    nameElement.innerHTML=user;
    nameElement.classList.add('user');
    userList.append(nameElement);
    socket.on('left',name=>{
        if(nameElement.innerHTML==name){
            nameElement.remove();
        }
    });
}
socket.on('user-joined',name=>{
    writeName(name);
});
//Ask new user for his/her name and let the server know
const name=prompt("Enter your name to join");
socket.emit('new-user-joined',name);
//If a new user joins,recieve his/her name from the server
socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'center');
});
//If a server send a message recieve it
socket.on('receive',data=>{
    append(`${data.name}:${data.message}`,'right');
});
//If a user leave the chat,append the info to the container
socket.on('left',name=>{
    append(`${name} left the chat`,'center');
});
//If the form gets submitted,send the server the message
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You:${message}`,'left');
    socket.emit('send',message);
    messageInput.value='';
});