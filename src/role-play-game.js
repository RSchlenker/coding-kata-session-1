//functional style
import * as R from "ramda";
import { complement } from "ramda";

export const player = () => R.objOf("health", 100);
export const alive = R.pipe(R.prop("health"), R.gt(R.__, 0));

export const dealDamage = R.curry((playerA, playerB, damage) => {
  return R.unless(R.identical(playerA), subtractDamage(damage))(playerB);
});

export const heal = R.curry((healedPlayer, amount) => {
  return R.unless(complement(alive), addHealth(amount))(healedPlayer);
});

const addHealth = (healthPoints) =>
  R.evolve({
    health: R.add(healthPoints),
  });

const subtractDamage = (damage) =>
  R.evolve({
    health: R.subtract(R.__, damage),
  });
