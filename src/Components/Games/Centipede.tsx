import React, { useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import './Games.scss';

const Centipede = () => {
  const canvasRef = useRef();

  useEffect(() => {
    let canvas = canvasRef.current || document.createElement('canvas');
    if (canvas != undefined) {
      const context = canvas.getContext('2d');

      window.addEventListener('keydown', (e) => {
        e.preventDefault();
        switch (e.code) {
          case 'ArrowLeft':
            movePlayer('left');
            break;
          case 'ArrowRight':
            movePlayer('right');
            break;
          case 'Space':
            drawBullet();
            break;
        }
      });

      const movePlayer = (direction) => {
        if (direction == 'left' && player.x >= 0) player.x -= 5;
        if (direction == 'right' && player.x <= canvas.width - player.size)
          player.x += 5;
      };

      const drawBullet = () => {
        shotsFired = true;
        context.fillStyle = 'lightblue';
        context.fillRect(player.x, player.y, player.size, player.size);
        bullet.y -= 5;
      };

      let player = {
        x: 0,
        y: 300,
        size: 20,
      };
      let bullet = {
        x: player.x,
        y: player.y,
      };

      let shotsFired = false;

      var creatures = [];

      //                 for(var i=0; i < creatures.length; i++) {
      //                     var creature = creatures[i];

      //                     if(creature.dead) {
      //                         continue;
      //                     }

      //                     if(this.x >= creature.x && this.x <= creature.x + creature.size
      //                       && this.y >= creature.y && this.y <= creature.y + creature.size) {
      //                         this.dead = true;
      //                         creature.dead = true;
      //                     }
      //                 }
      //             }
      //         };
      //     }

      //   let creatures = [];

      creatures.forEach((creature) => {});
      for (var i = 0; i < 10; i++) {
        var creature = {
          x: i * 30,
          y: 10,
          size: 20,
          direction: 'right',
          dead: false,

          //         update: function() {
          //             if(this.dead) {
          //                 return;
          //             }

          //             context.fillStyle = "rgb(255,0,0)";
          //             context.fillRect(this.x, this.y, this.size, this.size);

          //             if(this.direction == "left") {
          //                 this.x -= 1;

          //                 if(this.x < 0) {
          //                     this.direction = "right";
          //                     this.y += 20;
          //                 }
          //             } else if(this.direction == "right") {
          //                 this.x += 1;

          //                 if(this.x > canvas.width-this.size) {
          //                     this.direction = "left";
          //                     this.y += 20;
          //                 }
          //             }
          //         }
        };

        //     creatures.push(creature);
      }

      // Main loop
      setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'lightblue';
        context.fillRect(bullet.x, bullet.y, player.size, player.size);

        context.fillStyle = 'rgb(0,255,0)';
        context.fillRect(player.x, player.y, player.size, player.size);

        if (shotsFired) {
          bullet.y -= 1;
          if (bullet.y < 0) {
            shotsFired = false;
            bullet.y = player.y;
          }
        }
      }, (1 / 60) * 1000);
    }
  }, []);
  return (
    <Container>
      <h1 id="gameCanvasTitle">Centipede</h1>
      <canvas ref={canvasRef} id="gameCanvas" width="400" height="400"></canvas>
    </Container>
  );
};

export default Centipede;
