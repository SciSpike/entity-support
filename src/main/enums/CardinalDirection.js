'use strict'

const Enumeration = require('@ballistagroup/enum-support')

const CardinalDirection = Enumeration.new({
  name: 'CardinalDirection',
  values: ['N', 'S', 'E', 'W']
}, {
  opposite () {
    switch (this) {
      case CardinalDirection.N:
        return CardinalDirection.S
      case CardinalDirection.S:
        return CardinalDirection.N
      case CardinalDirection.E:
        return CardinalDirection.W
      case CardinalDirection.W:
        return CardinalDirection.E
    }
  }
})

module.exports = CardinalDirection
