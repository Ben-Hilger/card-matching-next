'use client';

import Card from "@/components/card";
import { shuffle } from "@/util/shuffle";
import { useEffect, useMemo, useState } from "react";
import _ from "lodash";

type GameTile = {
  correct: boolean,
  icon: string
}

export default function Home() {

  const squareDimensions = 4;

  const [icons, setIcons] = useState<GameTile[]>(Array(squareDimensions ** 2).fill(""));
  const [selected, setSelected] = useState<number[]>([]);

  const numberOfPairsCorrect = useMemo(() => {
    return icons.reduce((prev, curr) => curr.correct ? prev + 1 : prev, 0) / 2
  }, [icons])

  const allCorrect = useMemo(() => {
    return numberOfPairsCorrect === getSize() / 2;
  }, [numberOfPairsCorrect])

  const availableIcons: string[] = [
    "fa-code",
    "fa-bars",
    "fa-gear",
    "fa-bug",
    "fa-sitemap",
    "fa-mug-saucer",
    "fa-cube",
    "fa-microchip",
    "fa-code-branch"
  ];

  useEffect(function() {
    setup()
  }, [])


  function setup() {
    generateIconsToUse()
    setSelected([])
  }

  function getSize() {
    return squareDimensions ** 2;
  }

  function generateIconsToUse() {
    const iconsNeeded = getSize() / 2;
    const icons = availableIcons.slice(0, iconsNeeded);

    let iconStates: GameTile[] = [];
    for (let i = 0; i < iconsNeeded; i++) {
      iconStates.push({ correct: false, icon: icons[i] });
      iconStates.push({ correct: false, icon: icons[i] });
    }
    iconStates = shuffle(iconStates);
    setIcons(iconStates);
  }

  function getIndex(i: number, i2: number) {
    return i * squareDimensions + i2;
  }

  function clickItem(i: number, i2: number) {
    const index = getIndex(i, i2);
    let state = _.cloneDeep(icons);
    let currentSelected = _.cloneDeep(selected);

    if (state[index].correct) return;

    if (currentSelected.includes(index)) {
      currentSelected.splice(currentSelected.indexOf(index), 1);
    } else if (isAMatch(state, currentSelected, index)) {
      state[index].correct = true;
      state[currentSelected[0]].correct = true;
      currentSelected = [];
    } else if (currentSelected.length === 2) {
      currentSelected = [];
      currentSelected.push(index);
    } else {
      currentSelected.push(index);
    }

    setIcons(state);
    setSelected(currentSelected);
  }

  function isAMatch(state: GameTile[], currentSelected: number[], index: number) {
    return currentSelected.length === 1 && state[index].icon === state[currentSelected[0]].icon
  }

  function isSelected(index: number) {
    return icons[index].correct || selected.includes(index);
  }

  function getIconUsed(index: number) {
    if (isSelected(index)) {
      return icons[index].icon;
    }
    return "";
  }

  function generateGameBoard() {
    return Array.from(Array(squareDimensions), (_e, i) => {
      return <div className="flex flex-row" key={i}>
        {
          Array.from(Array(squareDimensions), (_e, i2) => {
            return <Card
              rotated={isSelected(getIndex(i, i2))}
              onClick={() => clickItem(i, i2)}
              key={i2}
              icon={getIconUsed(getIndex(i, i2))} />
          })
        }
      </div>
    })
  };

  function renderCompleteText() {
    if (allCorrect) {
      return <p>Congratulations! You&apos;ve correctly completed the puzzle</p>
    }
    return <></>
  }

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <p>{numberOfPairsCorrect} / {getSize() / 2} correct</p>
      {generateGameBoard()}
      {renderCompleteText()}
      <button type="button"
        onClick={setup}
        className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
        Reset
      </button>
    </div>
  );
}
