import {
	addUntil,
	alive,
	dealDamage,
	getDamageModifier,
	heal,
	player,
	setLevel,
} from '../src/role-play-game.js'
import * as R from 'ramda'

describe('damage and health', () => {
	it('should create players with 100 health', () => {
		expect(player().health).toBe(100)
	})

	it('should check if new players are alive', () => {
		expect(alive(player())).toBe(true)
	})

	it('should deal damage', () => {
		const player1 = player()
		const player2 = player()
		const player2Copy = dealDamage(player1, player2, 50)
		expect(player2Copy.health).toBe(50)
	})

	it('should not deal damage to itself', () => {
		const player1 = player()
		const result = dealDamage(player1, player1, 50)
		expect(result.health).toBe(100)
	})

	it('should heal himself', () => {
		const player1 = player()
		const result = R.pipe(
			dealDamage(player(), R.__, 50),
			heal(R.__, 45)
		)(player1)
		expect(result.health).toBe(95)
	})

	it('should prevent dead players from healing', () => {
		const result = R.pipe(
			dealDamage(player(), R.__, 101),
			heal(R.__, 50)
		)(player())
		expect(result.health).toBeLessThan(0)
	})
})

describe('levels', () => {
	it('should give every new player level 1', () => {
		expect(player().level).toBe(1)
	})
	it('should not be able to have health above 1000 below level 5', () => {
		expect(heal(player(), 1500).health).toBe(1000)
	})
	it('should set level', () => {
		expect(setLevel(player(), 6).level).toBe(6)
	})
	it('should be healable to 1500 when level is > 6', () => {
		const higherRankPlayer = setLevel(player(), 6)
		expect(heal(higherRankPlayer, 2000).health).toBe(1500)
	})
	it('should calculate damage modifier', () => {
		expect(getDamageModifier(player(), setLevel(player(), 6))).toBe(0.5)
		expect(getDamageModifier(setLevel(player(), 6), player())).toBe(1.5)
	})
	it('should deal more damage when level difference is high', () => {
		const higherRankPlayer = setLevel(player(), 6)
		expect(dealDamage(higherRankPlayer, player(), 50).health).toBe(25)
	})
	it('should deal less damage when attacking player is lower', () => {
		const higherRankPlayer = setLevel(player(), 6)
		expect(dealDamage(player(), higherRankPlayer, 50).health).toBe(75)
	})
})

it('should add up until', () => {
	expect(addUntil(10, 10, 15)).toBe(15)
})
