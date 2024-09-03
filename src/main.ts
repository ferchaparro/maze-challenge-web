import './style.css'
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';
import { oneDark } from '@codemirror/theme-one-dark';
import { MazeConfig } from './core/maze.config';
import { MazeScreen } from './core/maze.screen';
import { MazeInitializer } from './core/maze-initializer';
import { MovementDirection } from './core/movement-direction.enum';
import { SpeedEnum } from './core/speed.enum';
import { SendSolution } from './model/send-solution.model';

const editor = new EditorView({
  doc: `async function solveMaze(game, MovementDirection) {
  // Aqui va tu codigo
  await game.move(MovementDirection.NORTH)
  await game.move(MovementDirection.NORTH)
  await game.move(MovementDirection.NORTH)
  await game.move(MovementDirection.EAST)
  await game.move(MovementDirection.EAST)
  await game.move(MovementDirection.EAST)
  await game.move(MovementDirection.EAST)
  await game.move(MovementDirection.NORTH)
  await game.move(MovementDirection.WEST)
  await game.move(MovementDirection.WEST)
  await game.move(MovementDirection.WEST)
  await game.move(MovementDirection.WEST)

}`,
  extensions: [basicSetup, javascript(), autocompletion(), oneDark],
  parent: document.getElementById('codeEditor')!
});
let gameRunning = false;


const btnPlay = document.getElementById('btnPlay')!;
const btnSubmit = document.getElementById('btnSubmit')!;
const cbMaze = document.getElementById('cbMaze')! as HTMLSelectElement;

const onClickPlay = () => {
  const userFunction = new Function('game', 'MovementDirection', `${editor.state.doc.toString()}
  solveMaze(game, MovementDirection)`);

  const canvas: HTMLCanvasElement = document.getElementById('gameCanvas')! as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const game = MazeInitializer.initialize(`${cbMaze.value}.lab`, canvas, ctx, SpeedEnum.SLOW);
  game.afterEndListener((solved: boolean) => {
    gameRunning = false;
    btnPlay.removeAttribute('disabled');
    btnSubmit.removeAttribute('disabled');
    const newCanvas = document.createElement('canvas');

    newCanvas.id = 'gameCanvas';

    // Reemplazar el viejo canvas
    canvas.parentNode?.replaceChild(newCanvas, canvas);

    if (solved){
      alert('Maze solved!');
    } else {
      alert('Maze not solved!');
    }
  });
  game.afterMoveListener((step) => {
    console.log(`Step: ${step}`);
  });
  btnPlay.setAttribute('disabled', 'true');
  btnSubmit.setAttribute('disabled', 'true');
  game.start();
  gameRunning = true;
  userFunction(game, MovementDirection);
};

const onClickSubmit = async () => {
  const solution: SendSolution = {
    solution: editor.state.doc.toString(),
    employeeId: 1,
    name: 'Fernando Gastelum',
    role: 'TL',
    comments: 'This is a test',
    score: 100,
    doneMaze1: true,
    doneMaze2: true,
    doneMaze3: true,
    doneMaze4: true,
    doneMaze5: true,
    doneMaze6: true,
    doneMaze7: true,
    doneMaze8: true,
    doneMaze9: true,
    doneMaze10: true
  };
  const res = await fetch('https://game.justapgame.com/v1/maze/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(solution)
  }).then(response => response.json())
  console.log(res);
};


btnPlay.addEventListener('click', onClickPlay);
btnSubmit.addEventListener('click', onClickSubmit);

// async function init(){ 
   
// }

// init();



// new MazeConfig('Test01.lab');

