export type MazeScore = {
    maze: string,
    solved: boolean,
    steps: number,
    score: number
}
export type TotalScore = {
    totalScore: number,
    mazes: MazeScore[],
    code: string,
    comments?: string
}