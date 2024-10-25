import test from 'node:test'
import assert from 'node:assert'
import { containsRun, suitCriteria } from './run.js'

test('containsRun', async t => {
	await t.test('no aces run of 3', t => {
		var hand = [
			{ rank:6, suit:'s' },
			{ rank:8, suit:'h' },
			{ rank:'K', suit:'d' },
			{ rank:7, suit:'s' },
			{ rank:2, suit:'c' },
		]
		var expected = [
			{ rank:6, suit:'s' },
			{ rank:7, suit:'s' },
			{ rank:8, suit:'h' },
		]
		assert.deepStrictEqual(containsRun(hand, 3), expected)
	})
	await t.test('no aces, one short of run of 4', t => {
		var hand = [
			{ rank:6, suit:'s' },
			{ rank:8, suit:'h' },
			{ rank:'K', suit:'d' },
			{ rank:7, suit:'s' },
			{ rank:2, suit:'c' },
		]
		var expected = false
		assert.deepStrictEqual(containsRun(hand, 4), expected)
	})
	await t.test('aces low should not run with Q,K,A', t => {
		var hand = [
			{ rank:'A', suit:'s' },
			{ rank:8, suit:'h' },
			{ rank:'K', suit:'d' },
			{ rank:'Q', suit:'s' },
			{ rank:2, suit:'c' },
		]
		var expected = false
		assert.deepStrictEqual(containsRun(hand, 3, true, false), expected)
	})
	await t.test('aces high should run with Q,K,A', t => {
		var hand = [
			{ rank:'A', suit:'s' },
			{ rank:8, suit:'h' },
			{ rank:'K', suit:'d' },
			{ rank:'Q', suit:'s' },
			{ rank:2, suit:'c' },
		]
		var expected = [
			{ rank:'Q', suit:'s' },
			{ rank:'K', suit:'d' },
			{ rank:'A', suit:'s' },
		]
		assert.deepStrictEqual(containsRun(hand, 3, false, true), expected)
	})
	await t.test('aces high and low should wrap', t => {
		var hand = [
			{ rank:'A', suit:'s' },
			{ rank:8, suit:'h' },
			{ rank:'K', suit:'d' },
			{ rank:'J', suit:'s' },
			{ rank:2, suit:'c' },
		]
		var expected = [
			{ rank:'K', suit:'d' },
			{ rank:'A', suit:'s' },
			{ rank:2, suit:'c' },
		]
		assert.deepStrictEqual(containsRun(hand, 3, true, true), expected)
	})
	await t.test('aces neither high nor low', t => {
		var hand = [
			{ rank:'A', suit:'s' },
			{ rank:3, suit:'h' },
			{ rank:'K', suit:'d' },
			{ rank:'Q', suit:'s' },
			{ rank:2, suit:'c' },
		]
		var expected = false
		assert.deepStrictEqual(containsRun(hand, 3, false, false), expected)
	})
	await t.test('should work when run is > n', t => {
		var hand = [
			{ rank:9, suit:'s' },
			{ rank:3, suit:'h' },
			{ rank:'J', suit:'d' },
			{ rank:'Q', suit:'s' },
			{ rank:10, suit:'c' },
		]
		var expected = [
			{ rank:9, suit:'s' },
			{ rank:10, suit:'c' },
			{ rank:'J', suit:'d' },
		]

		assert.deepStrictEqual(containsRun(hand, 3), expected)
	})

	await t.test('false when run is not same color', t => {
		var hand = [
			{ rank:'4', suit:'s' },
			{ rank:3, suit:'h' },
			{ rank:'K', suit:'d' },
			{ rank:'Q', suit:'s' },
			{ rank:2, suit:'c' },
		]
		var acesHigh = false
		var acesLow = true
		var sameSuit = false
		var sameColor = true
		var expected = false
		assert.deepStrictEqual(containsRun(hand, 3, acesLow, acesHigh,
			sameSuit, sameColor), expected)
	})
	await t.test('false when run is not same suit (tho colors match)', t => {
		var hand = [
			{ rank:'4', suit:'s' },
			{ rank:3, suit:'c' },
			{ rank:'K', suit:'d' },
			{ rank:'Q', suit:'s' },
			{ rank:2, suit:'c' },
		]
		var acesHigh = false
		var acesLow = true
		var sameSuit = true
		var sameColor = false
		var expected = false
		assert.deepStrictEqual(containsRun(hand, 3, acesLow, acesHigh,
			sameSuit, sameColor), expected)
	})
	await t.test('false when run is not same suit (and colors do not match)', t => {
		var hand = [
			{ rank:'4', suit:'s' },
			{ rank:3, suit:'d' },
			{ rank:'K', suit:'d' },
			{ rank:'Q', suit:'s' },
			{ rank:2, suit:'c' },
		]
		var acesHigh = false
		var acesLow = true
		var sameSuit = true
		var sameColor = false
		var expected = false
		assert.deepStrictEqual(containsRun(hand, 3, acesLow, acesHigh,
			sameSuit, sameColor), expected)
	})
	await t.test('false when sameColor=true && sameSuit=true and colors match but suit does not', t => {
		var hand = [
			{ rank:'4', suit:'d' },
			{ rank:3, suit:'h' },
			{ rank:'K', suit:'d' },
			{ rank:'Q', suit:'s' },
			{ rank:2, suit:'d' },
		]
		var acesHigh = false
		var acesLow = true
		var sameSuit = true
		var sameColor = true
		var expected = false
		assert.deepStrictEqual(containsRun(hand, 3, acesLow, acesHigh,
			sameSuit, sameColor), expected)
	})
	await t.test('true when is same color (and suit)', t => {
		var hand = [
			{ rank:'4', suit:'d' },
			{ rank:3, suit:'d' },
			{ rank:'K', suit:'d' },
			{ rank:'Q', suit:'s' },
			{ rank:2, suit:'d' },
		]
		var acesHigh = false
		var acesLow = false
		var sameSuit = false
		var sameColor = true
		var expected = false
		assert.deepStrictEqual(containsRun(hand, 3, acesLow, acesHigh,
			sameSuit, sameColor), expected)
	})
	await t.test('true when is same color (but not suit)', t => {
		var hand = [
			{ rank:'4', suit:'h' },
			{ rank:3, suit:'d' },
			{ rank:'K', suit:'d' },
			{ rank:'Q', suit:'s' },
			{ rank:2, suit:'h' },
		]
		var acesHigh = false
		var acesLow = false
		var sameSuit = false
		var sameColor = true
		var expected = false
		assert.deepStrictEqual(containsRun(hand, 3, acesLow, acesHigh,
			sameSuit, sameColor), expected)
	})
	await t.test('true when is same suit', t => {
		var hand = [
			{ rank:'4', suit:'h' },
			{ rank:3, suit:'h' },
			{ rank:'K', suit:'d' },
			{ rank:'Q', suit:'s' },
			{ rank:2, suit:'h' },
		]
		var acesHigh = false
		var acesLow = false
		var sameSuit = true
		var sameColor = false
		var expected = false
		assert.deepStrictEqual(containsRun(hand, 3, acesLow, acesHigh,
			sameSuit, sameColor), expected)
	})
})
test('suitCriteria', async t => {
	await t.test('d sameSuit -> [d]', t => {
		var card = { rank: 'A', suit: 'd' }
		var sameSuit = true
		var sameColor = false
		var expected = ['d']
		assert.deepStrictEqual(suitCriteria(card, sameSuit, sameColor), expected)
	})
	await t.test('d sameColor -> [d,h]', t => {
		var card = { rank: '4', suit: 'd' }
		var sameSuit = false
		var sameColor = true
		var expected = ['d', 'h']
		assert.deepStrictEqual(suitCriteria(card, sameSuit, sameColor), expected)
	})
	await t.test('c sameSuit -> [c]', t => {
		var card = { rank: '7', suit: 'c' }
		var sameSuit = true
		var sameColor = false
		var expected = ['c']
		assert.deepStrictEqual(suitCriteria(card, sameSuit, sameColor), expected)
	})
	await t.test('s sameColor -> [c,s]', t => {
		var card = { rank: 'A', suit: 's' }
		var sameSuit = false
		var sameColor = true
		var expected = ['c', 's']
		assert.deepStrictEqual(suitCriteria(card, sameSuit, sameColor), expected)
	})
	await t.test('s sameColor && sameSuit -> [s]', t => {
		var card = { rank: 'Q', suit: 's' }
		var sameSuit = true
		var sameColor = true
		var expected = ['s']
		assert.deepStrictEqual(suitCriteria(card, sameSuit, sameColor), expected)
	})
	await t.test('h sameColor && sameSuit -> [h]', t => {
		var card = { rank: 'K', suit: 'h' }
		var sameSuit = true
		var sameColor = true
		var expected = ['h']
		assert.deepStrictEqual(suitCriteria(card, sameSuit, sameColor), expected)
	})
	await t.test('sameColor=false && sameSuit=false -> [c, d, h, s]', t => {
		var card = { rank: 'K', suit: 'h' }
		var sameSuit = false
		var sameColor = false
		var expected = ['c', 'd', 'h', 's']
		assert.deepStrictEqual(suitCriteria(card, sameSuit, sameColor), expected)
	})
})
