const server = require('http').createServer()
const io = require('socket.io')(server)
const port = process.env.PORT || 3000;

io.on('connection', function (client) {
  console.log("Client connected, with id: " + client.id)
  io.emit('client_connected', {id: client.id})

  client.on('disconnect', function () {
    console.log('client' + client.id + 'disconnect...')
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })

  client.on('mouse_down', function(data) {
    io.emit('apply_mouse_down', {id: data.id, rect: data.rect, pos: data.pos})
  })

  client.on('mouse_move', function(data) {
    io.emit('apply_mouse_move', {id: data.id, pos: data.pos})
  })

  client.on('mouse_up', function(data) {
    io.emit('apply_mouse_up', {id: data.id, pos: data.pos})
  })

  client.on('tool_change', function(data) {
    io.emit('apply_tool_change', {index: data.index})
  })

  client.on('color_change', function(data) {
    io.emit('apply_color_change', {index: data.index})
  })

  client.on('pen_size_change', function(data) {
    io.emit('apply_pen_size_change', {size: data.size})
  })

  client.on('shape_move', function(data) {
    io.emit('apply_shape_move', {shape: data.shape, move: data.move})
  })

  client.on('undo', function(){
    io.emit('apply_undo', {msg: "Undo"})
  })

  client.on('redo', function(){
    io.emit('apply_redo', {msg: "Redo"})
  })
})

server.listen(port, function (err) {
  if (err) throw err
  console.log('listening on port ' + port)
})