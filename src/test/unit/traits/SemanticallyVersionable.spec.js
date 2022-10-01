/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const { trait } = require('@ballistagroup/mutrait')
const { IllegalArgumentError } = require('@ballistagroup/error-support')
const SemanticallyVersionable = require('../../../main/traits/SemanticallyVersionable')

describe('unit tests of SemanticallyVersionable', () => {
  it('should work', () => {
    class Fake extends trait(SemanticallyVersionable) {
      constructor (semver) {
        super(...arguments)
        this.semver = semver
      }
    }

    expect(() => new Fake('not a semver')).to.throw(IllegalArgumentError)
    const semver1 = '0.1.0-pre.0'
    const s1 = new Fake(semver1)

    const semver2 = '0.2.0'
    const s2 = new Fake(semver2)

    expect(s1._semverGt(s2.semver)).to.be.false()
    expect(s2._semverGt(s1.semver)).to.be.true()
    expect(s1._semverLt(s2.semver)).to.be.true()
    expect(s2._semverLt(s1.semver)).to.be.false()

    expect([s1, s2].sort(s1._semverComparator())).to.deep.equal([s1, s2])

    s2.semver = s1.semver
    expect(s2._semverGte(s1.semver)).to.be.true()
    expect(s1._semverLte(s2.semver)).to.be.true()
  })
})
