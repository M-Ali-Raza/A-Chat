//Express stuff
const http=require('http');
const express=require('express');
const app=express();
const server=http.createServer(app);
const port=process.env.PORT || 3000;
app.use(express.static(__dirname+'/public'));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});
//Node server which will handle socket io connections
const io=require('socket.io')(server);
const users={};
io.on('connection',socket=>{
    //If any new user joins,let other users connected to the server know!
    socket.on('new-user-joined',name=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
        io.emit("user-list",users);
    });
    //If someone send a message,broadcast it to other people
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]});
    });
    //If someone leave the chat,let others know
    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
        io.emit("user-list",users);
    });
});
//Server listening on port
server.listen(port,()=>{
    console.log(`Server started at http://localhost:${port}`);
});