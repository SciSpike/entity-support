/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const uuid = require('uuid').v4
const { traits } = require('@ballistagroup/mutrait')
const { Treeness } = require('../../../main/traits')
const {
  IllegalArgumentError,
  MissingRequiredArgumentError
} = require('@ballistagroup/error-support')
const { TreeCircularityError } = require('../../../main/errors')

describe('unit tests of Treeness', () => {
  it('should work', function () {
    class Node extends traits(Treeness) {
      constructor ({ parent, name, equalityComparator } = {}) {
        super(...arguments)

        this.id = uuid()
        this.name = name
        this._equalityComparator = equalityComparator

        if (parent) this.setParent(parent, equalityComparator)
      }
    }

    for (const equalityComparator of [
      (x, y) => x === y || x?.name === y?.name,
      (x, y) => x === y || x?.id === y?.id
    ]) {
      const root = new Node({ name: 'root', equalityComparator })
      expect(root.root).to.equal(root)
      expect(root.childrenRecursively).to.deep.equal([])
      expect(root.asNodeList(it => it.name)).to.deep.equal([root.name])
      expect(root.asNodeMapByProperty('id')).to.deep.equal({ [root.id]: root })

      const a1 = new Node({ parent: root, name: 'a1', equalityComparator })
      expect(root.containsChild(a1)).to.be.true()
      expect(a1.containedByParent(root)).to.be.true()
      expect(root.childCount).to.equal(1)
      expect(root.children).to.deep.equal([a1])
      expect(root.childrenRecursively).to.deep.equal([a1])
      expect(root.asNodeList().map(it => it.name).sort()).to.deep.equal(['a1', 'root'])
      expect(root.asNodeMapByProperty('id')).to.deep.equal({ [root.id]: root, [a1.id]: a1 })

      const a2 = new Node({ parent: root, name: 'a2', equalityComparator })
      expect(root.containsChild(a2)).to.be.true()
      expect(a1.containedByParent(root)).to.be.true()
      expect(root.childCount).to.equal(2)
      expect(root.children).to.deep.equal([a1, a2])
      expect(root.childrenRecursively).to.deep.equal([a1, a2])
      expect(root.asNodeList().map(it => it.name).sort()).to.deep.equal(['a1', 'a2', 'root'])
      expect(root.asNodeMapByProperty('id')).to.deep.equal({ [root.id]: root, [a1.id]: a1, [a2.id]: a2 })

      expect(() => root.addChild()).to.throw(MissingRequiredArgumentError)
      expect(() => root.addChild(root)).to.throw(TreeCircularityError)
      expect(() => a1.addChild(root)).to.throw(TreeCircularityError)
      expect(() => a1.addChild(a2)).to.throw(IllegalArgumentError)

      let node1
      expect(() => { // ensure usage of duplicate names/ids throws
        node1 = new Node({ parent: a1, name: 'bob', equalityComparator })
        expect(node1.root).to.equal(root)
        expect(node1.existsInTree(node1)).to.be.true()
        const node2 = new Node({ name: node1.name, equalityComparator })
        node2.id = node1.id
        node2.node2 = true
        root.addChild(node2)
        a1.removeChild(node1)
        expect(node2.isRoot).to.be.true()
      }).to.throw(TreeCircularityError)
      a1.removeChild(node1)

      const a1b1 = new Node({ parent: a1, name: 'a1b1', equalityComparator })
      expect(root.containsChild(a1b1, { recursively: false, equalityComparator })).to.be.false()
      expect(root.containsChild(a1b1, { recursively: true, equalityComparator })).to.be.true()
      expect(a1b1.containedByParent(root, { recursively: false, equalityComparator })).to.be.false()
      expect(a1b1.containedByParent(root, { recursively: true, equalityComparator })).to.be.true()
      expect(root.childrenRecursively).to.deep.equal([a1, a2, a1b1])
      expect(root.asNodeList().map(it => it.name).sort()).to.deep.equal(['a1', 'a1b1', 'a2', 'root'])
      expect(root.asNodeMapByProperty('id')).to.deep.equal({
        [root.id]: root,
        [a1.id]: a1,
        [a2.id]: a2,
        [a1b1.id]: a1b1
      })

      expect(root.asNodeList(it => it.name).sort()).to.deep.equal(['a1', 'a1b1', 'a2', 'root'])

      expect(() => root.removeChild(root)).to.throw(IllegalArgumentError)
      expect(() => root.removeChild(a1b1)).to.throw(IllegalArgumentError)
      expect(root.removeChild(a2)).to.equal(root)
      expect(root.childCount).to.equal(1)
      expect(root.children[0]).to.equal(a1)

      root.removeChild(a1)
      expect(a1.parent).not.to.be.ok()
      expect(root.children.includes(a1)).to.be.false()
      expect(root.childrenRecursively.includes(a1b1)).to.be.false()
      expect(a1.isRoot).to.be.true()

      class NotNode {}

      expect(() => root.addChild(new NotNode())).to.throw(IllegalArgumentError)
      expect(() => { root.setParent(new NotNode()) }).to.throw(IllegalArgumentError)
    }
  })
})
