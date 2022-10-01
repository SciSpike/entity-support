/* global describe, it */
'use strict'

const moment = require('moment')

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const Period = require('../../../main/entities/Period')
const { IllegalArgumentError } = require('@ballistagroup/error-support')

describe('unit tests of Period', function () {
  it('should disallow invalid states', () => {
    const p = new Period(
      moment('2018-01-01T00:00Z').utc(),
      moment('2018-01-01T01:00Z').utc()
    )
    expect(() => {
      p.begin = p.end.add(1, 'minute')
    }).to.throw(IllegalArgumentError)
    expect(() => {
      p.end = p.begin.add(-1, 'minute')
    }).to.throw(IllegalArgumentError)
  })

  it('should contain or not correctly', function () {
    let container = new Period(
      moment('2018-01-01T00:00Z').utc(),
      moment('2018-01-01T01:00Z').utc()
    )
    let candidate = new Period(container.begin, container.end)
    expect(container.containsPeriod(candidate)).to.be.true()
    expect(container.equals(candidate)).to.be.true()

    candidate = new Period(
      container.begin.add(1, 'minute'),
      container.end.add(-1, 'minute')
    )
    expect(container.containsPeriod(candidate)).to.be.true()

    candidate = new Period(container.begin, container.end.add(1, 'minute'))
    expect(container.containsPeriod(candidate)).to.be.false()

    candidate = new Period(container.begin.add(-1, 'minute'), container.end)
    expect(container.containsPeriod(candidate)).to.be.false()

    candidate = new Period(
      container.begin.add(-1, 'minute'),
      container.end.add(1, 'minute')
    )
    expect(container.containsPeriod(candidate)).to.be.false()

    candidate = new Period(container.end, container.end.add(1, 'minute'))
    expect(container.containsPeriod(candidate)).to.be.false()

    container = new Period().withBegin(moment('2018-01-01T00:00Z').utc())
    expect(
      container.containsPeriod(new Period().withBegin(container.begin))
    ).to.be.true()
    expect(
      container.containsPeriod(
        new Period().withBegin(container.begin.add(1, 'minute'))
      )
    ).to.be.true()
    expect(
      container.containsPeriod(
        new Period().withBegin(container.begin.add(-1, 'minute'))
      )
    ).to.be.false()

    container = new Period().withEnd(moment('2018-01-01T00:00Z').utc())
    expect(
      container.containsPeriod(new Period().withEnd(container.end))
    ).to.be.true()
    expect(
      container.containsPeriod(
        new Period().withEnd(container.end.add(1, 'minute'))
      )
    ).to.be.false()
    expect(
      container.containsPeriod(
        new Period().withEnd(container.end.add(-1, 'minute'))
      )
    ).to.be.true()

    container = new Period()
    candidate = new Period()
    expect(container.containsPeriod(candidate)).to.be.true()
    expect(container.equals(candidate)).to.be.true()
  })

  it('should overlap or not correctly', function () {
    let a = new Period(
      moment('2018-01-01T00:00Z').utc(),
      moment('2018-01-01T01:00Z').utc()
    )
    let b = new Period(a.begin, a.end)
    expect(a.overlaps(b)).to.be.true()
    expect(a.equals(b)).to.be.true()

    b = new Period(a.begin.add(1, 'minute'), a.end.add(-1, 'minute'))
    expect(a.overlaps(b)).to.be.true()

    b = new Period(a.begin, a.end.add(1, 'minute'))
    expect(a.overlaps(b)).to.be.true()

    b = new Period(a.begin.add(-1, 'minute'), a.end)
    expect(a.overlaps(b)).to.be.true()

    b = new Period(a.begin.add(-1, 'minute'), a.end.add(1, 'minute'))
    expect(a.overlaps(b)).to.be.true()

    b = new Period(a.end, a.end.add(1, 'minute'))
    expect(a.overlaps(b)).to.be.false()

    a = new Period().withBegin(moment('2018-01-01T00:00Z').utc())
    expect(a.overlaps(new Period().withBegin(a.begin))).to.be.true()
    expect(
      a.overlaps(new Period().withBegin(a.begin.add(1, 'minute')))
    ).to.be.true()
    expect(
      a.overlaps(new Period().withBegin(a.begin.add(-1, 'minute')))
    ).to.be.true()

    a = new Period().withEnd(moment('2018-01-01T00:00Z').utc())
    expect(a.overlaps(new Period().withEnd(a.end))).to.be.true()
    expect(
      a.overlaps(new Period().withEnd(a.end.add(1, 'minute')))
    ).to.be.true()
    expect(
      a.overlaps(new Period().withEnd(a.end.add(-1, 'minute')))
    ).to.be.true()

    a = new Period()
    b = new Period()
    expect(a.overlaps(b)).to.be.true()
    expect(a.equals(b)).to.be.true()
  })

  it('should test length function', function () {
    let a = new Period(
      moment('2018-01-01T00:00Z').utc(),
      moment('2018-01-01T00:00Z').utc()
    )
    expect(a.length).to.equal(0)
    expect(new Period().length).to.equal(-1)
    a = new Period(
      moment('2018-01-01T00:00:00.000Z').utc(),
      moment('2018-01-01T00:00:00.001Z').utc()
    )
    expect(a.length).to.equal(1)
  })

  it('should return false for a non-moment', function () {
    const container = new Period()
    expect(container.containsMoment(undefined)).to.be.false()
    expect(container.containsMoment(null)).to.be.false()
    expect(container.containsMoment(moment())).to.be.true()
  })
})
