'use strict'

const { Trait } = require('@ballistagroup/mutrait')
const property = require('@northscaler/property-decorator')
const { IllegalArgumentError, IllegalStateError } = require('@ballistagroup/error-support')

const Recurrable = Trait(superclass =>
  class extends superclass {
    @property()
    _intervalMillis

    @property()
    _intervalId

    start () {
      this.intervalId = setInterval(
        this._onInterval.bind(this),
        this._intervalMillis
      )
    }

    stop () {
      if (!this.intervalId) {
        throw new IllegalStateError({ message: 'not currently started' })
      }

      clearInterval(this.intervalId)
      delete this.intervalId
    }

    async _onInterval () {}

    _testSetIntervalMillis (ms) {
      ms = parseInt(ms)
      if (isNaN(ms) || ms < 1) {
        throw new IllegalArgumentError({
          message: 'interval must be > 0',
          info: { intervalMillis: ms }
        })
      }
      return ms
    }
  }
)

module.exports = Recurrable
