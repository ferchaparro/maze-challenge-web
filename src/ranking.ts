import './style.css'
import { HOST } from './conf';

// import { MazeScore, TotalScore } from './core/types';

const rankingContainer: HTMLElement = document.getElementById('ranking-container')!;
const headersContainer: HTMLElement = document.getElementById('headers-container')!;

const {exposeScores, exposeSolutions, ranking, totalChallengers} = await fetch(`${HOST}/ranking`).then(res => res.json());
console.log(exposeScores, exposeSolutions, ranking, totalChallengers);

if (exposeScores) {
    const scoreHeader = document.createElement('div');
    scoreHeader.className = 'w-1/4 py-3 px-6';
    scoreHeader.innerHTML = 'Detalles';
    headersContainer.appendChild(scoreHeader);
}

if (exposeSolutions) {
    const options = document.createElement('div');
    options.className = 'w-1/4 py-3 px-6';
    options.innerHTML = 'Soluciones';
    headersContainer.appendChild(options);
}

ranking.forEach((totalScore: any, index: number) => {
    
    const newDiv = document.createElement('div');
    newDiv.className = 'flex bg-gray-800 border-b border-gray-600'
    const placeNumber = document.createElement('div');
    placeNumber.className = 'w-1/4 py-3 px-6';
    placeNumber.innerHTML = `${index + 1}`;
    newDiv.appendChild(placeNumber);
    const name = document.createElement('div');
    name.className = 'w-1/2 py-3 px-6';
    name.innerHTML = `${totalScore.name}`;
    newDiv.appendChild(name);
    const score = document.createElement('div');
    score.className = 'w-1/4 py-3 px-6 text-right';
    score.innerHTML = `${exposeScores?totalScore.totalScore: '???'} / ${(totalScore.elapsedTime/60).toFixed(2)}m`;
    newDiv.appendChild(score);
    rankingContainer.appendChild(newDiv);
    if(exposeScores) {
        const details = document.createElement('div');
        details.className = 'w-1/4 py-3 px-6';
        
        totalScore.mazes
            .sort((a: any, b: any)=>a.maze.localeCompare(b.maze))
            .map((maze: any) => {
                const mazeTitle = document.createElement('div');
                mazeTitle.className = maze.solved?'text-green-500':'text-red-500';
                mazeTitle.innerText = `${maze.maze}: `;
                details.appendChild(mazeTitle);
                
                const movementsValue = document.createElement('span');
                movementsValue.className = 'text-white';
                movementsValue.innerText = `${maze.steps} mvtos.`;
                mazeTitle.appendChild(movementsValue);
            });

        newDiv.appendChild(details);
    }
    if(exposeSolutions) {
        const solutions = document.createElement('div');
        solutions.className = 'w-1/4 py-3 px-6 flex gap-3 justify-end items-start';
        
        const commentsButton = document.createElement('button');
        commentsButton.type = 'button';
        commentsButton.innerText = 'Comentarios';
        commentsButton.onclick = () => {
            alert(totalScore.comments);
        }
        solutions.appendChild(commentsButton);

        const solutionsButton = document.createElement('button');
        solutionsButton.type = 'button';
        solutionsButton.innerText = 'Codigo';
        solutionsButton.onclick = () => {
            navigator.clipboard.writeText(totalScore.code);
            alert('Codigo copiado al portapapeles');
        }
        solutions.appendChild(solutionsButton);
        newDiv.appendChild(solutions);
    }
});