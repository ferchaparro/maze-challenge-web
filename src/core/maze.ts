import { MovementDirection } from "./movement-direction.enum";

export interface Maze {
    start(): Promise<number>;

    watchLocation(): number;

    isDone(): boolean;

    move(dir: MovementDirection): Promise<number>;

}