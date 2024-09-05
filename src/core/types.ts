export type MazeScore = {
    maze: string,
    solved: boolean,
    steps: number,
    score: number
}
export type TotalScore = {
    playerId: number,
    totalScore: number,
    mazes: MazeScore[]
}