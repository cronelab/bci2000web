import React, { useEffect, useRef, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { Context } from '../../Context';
import './Games.scss';
let snake = [
  {
    x: Math.floor((400 * Math.random()) / 10) * 10,
    y: Math.floor((400 * Math.random()) / 10) * 10,
  },
];
let initialGoal = {
  x: Math.floor((400 * Math.random()) / 10) * 10,
  y: Math.floor((400 * Math.random()) / 10) * 10,
};
let currentGoal = initialGoal;
let dx = 10;
let dy = 0;
const modifyValsX = (x) => (dx = x);
const modifyValsY = (y) => (dy = y);
export { dx, dy, modifyValsY, modifyValsX };

const moveSnake = () => {
  let head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy,
  };
  snake.unshift(head);
  snake.pop();
};

const Snake = () => {
  const canvasRef = useRef();
  const { bciSource, bciOperator } = useContext(Context);

  useEffect(() => {
    let canvas = canvasRef.current ?? document.createElement('canvas');
    if (canvas != undefined) {
      const context = canvas.getContext('2d');

      const drawSnake = (segment) => {
        context.fillStyle = 'lightblue';
        context.strokeStyle = 'darkblue';
        context.fillRect(segment.x, segment.y, 10, 10);
        context.strokeRect(segment.x, segment.y, 10, 10);
      };

      const clearCanas = () => {
        context.fillStyle = 'black';
        context.strokeStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeRect(0, 0, canvas.width, canvas.height);
      };

      const drawSnack = (pos) => {
        context.fillStyle = 'red';
        context.strokeStyle = 'darkred';
        context.fillRect(pos.x, pos.y, 10, 10);
        context.strokeRect(pos.x, pos.y, 10, 10);
      };

      const main = () => {
        setTimeout(() => {
          clearCanas();
          drawSnack({ x: currentGoal.x, y: currentGoal.y });
          snake.forEach(drawSnake);
          moveSnake();
          if (snake[0].x == currentGoal.x && snake[0].y == currentGoal.y) {
            snake.push({
              x: currentGoal.x,
              y: currentGoal.y,
            });
            currentGoal = {
              x: Math.floor((400 * Math.random()) / 10) * 10,
              y: Math.floor((400 * Math.random()) / 10) * 10,
            };
            clearCanas();
            drawSnack({ x: currentGoal.x, y: currentGoal.y });
            snake.forEach(drawSnake);
            moveSnake();
          }
          if (snake[0].x >= 400) {
            snake[0].x = 0;
          }
          if (snake[0].x < 0) {
            snake[0].x = 400;
          }
          if (snake[0].y >= 400) {
            snake[0].y = 0;
          }
          if (snake[0].y < 0) {
            snake[0].y = 400;
          }
          main();
        }, 500);
      };

      main();

      bciSource.onGenericSignal = (x) => {
        if (bciSource.states != undefined) {
          let up = bciSource.states?.ControlUp;
          let down = bciSource.states?.ControlDown;
          let left = bciSource.states?.ControlLeft;
          let right = bciSource.states?.ControlRight;
          if (up[0] == 1) {
            modifyValsY(-10);
            modifyValsX(0);
            bciOperator.execute('Set State ControlUp 0');
          }
          if (down[0] == 1) {
            modifyValsY(10);
            modifyValsX(0);
            bciOperator.execute('Set State ControlDown 0');
          }
          if (left[0] == 1) {
            modifyValsY(0);
            modifyValsX(-10);

            bciOperator.execute('Set State ControlLeft 0');
          }
          if (right[0] == 1) {
            modifyValsY(0);
            modifyValsX(10);

            bciOperator.execute('Set State ControlRight 0');
          }
        }
      };

      document.addEventListener('keydown', (e) => {
        e.preventDefault();
        switch (e.code) {
          case 'ArrowUp':
            (dx = 0), (dy = -10);
            break;
          case 'ArrowDown':
            (dx = 0), (dy = 10);
            break;
          case 'ArrowLeft':
            (dx = -10), (dy = 0);
            break;
          case 'ArrowRight':
            (dx = 10), (dy = 0);
            break;
        }
      });
    }
  }, []);
  return (
    <div>
      <h1 id="gameCanvasTitle">Snake meet brain</h1>
      <canvas
        ref={canvasRef}
        style={{ top: '300px' }}
        id="gameCanvas"
        width="800"
        height="400"
      ></canvas>
    </div>
  );
};

export default Snake;
