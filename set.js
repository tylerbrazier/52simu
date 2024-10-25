export default containsSets
import { simulate } from './base.js'
import { fileURLToPath } from 'node:url'

// returns the first n sets of size s
function containsSets(hand, s, n=1) {
	var ranks = {}
	var result = []
	for (var i = 0; i < hand.length; i++) {
		var r = hand[i].rank
		if (!ranks[r]) ranks[r] = []
		ranks[r].push(hand[i])
		if (ranks[r].length >= s) {
			result.push(ranks[r])
			result = result.flat()
			if (result.length === s*n)
				return result
		}
	}
	return false
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	for (var h=10; h<=20; h+=5) {
		console.log(h, 'card hand:')

		process.stdout.write('Pair: ')
		simulate(hand => containsSets(hand, 2), h)

		process.stdout.write('Two Pair: ')
		simulate(hand => containsSets(hand, 2, 2), h)

		if (h >= 6) {
			process.stdout.write('Three Pair: ')
			simulate(hand => containsSets(hand, 2, 3), h)
		}

		if (h >= 8) {
			process.stdout.write('Four Pair: ')
			simulate(hand => containsSets(hand, 2, 4), h)
		}

		process.stdout.write('Three of a kind: ')
		simulate(hand => containsSets(hand, 3), h)

		if (h >= 6) {
			process.stdout.write('Two sets of three: ')
			simulate(hand => containsSets(hand, 3, 2), h)
		}
		if (h >= 9) {
			process.stdout.write('Three sets of three: ')
			simulate(hand => containsSets(hand, 3, 3), h)
		}

		process.stdout.write('Four of a kind: ')
		simulate(hand => containsSets(hand, 4), h)

		console.log()
	}
}
