/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const { trait } = require('@ballistagroup/mutrait')

const Nameable = require('../../../main/traits/Nameable')

describe('unit tests of Nameable', () => {
  it('should work', () => {
    class FakeNameable extends trait(Nameable) {
      constructor (name) {
        super(...arguments)
        this.name = name
      }
    }

    const name = 'some name'
    const nameable = new FakeNameable(name)

    expect(nameable.name).to.be.ok()
    expect(nameable.name).to.equal(name)
  })
})
