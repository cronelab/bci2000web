/**
 *
 * Specify this is a module comment without renaming it:
 *
 * @module
 */

const sleep = (n) => {
  return new Promise((resolve) => {
    setTimeout(resolve, n);
  });
};

/**
 * Slowly moves the virtual mouse a small distance
 * @category Cursor Utilities
 * @param direction left/right/up/down
 */
const bciMover = async (direction: string) => {
  var cursor = document.getElementById('cursor');
  let currPos = {
    x: parseInt(cursor.style.left.split('px')[0]),
    y: parseInt(cursor.style.top.split('px')[0]),
  };
  switch (direction) {
    case 'left':
      await sleep(5);
      cursor.style.left = `${currPos.x - 4}px`;
      break;
    case 'right':
      await sleep(5);
      cursor.style.left = `${currPos.x + 4}px`;
      break;
    case 'up':
      await sleep(5);
      cursor.style.top = `${currPos.y - 4}px`;
      break;
    case 'down':
      await sleep(5);
      cursor.style.top = `${currPos.y + 4}px`;
      break;
  }
};

/**
 * Clicks the virtual mouse
 * @category Cursor Utilities
 */
const virtualClick = () => {
  var cursor = document.getElementById('cursor');
  let currPos = {
    x: parseInt(cursor.style.left.split('px')[0]),
    y: parseInt(cursor.style.top.split('px')[0]),
  };
  var tmp = document.elementFromPoint(currPos.x, currPos.y);
  console.log(tmp);
  if (tmp.nodeName == 'path') {
    tmp.parentElement.parentElement.click();
  } else {
    //@ts-ignore
    tmp.click();
  }
};

export { bciMover, virtualClick };
