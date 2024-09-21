import './style.css'
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';
import { oneDark } from '@codemirror/theme-one-dark';
import { MazeInitializer } from './core/maze-initializer';
import { MovementDirection } from './core/movement-direction.enum';
import { SpeedEnum } from './core/speed.enum';
import { Confeti } from './core/confeti';
import { MazeScore, TotalScore } from './core/types';
import { HOST } from './conf';

if(!localStorage.getItem('code')) {
  localStorage.setItem('code', `async function solveMaze(game, MovementDirection) {
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

}`)
}

const editor = new EditorView({
  doc: localStorage.getItem('code')!,
  extensions: [basicSetup, javascript(), autocompletion(), oneDark, 
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const lastContent = update.state.doc.toString();
        localStorage.setItem('code', lastContent);
      }
    })
  ], 
  parent: document.getElementById('codeEditor')!
});

let done = false;
let canvas: HTMLCanvasElement;

const app = document.getElementById('app')!;
const login = document.getElementById('login')!;
const txtChallengerId = document.getElementById('txtChallengerId')! as HTMLInputElement;
const txtPassword = document.getElementById('txtPassword')! as HTMLInputElement;
const btnPlay = document.getElementById('btnPlay')!;
const btnCalculate = document.getElementById('btnCalculate')!;
const btnSubmit = document.getElementById('btnSubmit')!;
const cbMaze = document.getElementById('cbMaze')! as HTMLSelectElement;
const cbSpeed = document.getElementById('cbSpeed')! as HTMLSelectElement;
const lbMovements = document.getElementById('lbMovements')! as HTMLTitleElement;
const scoreArea = document.getElementById('scoreArea')!;
const frmLogin = document.getElementById('frmLogin')! as HTMLFormElement;
const frmCreateAccount = document.getElementById('frmCreateAccount')! as HTMLFormElement;

//crea la funcionalidad para que se muestre la ventana flotante al darle click a crear cuenta
const btnCreateAccount = document.getElementById('btnCreateAccount')!;
const btnClose = document.getElementById('btnCloseCreateAccount')!;
const modal = document.getElementById('createAccount')!;

btnCreateAccount.addEventListener('click', () => {
  frmCreateAccount.reset();
  modal.classList.remove('invisible');
});

btnClose.addEventListener('click', () => {
  modal.classList.add('invisible');
});



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
  btnCalculate.removeAttribute('disabled');
  const newCanvas = document.createElement('canvas');
  newCanvas.className = 'rounded-xl border-2 border-indigo-500'
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
      enableScoreArea(true);
    }
  }
  
};

