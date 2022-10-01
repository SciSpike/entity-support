/* global describe, it */
'use strict'

const moment = require('moment')

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const DatePeriod = require('../../../main/entities/DatePeriod')
const { IllegalArgumentError } = require('@ballistagroup/error-support')

describe('unit tests of DatePeriod', function () {
  it('should disallow invalid states', () => {
    const p = new DatePeriod(moment.utc('2018-01-01'), moment.utc('2018-01-02'))
    expect(() => {
      p.begin = p.end.add(1, 'day')
    }).to.throw(IllegalArgumentError)
    expect(() => {
      p.end = p.begin.add(-1, 'day')
    }).to.throw(IllegalArgumentError)
  })
  it('should disallow invalid begin granularity', () => {
    expect(
      () =>
        new DatePeriod(
          moment.utc('2018-01-01T01:00Z'),
          moment.utc('2018-01-02')
        )
    ).to.throw(IllegalArgumentError)
  })
  it('should disallow invalid end granularity', () => {
    expect(
      () =>
        new DatePeriod(
          moment.utc('2018-01-01'),
          moment.utc('2018-01-02T01:00Z')
        )
    ).to.throw(IllegalArgumentError)
  })
  it('should contain or not correctly', function () {
    let container = new DatePeriod(
      moment.utc('2018-01-01'),
      moment.utc('2018-01-03')
    )
    let candidate = new DatePeriod(container.begin, container.end)
    expect(container.containsPeriod(candidate)).to.be.true()
    expect(container.equals(candidate)).to.be.true()

    candidate = new DatePeriod(
      container.begin.add(1, 'day'),
      container.end.add(-1, 'day')
    )
    expect(container.containsPeriod(candidate)).to.be.true()

    candidate = new DatePeriod(container.begin, container.end.add(1, 'day'))
    expect(container.containsPeriod(candidate)).to.be.false()

    candidate = new DatePeriod(container.begin.add(-1, 'day'), container.end)
    expect(container.containsPeriod(candidate)).to.be.false()

    candidate = new DatePeriod(
      container.begin.add(-1, 'day'),
      container.end.add(1, 'day')
    )
    expect(container.containsPeriod(candidate)).to.be.false()

    candidate = new DatePeriod(container.end, container.end.add(1, 'day'))
    expect(container.containsPeriod(candidate)).to.be.false()

    container = new DatePeriod().withBegin(moment.utc('2018-01-01'))
    expect(
      container.containsPeriod(new DatePeriod().withBegin(container.begin))
    ).to.be.true()
    expect(
      container.containsPeriod(
        new DatePeriod().withBegin(container.begin.add(1, 'day'))
      )
    ).to.be.true()
    expect(
      container.containsPeriod(
        new DatePeriod().withBegin(container.begin.add(-1, 'day'))
      )
    ).to.be.false()

    container = new DatePeriod().withEnd(moment.utc('2018-01-01'))
    expect(
      container.containsPeriod(new DatePeriod().withEnd(container.end))
    ).to.be.true()
    expect(
      container.containsPeriod(
        new DatePeriod().withEnd(container.end.add(1, 'day'))
      )
    ).to.be.false()
    expect(
      container.containsPeriod(
        new DatePeriod().withEnd(container.end.add(-1, 'day'))
      )
    ).to.be.true()

    container = new DatePeriod()
    candidate = new DatePeriod()
    expect(container.containsPeriod(candidate)).to.be.true()
    expect(container.equals(candidate)).to.be.true()
  })

  it('should overlap or not correctly', function () {
    let a = new DatePeriod(moment.utc('2018-01-01'), moment.utc('2018-01-04'))
    let b = new DatePeriod(a.begin, a.end)
    expect(a.overlaps(b)).to.be.true()
    expect(a.equals(b)).to.be.true()

    b = new DatePeriod(a.begin.add(1, 'day'), a.end.add(-1, 'day'))
    expect(a.overlaps(b)).to.be.true()

    b = new DatePeriod(a.begin, a.end.add(1, 'day'))
    expect(a.overlaps(b)).to.be.true()

    b = new DatePeriod(a.begin.add(-1, 'day'), a.end)
    expect(a.overlaps(b)).to.be.true()

    b = new DatePeriod(a.begin.add(-1, 'day'), a.end.add(1, 'day'))
    expect(a.overlaps(b)).to.be.true()

    b = new DatePeriod(a.end, a.end.add(1, 'day'))
    expect(a.overlaps(b)).to.be.false()

    a = new DatePeriod().withBegin(moment.utc('2018-01-01'))
    expect(a.overlaps(new DatePeriod().withBegin(a.begin))).to.be.true()
    expect(
      a.overlaps(new DatePeriod().withBegin(a.begin.add(1, 'day')))
    ).to.be.true()
    expect(
      a.overlaps(new DatePeriod().withBegin(a.begin.add(-1, 'day')))
    ).to.be.true()

    a = new DatePeriod().withEnd(moment.utc('2018-01-01'))
    expect(a.overlaps(new DatePeriod().withEnd(a.end))).to.be.true()
    expect(
      a.overlaps(new DatePeriod().withEnd(a.end.add(1, 'day')))
    ).to.be.true()
    expect(
      a.overlaps(new DatePeriod().withEnd(a.end.add(-1, 'day')))
    ).to.be.true()

    a = new DatePeriod()
    b = new DatePeriod()
    expect(a.overlaps(b)).to.be.true()
    expect(a.equals(b)).to.be.true()
  })
})
