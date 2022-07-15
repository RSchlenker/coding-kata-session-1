import * as R from 'ramda'
import { complement } from 'ramda'

export const player = () => {
	return {
		health: 100,
		level: 1,
	}
}
export const alive = R.pipe(R.prop('health'), R.gt(R.__, 0))

export const dealDamage = R.curry((playerA, playerB, damage) => {
	const actualDamage = damage * getDamageModifier(playerA, playerB)
	return R.unless(R.identical(playerA), subtractDamage(actualDamage))(playerB)
})

export const heal = R.curry((healedPlayer, amount) => {
	const limit = healedPlayer.level < 5 ? 1000 : 1500
	return R.unless(complement(alive), addHealth(amount, limit))(healedPlayer)
})

export const setLevel = (player, level) => {
	return R.assoc('level', level, player)
}

const addHealth = (healthPoints, limit) => {
	return R.evolve({
		health: addUntil(R.__, healthPoints, limit),
	})
}

const subtractDamage = (damage) =>
	R.evolve({
		health: R.subtract(R.__, damage),
	})

export const addUntil = R.curry((a, b, limit) => {
	return R.min(a + b, limit)
})

export const getDamageModifier = (attacker, defender) => {
	return R.pipe(
		R.prop('level'),
		R.subtract(defender.level),
		R.cond([
			[R.gte(R.__, 5), R.always(0.5)],
			[R.lte(R.__, -5), R.always(1.5)],
			[R.T, R.always(1)],
		])
	)(attacker)
}

// export const getDamageModifierImperativ = (attacker, defender) => {
// 	const difference = attacker.level - defender.level
// 	if (difference >= 5) {
// 		return 1.5
// 	} else if (difference <= -5) {
// 		return 0.5
// 	} else {
// 		return 1
// 	}
// }
