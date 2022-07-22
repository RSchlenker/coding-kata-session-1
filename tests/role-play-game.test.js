import {
	addUntil,
	alive,
	dealDamage,
	getDamageModifier,
	heal,
	isAlly,
	isEnemy,
	join,
	leave,
	player,
	selfHeal,
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
			selfHeal(R.__, 45)
		)(player1)
		expect(result.health).toBe(95)
	})

	it('should prevent dead players from healing', () => {
		const result = R.pipe(
			player,
			dealDamage(player(), R.__, 101),
			selfHeal(R.__, 50)
		)()
		expect(result.health).toBeLessThan(0)
	})
})

describe('levels', () => {
	it('should give every new player level 1', () => {
		expect(player().level).toBe(1)
	})
	it('should not be able to have health above 1000 below level 5', () => {
		expect(selfHeal(player(), 1500).health).toBe(1000)
	})
	it('should set level', () => {
		expect(setLevel(player(), 6).level).toBe(6)
	})
	it('should be healable to 1500 when level is > 6', () => {
		const higherRankPlayer = setLevel(player(), 6)
		expect(selfHeal(higherRankPlayer, 2000).health).toBe(1500)
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

describe('factions', () => {
	test('players can join a faction ', () => {
		expect(join('faction-name', player()).factions).toEqual(['faction-name'])
	})

	test('players can join multiple factions', () => {
		const result = R.pipe(player, join('faction-1'), join('faction-2'))()
		expect(result.factions).toEqual(['faction-1', 'faction-2'])
	})

	test('players can leave a faction', () => {
		const result = R.pipe(player, join('faction'), leave('faction'))()
		expect(result.factions).toEqual([])
	})

	test('does not break if leaves non-existing faction', () => {
		const result = R.pipe(player, leave('faction'))()
		expect(result.factions).toEqual([])
	})

	const playerOfFaction = R.pipe(player, join('faction'))
	test('allied players cannot deal damage to each other', () => {
		const result = dealDamage(playerOfFaction(), playerOfFaction(), 50)
		expect(result.health).toBe(100)
	})

	test('isAlly', () => {
		expect(isAlly(playerOfFaction(), playerOfFaction())).toBe(true)
		expect(isAlly(playerOfFaction(), player())).toBe(false)
		const samePlayer = playerOfFaction()
		expect(isAlly(samePlayer, samePlayer)).toBe(true)
	})

	test('isEnemy', () => {
		expect(isEnemy(player(), playerOfFaction())).toBe(true)
	})

	test('players can heal allied players', () => {
		const result = heal(playerOfFaction(), playerOfFaction(), 50)
		expect(result.health).toBe(150)
	})

	test('players cannot heal non-allied players', () => {
		expect(heal(player(), playerOfFaction(), 50).health).toBe(100)
	})
})

it('should add up until', () => {
	expect(addUntil(10, 10, 15)).toBe(15)
})
