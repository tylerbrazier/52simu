export { containsRun, suitCriteria }
import { simulate } from './base.mjs'
import { fileURLToPath } from 'node:url'

// Returns the first run of size n found, false otherwise.
// If aces are high and low, then wrapping is allowed (K,A,2 counts as a run).
function containsRun(hand, n, acesLow=true, acesHigh=false,
		sameSuit=false, sameColor=false) {
	for (var i = 0; i < hand.length; i++) {
		var possibleSuits = suitCriteria(hand[i], sameSuit, sameColor)
		var sequence = run(hand, n, [hand[i]], acesLow, acesHigh,
			possibleSuits)
		if (sequence) return sequence
	}
	return false
}

// Recursive function that builds up a sequence of cards from hand,
// returning the sequence if it's n size or false if it can't reach it.
function run(hand, n, sequence, acesLow, acesHigh, possibleSuits) {
	if (sequence.length >= n) return sequence
	var nextRank = nextRankInSequence(sequence.at(-1), acesLow, acesHigh)
	var nextCard = containsCard(hand, nextRank, possibleSuits)
	if (nextCard) {
		sequence.push(nextCard)
		return run(hand, n, sequence, acesLow, acesHigh, possibleSuits)
	} else {
		return false
	}
}

function containsCard(hand, rank, possibleSuits) {
	if (!rank) return false
	for (var card of hand)
		if (card.rank === rank && possibleSuits.includes(card.suit))
			return card
	return false
}

// returns the rank of the next card in sequence
function nextRankInSequence(card, acesLow, acesHigh) {
	switch (card.rank) {
		case 10: return 'J'
		case 'J': return 'Q'
		case 'Q': return 'K'
		case 'K': return acesHigh ? 'A' : null
		case 'A': return acesLow ? 2 : null
		default: return card.rank+1
	}
}

// Returns an array of suits given a card and suit/color criteria
function suitCriteria(card, sameSuit, sameColor) {
	if (sameSuit) return [card.suit]
	if (sameColor) {
		var blackSuits = ['c', 's']
		var redSuits = ['d', 'h']
		if (blackSuits.includes(card.suit)) return blackSuits
		if (redSuits.includes(card.suit)) return redSuits
	}
	return ['c', 'd', 'h', 's']
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	for (var h = 5; h <= 5; h+=1) {
		console.log(h, 'card hand:')
		for (var r = 2; r <= 3; r++) {
			if (r > h) continue;

			process.stdout.write('Run of '+r+' same suit: ')
			simulate(hand => containsRun(hand, r, true, false,
				true, false), h)

			process.stdout.write('Run of '+r+' same color: ')
			simulate(hand => containsRun(hand, r, true, false,
				false, true), h)

			// process.stdout.write('Run of '+r+' (Aces low): ')
			// simulate(hand => containsRun(hand, r, true, false), h)

			// process.stdout.write('Aces high only: ')
			// simulate(hand => containsRun(hand, r, false, true), h)

			// process.stdout.write('Aces high and low: ')
			// simulate(hand => containsRun(hand, r, true, true), h)

		}
		console.log()
	}
}
