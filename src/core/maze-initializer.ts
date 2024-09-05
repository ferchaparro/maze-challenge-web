import { MazeImpl } from "./impl/maze.impl";
import { Maze } from "./maze";
import { SpeedEnum } from "./speed.enum";

export class MazeInitializer {

    static initialize(file: string, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D,
        afterMoveListener: (step: number) => void, afterEndListener: (solved: boolean, steps: number) => void, speed?: SpeedEnum): Maze {
         return new MazeImpl(file, canvas, ctx, afterMoveListener, afterEndListener, speed);
    }
}