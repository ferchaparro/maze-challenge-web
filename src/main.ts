import './style.css'
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';
import { oneDark } from '@codemirror/theme-one-dark';
import { MazeInitializer } from './core/maze-initializer';
import { MovementDirection } from './core/movement-direction.enum';
import { SpeedEnum } from './core/speed.enum';
import { SendSolution } from './model/send-solution.model';
import { Confeti } from './core/confeti';

const editor = new EditorView({
  doc: `async function solveMaze(game, MovementDirection) {
  // Aqui va tu codigo... recuerdas el codigo konami?
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

let isDone = false;
let canvas: HTMLCanvasElement;

const btnPlay = document.getElementById('btnPlay')!;
const btnSubmit = document.getElementById('btnSubmit')!;
const cbMaze = document.getElementById('cbMaze')! as HTMLSelectElement;
const cbSpeed = document.getElementById('cbSpeed')! as HTMLSelectElement;
const lbMovements = document.getElementById('lbMovements')! as HTMLTitleElement;

const confetiContainer = document.getElementById('confeti-container')!;
const confeti = new Confeti(confetiContainer);
const setMovements = (step: number) => {
  lbMovements.innerText =`Movimientos: ${step}`;
}

const onMove = (step: number) => {
  setMovements(step);
}
const onEndGame = (solved: boolean) => {
  if (isDone) return;
  btnPlay.removeAttribute('disabled');
  btnSubmit.removeAttribute('disabled');
  const newCanvas = document.createElement('canvas');
  
  newCanvas.id = 'gameCanvas';
  
  // Reemplazar el viejo canvas
  canvas.parentNode?.replaceChild(newCanvas, canvas);
  
  if(solved){
    isDone = true;
    alert('Maze solved!');
    confeti.createConfetiExplosion();
  } else {
    alert('Maze not solved!');
  }
  setMovements(0);
};

const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;
let codeActive = false;

document.addEventListener('keydown', (event) => {
    if (event.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            triggerKonamiCode();
            konamiIndex = 0; // Reiniciar para permitir múltiples usos
        }
    } else {
        konamiIndex = 0; // Reiniciar si la tecla no coincide
    }
});

function triggerKonamiCode() {
    if(!codeActive) {
      alert("¡Desbloqueaste algo!");
      confeti.createConfetiExplosion();
      cbMaze.appendChild(new Option('Bonus 1', 'extra01'));
      cbMaze.appendChild(new Option('Bonus 2', 'extra02'));
      cbMaze.appendChild(new Option('Bonus 3', 'extra03'));
      codeActive = true;
    } else {
        alert("¡Ya lo usaste!, pero toma mas confeti");
        confeti.createConfetiExplosion();
    }
}

const onClickPlay = async () => {
  isDone = false;
  const userFunction = new Function('game', 'MovementDirection', 'onEndGame', `${editor.state.doc.toString()}
  solveMaze(game, MovementDirection)`);

  canvas = document.getElementById('gameCanvas')! as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const game = MazeInitializer.initialize(`${cbMaze.value}.lab`, canvas, ctx, onMove, onEndGame, SpeedEnum[cbSpeed.value as keyof typeof SpeedEnum]);
  btnPlay.setAttribute('disabled', 'true');
  btnSubmit.setAttribute('disabled', 'true');
  await game.start();
  userFunction(game, MovementDirection, onEndGame);
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
  const res = await fetch('https://justap.peentei.com/v1/maze/send', {
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

