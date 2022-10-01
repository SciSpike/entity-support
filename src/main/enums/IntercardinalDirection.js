'use strict'

const Enumeration = require('@ballistagroup/enum-support')

const IntercardinalDirection = Enumeration.new({
  name: 'IntercardinalDirection',
  values: ['N', 'S', 'E', 'W', 'NW', 'SW', 'NE', 'SE']
}, {
  opposite () {
    switch (this) {
      case IntercardinalDirection.N:
        return IntercardinalDirection.S
      case IntercardinalDirection.S:
        return IntercardinalDirection.N
      case IntercardinalDirection.E:
        return IntercardinalDirection.W
      case IntercardinalDirection.W:
        return IntercardinalDirection.E
      case IntercardinalDirection.NW:
        return IntercardinalDirection.SE
      case IntercardinalDirection.SW:
        return IntercardinalDirection.NE
      case IntercardinalDirection.NE:
        return IntercardinalDirection.SW
      case IntercardinalDirection.SE:
        return IntercardinalDirection.NW
    }
  }
})

module.exports = IntercardinalDirection
