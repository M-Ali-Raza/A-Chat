const socket=io();
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
socket.on('user-list',name=>{
    userList.innerHTML="";
    users_arr=Object.values(name);
    for(i=0;i<users_arr.length;i++){
        let p=document.createElement('p');
        p.innerText=users_arr[i];
        p.classList.add('user');
        userList.appendChild(p);
    }
});
//Ask new user for his/her name and let the server know
var name;
do{
    name=prompt("Enter your name to join");
}while(!name);
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