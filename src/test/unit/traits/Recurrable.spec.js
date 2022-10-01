/* global describe it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const { trait } = require('@ballistagroup/mutrait')
const Recurrable = require('../../../main/traits/Recurrable')

class FakeRecurrable extends trait(Recurrable) {
  constructor (cb) {
    super()
    this.i = 0
    this.cb = cb
  }

  _onInterval () {
    this.i++
    this.stop()
    this.cb()
  }
}

describe('unit tests of Recurrable', function () {
  it('should work', function (done) {
    const ms = 50
    const recurrable = new FakeRecurrable(done)
    expect(() => {
      recurrable.intervalMillis = -ms
    }).to.throw()
    recurrable.intervalMillis = ms
    expect(recurrable.intervalMillis).to.be.equal(ms)
    recurrable.start()
  })
})