const onEndGame = (solved: boolean, _steps: number) => {
  if (done) return;
  btnPlay.removeAttribute('disabled');
  btnCalculate.removeAttribute('disabled');
  const newCanvas = document.createElement('canvas');
  newCanvas.className = 'rounded-xl border-2 border-indigo-500'
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

const secretCode = [38, 38, 38, 40, 40, 40, 37, 39, 37, 39, 39, 37, 70, 69, 82];
let secretIndex = 0;
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

    if (event.keyCode === secretCode[secretIndex]) {
      secretIndex++;
      if (secretIndex === secretCode.length) {
          loadCodeFromSolutions();
          secretIndex = 0;
      }
  } else {
    secretIndex = 0;
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
  enableScoreArea(false);
  done = false;
  const userFunction = new Function('game', 'MovementDirection', `${editor.state.doc.toString()}
  solveMaze(game, MovementDirection)`);

  canvas = document.getElementById('gameCanvas')! as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const game = MazeInitializer.initialize(`${cbMaze.value}.lab`, canvas, ctx, onMove, onEndGame, SpeedEnum[cbSpeed.value as keyof typeof SpeedEnum]);
  btnPlay.setAttribute('disabled', 'true');
  btnCalculate.setAttribute('disabled', 'true');
  await game.start();
  userFunction(game, MovementDirection);
};

const onClickCalculate = () => {
  calculateScore();
}

const onClickSubmit = async () => {
  const code = editor.state.doc.toString();
  const comments = prompt('Describe que estrategia usaste en tu solución:');
  if(!comments) {
    return;
  }
  const res = await fetch(`${HOST}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({...totalScoreRecord, code, comments})
  }).then(response => response.json())
  if(typeof res === 'number') {
    alert("Se envio su solución.");
  } else if(typeof res === 'object' && res.message === 'ALREADY_SEND_SOLUTION') {
    alert("Ya envio su solución, no puede enviarla de nuevo.");
  } else {
    alert("Hubo un error al enviar su solución.");
  }
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
  const mazes = shuffleArray(shuffleArray(shuffleArray(['Test01', 'Test02', 'Test03', 'Test04', 'Test05', 'Extra01', 'Extra02'])));
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

const enableScoreArea = (enable: boolean) => {
  while (scoreArea.firstChild) {
    scoreArea.removeChild(scoreArea.firstChild);
  }
  if(enable) {
    const scoreTitle = document.createElement('h3');
    scoreTitle.className = 'font-bold text text-indigo-500'
    scoreTitle.innerText = 'Puntaje: ';
    scoreArea.appendChild(scoreTitle);
    const scoreValue = document.createElement('span');
    scoreValue.className = 'text-white'
    scoreValue.innerText = `${totalScoreRecord.totalScore}`;
    scoreTitle.appendChild(scoreValue);
    totalScoreRecord.mazes.sort((a, b)=>a.maze.localeCompare(b.maze)).map(maze => {
      const mazeTitle = document.createElement('h3');
      mazeTitle.className = 'font-bold text text-indigo-500'
      mazeTitle.innerText = `${maze.maze}: `;
      scoreArea.appendChild(mazeTitle);
      const passedValue = document.createElement('span');
      passedValue.className = maze.solved?'text-green-500':'text-red-500';
      passedValue.innerHTML = maze.solved?'&check;':'&cross;';
      mazeTitle.appendChild(passedValue);
      const movementsValue = document.createElement('span');
      movementsValue.className = 'text-white';
      movementsValue.innerText = `${maze.steps} movimientos`;
      mazeTitle.appendChild(movementsValue);
    })
    btnSubmit.classList.remove('invisible');
    scoreArea.classList.remove('invisible');
  } else {
    btnSubmit.classList.add('invisible');
    scoreArea.classList.add('invisible');
  }

}

const loadCodeFromSolutions = async () => {
  const employeeId = prompt('Numero de empleado a cargar');
  const code = await fetch(`${HOST}/load-solution/${employeeId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => response.text());
  if(code) {
    editor.dispatch({changes: {from: 0, to: editor.state.doc.length, insert: code}});
  }
}

const loginSuccess = () => {
  if(localStorage.getItem('token')) {
    login.classList.add('hidden');
    app.classList.remove('hidden');
  }
}

frmLogin.addEventListener('submit', async (event) => {
  event.preventDefault();
  const {token, name} = await fetch(`${HOST}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({employeeId: txtChallengerId.value, password: txtPassword.value})
  }).then(response => response.json() as Promise<{token: string, name: string}>);
  if(token && name) {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    loginSuccess()
  } else {
    alert('Verifica tu número de jugador');
  }
});

frmCreateAccount.addEventListener('submit', async (event) => {
  event.preventDefault();
  const {employeeId} = await fetch(`${HOST}/create-challenger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      employeeId: parseInt((document.getElementById('txtChallengerIdCA') as HTMLInputElement).value),
      name: (document.getElementById('txtNameCA') as HTMLInputElement).value,
      password: (document.getElementById('txtPasswordCA') as HTMLInputElement).value
    })
  }).then(response => response.json());
  if(employeeId) {
    txtChallengerId.value = employeeId;
    txtPassword.focus();
    modal.classList.add('invisible');
  } else {
    alert('El numero de participante ya existe.');
  }
});
btnPlay.addEventListener('click', onClickPlay);
btnCalculate.addEventListener('click', onClickCalculate);
btnSubmit.addEventListener('click', onClickSubmit);

loginSuccess()


