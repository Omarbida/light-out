import { useEffect } from "react";
import "./App.css";
import { useState } from "react";

const shuffledMoves = [];

function App() {
  const [lights, setLights] = useState([]);
  const [difficulty, setDificulty] = useState(1);
  const [newGame, setNewGame] = useState(false);
  useEffect(() => {
    let num = 0;
    let tempLights = [];
    let tempX = [];
    for (let i = 0; i < 5; i++) {
      tempX = [];
      for (let j = 0; j < 5; j++) {
        tempX.push({ id: num, x: i, y: j, state: "off" });
        num++;
      }
      tempLights.push(tempX);
    }
    shufflStart(tempLights);
    setLights(tempLights);
  }, [setLights, newGame]);

  function shufflStart(lights) {
    let randomMoveCount = Math.round((5 + Math.random()) * 10 * difficulty);
    let tempLights = [...lights];
    for (let i = 0; i < randomMoveCount + 1; i++) {
      let randomX = Math.floor(Math.random() * 5);
      let randomY = Math.floor(Math.random() * 5);
      shuffledMoves.unshift(tempLights[randomX][randomY].id);
      tempLights[randomX][randomY].state = invert(
        tempLights[randomX][randomY].state
      );

      // Toggle the state of neighboring lights if they are within bounds
      if (randomX - 1 >= 0)
        tempLights[randomX - 1][randomY].state = invert(
          tempLights[randomX - 1][randomY].state
        );
      if (randomX + 1 < tempLights.length)
        tempLights[randomX + 1][randomY].state = invert(
          tempLights[randomX + 1][randomY].state
        );
      if (randomY - 1 >= 0)
        tempLights[randomX][randomY - 1].state = invert(
          tempLights[randomX][randomY - 1].state
        );
      if (randomY + 1 < tempLights[randomX].length)
        tempLights[randomX][randomY + 1].state = invert(
          tempLights[randomX][randomY + 1].state
        );
    }
    // console.log(shuffledMoves);
  }
  const clickHandler = ({ x, y }) => {
    // Check array bounds
    if (x >= 0 && x < lights.length && y >= 0 && y < lights[x].length) {
      let temp = lights.map((row) => [...row]); // Create a deep copy

      // Toggle the state of the clicked light
      temp[x][y].state = invert(temp[x][y].state);

      // Toggle the state of neighboring lights if they are within bounds
      if (x - 1 >= 0) temp[x - 1][y].state = invert(temp[x - 1][y].state);
      if (x + 1 < temp.length)
        temp[x + 1][y].state = invert(temp[x + 1][y].state);
      if (y - 1 >= 0) temp[x][y - 1].state = invert(temp[x][y - 1].state);
      if (y + 1 < temp[x].length)
        temp[x][y + 1].state = invert(temp[x][y + 1].state);

      setLights(temp);
    }
  };

  function invert(state) {
    return state === "on" ? "off" : "on";
  }

  return (
    <>
      <div className="text-primary text-center text-6xl my-8 font-bold">
        Lights out
      </div>
      <div className="flex justify-center gap-5 my-5">
        <select
          onChange={(e) => {
            let tmp = 1 + e.target.selectedIndex;
            setDificulty(tmp);
          }}
          className="select bg-base-200 w-full max-w-xs "
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <button
          onClick={() => {
            setNewGame(!newGame);
          }}
          className="btn btn-neutral"
        >
          New Game
        </button>
      </div>
      <div className="text-center max-w-md mx-auto gap-5 my-5">
        Turn on all lights by clicking them. Clicking a light will toggle its
        state and the state of its neighbors.
      </div>
      <div className="mx-auto w-max gap-2 bg-base-100 grid grid-cols-5">
        {lights.map((row) =>
          row.map((light) => (
            <div
              onClick={() => clickHandler({ x: light.x, y: light.y })}
              key={light.id}
              className={`cursor-pointer hover:scale-[103%] w-[90px] h-[90px] grid place-content-center ${light.state}`}
            >
              {light.id}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
