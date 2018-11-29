import openSocket from 'socket.io-client';

const serverUrl = 'https://onlinewhiteboard.herokuapp.com:3000'

const socket = openSocket(serverUrl)

export default socket;