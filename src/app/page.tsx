'use client';

import Card from "@/components/card";
import { shuffle } from "@/util/shuffle";
import { useEffect, useMemo, useState } from "react";
import _ from "lodash";

type GameTile = {
  selected: boolean,
  correct: boolean,
  icon: string
}

export default function Home() {

  const squareDimensions = 4;

  const [icons, setIcons] = useState<GameTile[]>(Array(squareDimensions ** 2).fill(""));
  const [selected, setSelected] = useState<number[]>([]);

  const numberCorrect = useMemo(() => {
    return icons.reduce((prev, curr) => curr.correct ? prev + 1 : prev, 0) / 2
  }, [icons])

  const allCorrect = useMemo(() => {
    return numberCorrect === getSize() / 2;
  }, [numberCorrect])

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


  useEffect(function() {
    if (selected.length === 2) {
      let state = _.cloneDeep(icons);
      let currentSelected = _.cloneDeep(selected);
      if (icons[selected[0]].icon !== icons[selected[1]].icon) {
        state[selected[0]].selected = false;
        state[selected[1]].selected = false;
      } else {
        state[selected[0]].correct = true;
        state[selected[1]].correct = true;

      }
      currentSelected = [];
      setSelected(currentSelected);
      setIcons(state);
    }
  }, [selected])

  function setup() {
    generateIconsToUse()
    setSelected([])
  }

  function getSize() {
    return squareDimensions ** 2;
  }

  function generateIconsToUse() {
    const iconsNeeded = squareDimensions ** 2 / 2;
    const icons = availableIcons.slice(0, iconsNeeded);

    let iconStates: GameTile[] = [];
    for (let i = 0; i < iconsNeeded; i++) {
      iconStates.push({ selected: false, correct: false, icon: icons[i] });
      iconStates.push({ selected: false, correct: false, icon: icons[i] });
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
    } else {
      currentSelected.push(index);
    }

    state[index].selected = !state[index].selected

    setSelected(currentSelected);
    setIcons(state);
  }

  function getIconUsed(index: number) {
    if (icons[index].correct || icons[index].selected) {
      return icons[index].icon;
    }
    return "";
  }

  function generateDeck() {
    return Array.from(Array(squareDimensions), (e, i) => {
      return <div className="flex flex-row" key={i}>
        {
          Array.from(Array(squareDimensions), (e, i2) => {
            return <Card onClick={() => clickItem(i, i2)} key={i2} icon={getIconUsed(getIndex(i, i2))} />
          })
        }
      </div>
    })
  };

  return (
    <div key="1" className="flex flex-col w-screen h-screen justify-center items-center">
      <p>{numberCorrect} / {getSize() / 2} correct</p>
      {generateDeck()}
      <button type="button" onClick={setup} className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
        Reset
      </button>
    </div>
  );
}
