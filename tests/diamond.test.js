import {
  addDescendingRows,
  diamond,
  getCharCodeRange,
  mapWithIndex,
} from "../src/diamond.js";
import * as R from "ramda";

it("should print a diamond", () => {
  console.log(diamond("G"));
});

it("should return a range of charCodes", () => {
  expect(getCharCodeRange("A", "C")).toEqual([65, 66, 67]);
});

it("should map with index", () => {
  expect(mapWithIndex((v, index) => index, R.range(0, 3))).toEqual([0, 1, 2]);
});

it("should add descending rows", () => {
  expect(addDescendingRows(["A", "B", "C"])).toEqual(["A", "B", "C", "B", "A"]);
});
