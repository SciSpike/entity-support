/* global describe it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const { trait } = require('@ballistagroup/mutrait')
const {
  MissingRequiredArgumentError,
  IllegalArgumentException
} = require('@ballistagroup/error-support')

const IdentifiableByInteger = require('../../../main/traits/IdentifiableByInteger')

class FakeIdentifiable extends trait(IdentifiableByInteger) {
  constructor ({ id } = {}) {
    super(...arguments)
    if (id) this.id = id
  }
}

describe('unit tests of IdentifiableByInteger', () => {
  it('should happily work', () => {
    for (const id of [1, '1']) {
      for (const fi of [
        new FakeIdentifiable({ id }),
        new FakeIdentifiable().withId(id)
      ]) {
        const idAsInt = parseInt(id)
        expect(fi.id).to.equal(idAsInt)

        expect(() => {
          fi.id = null
        }).to.throw(MissingRequiredArgumentError)
        expect(fi.id).to.equal(idAsInt)

        expect(() => {
          fi.id = undefined
        }).to.throw(MissingRequiredArgumentError)
        expect(fi.id).to.deep.equal(idAsInt)

        const id2 = 2
        fi.id = id2
        expect(fi.id).to.deep.equal(id2)
      }
    }
  })

  it('should saddily work', function () {
    for (const id of [NaN, 'x', '', 1.2, '1.2']) {
      expect(() => new FakeIdentifiable().withId(id)).to.throw(
        IllegalArgumentException
      )
    }
  })
})
