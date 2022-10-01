/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const { trait } = require('@ballistagroup/mutrait')
const { HasGps } = require('../../../main/traits')
const { Gps } = require('../../../main/entities/Location')
const { IllegalArgumentError } = require('@ballistagroup/error-support')

describe('unit tests of HasGps', () => {
  it('should work', () => {
    class FakeHasGps extends trait(HasGps) {
      constructor (gps) {
        super(...arguments)
        this.gps = gps
      }
    }

    expect(() => new FakeHasGps({})).to.throw(IllegalArgumentError)

    const gps = new Gps({ lat: 12, lon: 12 })
    const it = new FakeHasGps(gps)
    const gps2 = it.gps
    gps2.lat = gps.lat.degrees + 1
    expect(gps.lat.degrees).not.to.equal(gps2.lat.degrees)
  })
})
