import { alive, dealDamage, heal, player } from "../src/role-play-game.js";
import * as R from "ramda";

it("should create players with 100 health", () => {
  expect(player().health).toBe(100);
});

it("should check if new players are alive", () => {
  expect(alive(player())).toBe(true);
});

it("should deal damage", () => {
  const player1 = player();
  const player2 = player();
  const player2Copy = dealDamage(player1, player2, 50);
  expect(player2Copy.health).toBe(50);
});

it("should not deal damage to itself", () => {
  const player1 = player();
  const result = dealDamage(player1, player1, 50);
  expect(result.health).toBe(100);
});

it("should heal himself", () => {
  const player1 = player();
  const result = R.pipe(
    dealDamage(player(), R.__, 50),
    heal(R.__, 45)
  )(player1);
  expect(result.health).toBe(95);
});

it("should prevent dead players from healing", () => {
  const result = R.pipe(
    dealDamage(player(), R.__, 101),
    heal(R.__, 50)
  )(player());
  expect(result.health).toBeLessThan(0);
});
