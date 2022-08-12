import * as R from "ramda";

export const getCharCodeRange = R.curry((from, to) =>
  R.range(from.charCodeAt(0), to.charCodeAt(0) + 1)
);

export const mapWithIndex = R.curry((fn, range) => {
  return range.map(fn);
});

const toDiamondRow = (charCode, index, range) => {
  const letter = String.fromCharCode(charCode);
  const maxIndex = range.length;
  const tabs = getTabs(maxIndex - index);
  const middleTabs = getTabs(2 * maxIndex - 2 * (maxIndex - index) - 1);
  const isFirstRow = index === 0;
  if (isFirstRow) {
    return `${tabs}${letter}${tabs}\n`;
  } else {
    return `${tabs}${letter}${middleTabs}${letter}${tabs}\n`;
  }
};

export const addDescendingRows = (list) =>
  R.concat(list, R.pipe(R.dropLast(1), R.reverse)(list));

export const diamond = R.pipe(
  getCharCodeRange("A"),
  mapWithIndex(toDiamondRow),
  addDescendingRows,
  R.join("")
);

const getTabs = (number) => {
  return R.reduce((s) => s + " ", "", R.range(0, number));
};
