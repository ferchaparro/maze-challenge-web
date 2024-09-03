import { MazeImpl } from "./impl/maze.impl";
import { Maze } from "./maze";
import { SpeedEnum } from "./speed.enum";

export class MazeInitializer {

    static initialize(file: string, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, speed?: SpeedEnum): Maze {
         return new MazeImpl(file, canvas, ctx, speed);
    }
}