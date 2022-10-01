/* global describe it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const uuid = require('uuid').v4

const { trait } = require('@ballistagroup/mutrait')
const { MissingRequiredArgumentError } = require('@ballistagroup/error-support')

const Identifiable = require('../../../main/traits/Identifiable')

describe('unit tests of Identifiable', () => {
  it('should work', () => {
    class FakeIdentifiable extends trait(Identifiable) {
      constructor ({ id } = {}) {
        super(...arguments)
        if (id) this.id = id
      }
    }

    const id = { it: uuid() }
    for (const fi of [new FakeIdentifiable({ id })]) {
      //, new FakeIdentifiable().withId(id)]) {
      expect(fi.id).to.deep.equal(id)

      expect(() => {
        fi.id = null
      }).to.throw(MissingRequiredArgumentError)
      expect(fi.id).to.deep.equal(id)

      expect(() => {
        fi.id = undefined
      }).to.throw(MissingRequiredArgumentError)
      expect(fi.id).to.deep.equal(id)

      const id2 = { it: uuid() }
      fi.id = id2
      expect(fi.id).to.deep.equal(id2)
    }

    const o1 = new FakeIdentifiable({ id: { foo: 1 } })
    const o2 = new FakeIdentifiable({ id: { foo: 1 } })
    expect(o1.identifies(o2)).to.be.true()
    expect(o1.identifies(null)).to.be.false()
    expect(o1.identifies(undefined)).to.be.false()
    expect(o1.identifies()).to.be.false()
    o2._id = undefined
    expect(o1.identifies(o2)).to.be.false()
    o2.id = { foo: 1 }
    expect(o1.identifies(o2)).to.be.true()
    o1._id = undefined
    expect(o1.identifies(o2)).to.be.false()
  })
})
