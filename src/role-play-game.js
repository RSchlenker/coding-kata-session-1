import * as R from 'ramda'
import { complement } from 'ramda'

export const player = () => {
	return {
		health: 100,
		level: 1,
		factions: [],
	}
}
export const alive = R.pipe(R.prop('health'), R.gt(R.__, 0))
const dead = complement(alive)

export const dealDamage = R.curry((playerA, playerB, damage) => {
	const actualDamage = damage * getDamageModifier(playerA, playerB)
	return R.unless(R.identical(playerA), subtractDamage(actualDamage))(playerB)
})

export const heal = R.curry((healingPlayer, healedPlayer, amount) => {
	const limit = healedPlayer.level < 5 ? 1000 : 1500
	return R.unless(
		R.either(dead, isEnemy(healingPlayer)),
		addHealth(amount, limit)
	)(healedPlayer)
})

export const selfHeal = R.curry((player, amount) =>
	heal(player, player, amount)
)

export const join = R.curry((factionName, player) => {
	return R.evolve(
		{
			factions: R.append(factionName),
		},
		player
	)
})

export const leave = R.curry((factionName, player) => {
	return R.evolve(
		{
			factions: R.reject(R.equals(factionName)),
		},
		player
	)
})

export const isAlly = R.curry((player1, player2) => {
	return R.or(
		R.intersection(player1.factions, player2.factions).length > 0,
		R.identical(player1, player2)
	)
})
export const isEnemy = R.complement(isAlly)

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
	if (isAlly(attacker, defender)) {
		return 0
	}
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
