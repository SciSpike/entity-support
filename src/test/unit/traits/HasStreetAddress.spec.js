/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const { trait } = require('@ballistagroup/mutrait')
const { HasStreetAddress } = require('../../../main/traits')
const { UsStreetAddress } = require('../../../main/entities/Location')
const { IllegalArgumentError } = require('@ballistagroup/error-support')

describe('unit tests of Locatable', () => {
  it('should work', () => {
    class FakeHasStreetAddress extends trait(HasStreetAddress) {
      constructor (streetAddress) {
        super(...arguments)
        this.streetAddress = streetAddress
      }
    }

    expect(() => new FakeHasStreetAddress({})).to.throw(IllegalArgumentError)

    const a = new UsStreetAddress({
      streetNumber: 123,
      streetName: 'Any St.',
      city: 'Cityville',
      state: 'TX',
      zip: 54321
    })

    const it = new FakeHasStreetAddress(a)
    const a2 = it.streetAddress
    a2.streetNumber = parseInt(a.streetNumber) + 1

    expect(a.streetNumber).not.to.equal(a2.streetNumber)
  })
})
