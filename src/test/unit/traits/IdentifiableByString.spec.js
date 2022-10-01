/* global describe it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const { trait } = require('@ballistagroup/mutrait')
const {
  MissingRequiredArgumentError,
  IllegalArgumentError
} = require('@ballistagroup/error-support')

const IdentifiableByString = require('../../../main/traits/IdentifiableByString')

class FakeIdentifiable extends trait(IdentifiableByString) {
  constructor ({ id } = {}) {
    super(...arguments)
    if (id) this.id = id
  }
}

describe('unit tests of IdentifiableByString', () => {
  it('should happily work', () => {
    for (const id of [1, '1']) {
      for (const fi of [
        new FakeIdentifiable({ id }),
        new FakeIdentifiable().withId(id)
      ]) {
        const idAsString = id.toString()
        expect(fi.id).to.equal(idAsString)

        expect(() => {
          fi.id = null
        }).to.throw(MissingRequiredArgumentError)
        expect(fi.id).to.equal(idAsString)

        expect(() => {
          fi.id = undefined
        }).to.throw(MissingRequiredArgumentError)
        expect(fi.id).to.equal(idAsString)

        const id2 = 2
        fi.id = id2
        expect(fi.id).to.equal(id2.toString())
      }
    }
  })

  it('should saddily work', function () {
    for (const id of [null, undefined]) {
      expect(() => new FakeIdentifiable().withId(id)).to.throw(
        IllegalArgumentError
      )
    }
  })
})
