import { ELLIPSE, PEN } from './toolStore';

export function pointInsideRect(point, rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.width &&
    point.y >= rect.y && point.y <= rect.y + rect.height
}

export function getShapeRect(shape) {
  const end = shape.path.length - 1
  if (shape.type === ELLIPSE) {
    const halfWidth = Math.abs(shape.path[0].x - shape.path[end].x)
    const halfHeight = Math.abs(shape.path[0].y - shape.path[end].y)
    return {
      x: Math.min(shape.path[0].x, shape.path[end].x) - halfWidth,
      y: Math.min(shape.path[0].y, shape.path[end].y) - halfHeight,
      width: 2 * halfWidth,
      height: 2 * halfHeight,
    }
  } else {
    const minX = Math.min( ...shape.path.map(p=>p.x))
    const maxX = Math.max( ...shape.path.map(p=>p.x))
    const minY = Math.min( ...shape.path.map(p=>p.y))
    const maxY = Math.max( ...shape.path.map(p=>p.y))
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }
}

export function filterPath(path) {
  var currentElem = {x: -10000, y: -100000}
  var filteredPath = []

  for (var i = 0; i < path.length; i++) {
    if (path[i].x != currentElem.x && path[i].y != currentElem.y) {
      currentElem = path[i]
      filteredPath.push(path[i])
    }
  }

  return filteredPath
}

export function isSameShape(shape1, shape2) {
  if (shape1.path.length != shape2.path.length) return false
  if (shape1.color != shape2.color) return false
  if (shape1.selected != shape2.selected) return false
  if (shape1.size != shape2.size) return false
  if (shape1.type != shape2.type) return false

  for (var i = 0; i < shape1.path.length; i++) {
    if (shape1.path[i].x != shape2.path[i].x || shape1.path[i].y != shape2.path[i].y)
      return false
  }

  return true
}