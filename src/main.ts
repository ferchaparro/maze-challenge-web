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
import { MazeScore, TotalScore } from './core/types';

const editor = new EditorView({
  doc: `async function solveMaze(game, MovementDirection) {
  // Aqui va tu codigo... recuerdas el codigo konami?
  await game.move(MovementDirection.WEST)
  await game.move(MovementDirection.NORTH)
  await game.move(MovementDirection.EAST)
  await game.move(MovementDirection.NORTH)
  await game.move(MovementDirection.WEST)
  await game.move(MovementDirection.WEST)
  await game.move(MovementDirection.WEST)
  await game.move(MovementDirection.SOUTH)
  await game.move(MovementDirection.SOUTH)
  await game.move(MovementDirection.WEST)
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

let done = false;
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

let mazesScore: MazeScore[] = [];
const totalScoreRecord: TotalScore = {} as TotalScore;
const onEndGameCalculateSocre = (maze: string, solved: boolean, steps: number, allMazesCount: number) => {
  if (done) return;
  btnPlay.removeAttribute('disabled');
  btnSubmit.removeAttribute('disabled');
  const newCanvas = document.createElement('canvas');
  
  newCanvas.id = 'gameCanvas';
  
  // Reemplazar el viejo canvas
  canvas.parentNode?.replaceChild(newCanvas, canvas);
  setMovements(0);
  const mazeScore = {
    maze,
    solved,
    steps,
    score: solved ? (1000-steps) : 0
  }

  if(mazesScore.findIndex(m => m.maze === maze)<0) {
    mazesScore.push(mazeScore);
    if(mazesScore.length === allMazesCount) {
      const solveAll = mazesScore.filter(m => m.solved).length === allMazesCount;
      const totalScore = mazesScore.reduce((acc, score) => acc + score.score, 0) + (solveAll ? 1000 : 0);
      totalScoreRecord.mazes = mazesScore;
      totalScoreRecord.totalScore = totalScore;
      totalScoreRecord.playerId = 1;
      console.log(totalScoreRecord);
      if(confirm(`Puntuacion: ${totalScore}, Enviar solucion?`)) {

      }
    }
  }
  
};

const onEndGame = (solved: boolean, _steps: number) => {
  if (done) return;
  btnPlay.removeAttribute('disabled');
  btnSubmit.removeAttribute('disabled');
  const newCanvas = document.createElement('canvas');
  
  newCanvas.id = 'gameCanvas';
  
  // Reemplazar el viejo canvas
  canvas.parentNode?.replaceChild(newCanvas, canvas);
  
  if(solved){
    done = true;
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
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function triggerKonamiCode() {
    if(!codeActive) {
      alert("¡Desbloqueaste algo!");
      confeti.createConfetiExplosion();
      cbMaze.appendChild(new Option('Bonus 1', 'Extra01'));
      cbMaze.appendChild(new Option('Bonus 2', 'Extra02'));
      codeActive = true;
    } else {
        alert("¡Ya lo usaste!, pero toma mas confeti");
        confeti.createConfetiExplosion();
    }
}

const onClickPlay = async () => {
  done = false;
  const userFunction = new Function('game', 'MovementDirection', `${editor.state.doc.toString()}
  solveMaze(game, MovementDirection)`);

  canvas = document.getElementById('gameCanvas')! as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log(cbSpeed.value)
  const game = MazeInitializer.initialize(`${cbMaze.value}.lab`, canvas, ctx, onMove, onEndGame, SpeedEnum[cbSpeed.value as keyof typeof SpeedEnum]);
  btnPlay.setAttribute('disabled', 'true');
  btnSubmit.setAttribute('disabled', 'true');
  await game.start();
  userFunction(game, MovementDirection);
};

const onClickSubmit = async () => {
  calculateScore();
  return
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

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // índice aleatorio entre 0 e i
    [array[i], array[j]] = [array[j], array[i]]; // intercambiar los elementos
  }
  return array;
}

const calculateScore = async () => {
  mazesScore = []
  const mazes = shuffleArray(shuffleArray(shuffleArray(['Test01', 'Test02', 'Test03', 'Test04', 'Test05', 'Extra01', 'Extra02'])));//, 'Extra03'])));
  mazes.map(async (maze) => {
    done=false;
    canvas = document.getElementById('gameCanvas')! as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const game = MazeInitializer.initialize(`${maze}.lab`, canvas, ctx, ()=>null, 
    (solved: boolean, steps: number) => onEndGameCalculateSocre(maze, solved, steps, mazes.length), SpeedEnum.INSTANTLY);
    await game.start();
    const userFunction = new Function('game', 'MovementDirection', `${editor.state.doc.toString()}
    solveMaze(game, MovementDirection)`);
    userFunction(game, MovementDirection);
  })
}


btnPlay.addEventListener('click', onClickPlay);
btnSubmit.addEventListener('click', onClickSubmit);

// async function init(){ 
   
// }

// init();



// new MazeConfig('Test01.lab');

