import { MovementDirection } from "./movement-direction.enum";

export interface Maze {
    start(): number;

    watchLocation(): number;

    end(): boolean;

    move(dir: MovementDirection): Promise<number>;

    afterMoveListener(callback: (step: number) => void): void;

    afterEndListener(callback: (solved: boolean) => void): void;
}