import { assert } from "console";

export function randomChoices<T>(list: T[], amount: number): T[] {
  if (amount > list.length) {
    throw Error("Not enough items");
  }

  const copy = [...list];

  const newArray = [];

  for (let i = 0; i < amount; i++) {
    const randomNum = Math.floor(Math.random() * copy.length);
    const splicedItem = copy.splice(randomNum, 1)[0];
    newArray.push(splicedItem);
  }

  return newArray;
}
