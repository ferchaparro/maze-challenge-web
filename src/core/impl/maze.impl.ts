import { Maze } from "../maze";
import { MazeInfo } from "../maze-info";
import { MazeConfig } from "../maze.config";
import { MazeScreen } from "../maze.screen";
import { MovementDirection } from "../movement-direction.enum";
import { Sleeper } from "../sleeper";
import { SpeedEnum } from "../speed.enum";
import { Stopwatch } from "../stopwatch";

export class MazeImpl implements Maze, MazeInfo {

    private _x: number = 0;
    private _y: number = 0;
    private _movements: number = 0;
    private _max: number = 1000;
    private _timer: Stopwatch|null = null;
    private _maze: MazeConfig|null = null;
    private _screen: MazeScreen|null = null;
    private _speed: number = 100;
    private _file: string = '';
    private started: boolean = false;
    private timeoutId: number|null = null;

    constructor(file: string, private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D,
        private moveListener: (step: number) => void, private endListener: (solved: boolean, steps: number) => void,
        speed: SpeedEnum = SpeedEnum.FAST) {
      this._file = file;
      switch (speed) {
        case SpeedEnum.INSTANTLY: this._speed = 1; break;
        case SpeedEnum.FAST: this._speed = 100; break;
        case SpeedEnum.SLOW: this._speed = 500; break;
        default: this._speed = 250; break;
      }
    }
    private keepAlive = () => {
        if(this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(()=>this.endListener(false, this._movements), (this._speed+10)*3);  
    }

    private refresh = async (_x: number) => {
        await Sleeper.sleep(this._speed)
        
        if(this.started) {
            this._screen!.drawMaze(this._maze!);
            if (this._movements >= this._max) {
                await Sleeper.sleep(this._speed)
                this.endListener(false, this._movements);
                this.started = false;
                if (this._timer != null) {
                    this._timer.stop();
                }
                this._timer = null;
            }
        } 
        
        requestAnimationFrame(this.refresh);
    };

    X(): number {
        return this._x;
    }
    Y(): number {
        return this._y;
    }
    time(): number {
        return this._timer == null ? 0.0 : this._timer.getElapsedTime()/1000;
    }
    movements(): number {
        return this._movements;
    }
    async start(): Promise<number> {
        if (this._timer != null) {
            return -1;
        }
        this._maze = new MazeConfig(this._file);
        await this._maze.load();
        this._file=''
        this._screen = new MazeScreen(this, this.canvas, this.ctx);
        this._x = this._maze!.iX();
        this._y = this._maze!.iY();
        this._movements = 0;
        this.started = true;
        this.refresh(0);
        await Sleeper.sleep(this._speed)
        
        this._timer = new Stopwatch();
        this._timer.start();
        this.keepAlive();
        return this.watchLocation();
    }
    watchLocation(): number {
        return this._maze!.loc(this._x, this._y);
    }
    isDone(): boolean {
        if(this._movements >= this._max) {
            throw new Error('Max movements reached');
        }
        return this._x == this._maze!.fX() && this._y == this._maze!.fY();
    }
    async move(dir: MovementDirection): Promise<number> {
        if(this._timer == null) {
            await Sleeper.sleep(this._speed)
            return -1;
        }
        this.keepAlive();
        if ((dir & this._maze!.loc(this._x, this._y)) !==  0) {
            await Sleeper.sleep(this._speed)
            return -1;
        }
       
        const m: number = ++this._movements;
        
        switch (dir)
        {
        case MovementDirection.SOUTH:
            --this._x;
            break;
        case MovementDirection.EAST:
            ++this._y;
            break;
        case MovementDirection.NORTH:
            ++this._x;
            break;
        case MovementDirection.WEST:
            --this._y;
            break;
        }
        
        await Sleeper.sleep(this._speed);
        this._screen?.printPosition();
        this.moveListener(m);
        
        if (this.isDone())
        {
            await Sleeper.sleep(10);
            if (this._timer != null) {
                this._timer.stop();
            }
            if(this.endListener){
                
                this.endListener(true, this._movements);
                this.started = false;
            }
            this._timer = null;
            return 15;
        }
        if (this._movements < this._max) {
            return this._maze!.loc(this._x, this._y);
        }
        return 15;
    }

}
