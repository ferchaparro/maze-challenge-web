import './style.css'
// import { MazeScore, TotalScore } from './core/types';

const ranking: HTMLElement = document.getElementById('ranking-container')!;
const newDiv = document.createElement('div');
newDiv.innerHTML = `Fernando Gastelum`;
ranking.appendChild(newDiv);