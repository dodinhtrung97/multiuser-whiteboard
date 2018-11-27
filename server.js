const server = require('http').createServer()
const io = require('socket.io')(server)

io.on('connection', function (client) {
  console.log("Client connected, with id: " + client.id)

  client.on('disconnect', function () {
    console.log('client' + client.id + 'disconnect...')
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })

  client.on('mouse_down', function(data) {
    io.emit('apply_mouse_down', data.pos)
    console.log(data.pos)
  })

  client.on('mouse_move', function(data) {
    io.emit('apply_mouse_move', data.pos)
    console.log(data.pos)
  })

  client.on('mouse_up', function(data) {
    io.emit('apply_mouse_up', data.pos)
    console.log(data.pos)
  })
})

server.listen(3000, function (err) {
  if (err) throw err
  console.log('listening on port 3000')
})