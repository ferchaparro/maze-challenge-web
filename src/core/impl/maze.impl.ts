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
    private _max: number = 5000;
    private _timer: Stopwatch|null = null;
    private _maze: MazeConfig|null = null;
    private _screen: MazeScreen|null = null;
    private _speed: number = 100;
    private _file: string = '';
    private started: boolean = false;

    constructor(file: string, private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D,
        private moveListener: (step: number) => void, private endListener: (solved: boolean) => void,
        speed: SpeedEnum = SpeedEnum.FAST) {
      this._file = file;
      switch (speed) {
        case SpeedEnum.INSTANTLY: this._speed = 0; break;
        case SpeedEnum.FAST: this._speed = 100; break;
        case SpeedEnum.SLOW: this._speed = 500; break;
        default: this._speed = 250; break;
      }
    }

    refresh = async (_x: number) => {
        await Sleeper.sleep(this._speed)
        
        const m: number = ++this._movements;
        if(this.started) {
            this._screen!.drawMaze(this._maze!);
            this.moveListener(m);
            if (this._movements >= this._max) {
                await Sleeper.sleep(this._speed)
                this.endListener(false);
                this.started = false;
                if (this._timer != null) {
                    this._timer.stop();
                }
                this._screen?.printMaxMovementsMessage();
                this._timer = null;
            }
        } 
        
        requestAnimationFrame(this.refresh);
    };

    // private writeMovement(count: number, x: number, y: number): void
    // {
    //   const path: string = "steps.csv";
    //   StreamWriter streamWriter = (StreamWriter) null;
    //   try
    //   {
    //     if (File.Exists(path))
    //     {
    //       streamWriter = File.AppendText(path);
    //       streamWriter.WriteLine(string.Format("{0},{1},{2}", (object) count, (object) x, (object) y));
    //     }
    //     else
    //     {
    //       streamWriter = new StreamWriter((Stream) new FileStream(path, FileMode.OpenOrCreate, FileAccess.Write));
    //       streamWriter.WriteLine("#, X, Y");
    //       streamWriter.WriteLine(string.Format("{0},{1},{2}", (object) count, (object) x, (object) y));
    //     }
    //   }
    //   catch (ex)
    //   {
    //   }
    //   finally
    //   {
    //     if (streamWriter != null)
    //     {
    //       streamWriter.Flush();
    //       streamWriter.Close();
    //     }
    //   }
    // }

    // private writeResult(movimientos: number, tiempo: number): void
    // {
    // const path: string = "times.csv";
    //   StreamWriter streamWriter = (StreamWriter) null;
    //   try
    //   {
    //     if (File.Exists(path))
    //     {
    //       streamWriter = File.AppendText(path);
    //       streamWriter.WriteLine(string.Format("\"{0} {1}\",{2},{3},{4}", (object) DateTime.Now.ToShortDateString(), (object) DateTime.Now.ToLongTimeString(), (object) this._file, (object) movimientos, (object) tiempo));
    //     }
    //     else
    //     {
    //       streamWriter = new StreamWriter((Stream) new FileStream(path, FileMode.OpenOrCreate, FileAccess.Write));
    //       streamWriter.WriteLine("Fecha, Laberinto, Movimientos, Tiempo");
    //       streamWriter.WriteLine(string.Format("\"{0} {1}\",{2},{3},{4}", (object) DateTime.Now.ToShortDateString(), (object) DateTime.Now.ToLongTimeString(), (object) this._file, (object) movimientos, (object) tiempo));
    //     }
    //   }
    //   catch (Exception ex)
    //   {
    //   }
    //   finally
    //   {
    //     if (streamWriter != null)
    //     {
    //       streamWriter.Flush();
    //       streamWriter.Close();
    //     }
    //   }
    // }



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
        this._screen = new MazeScreen(this, this.canvas, this.ctx);
        this._x = this._maze!.iX();
        this._y = this._maze!.iY();
        this._movements = 0;
        this.started = true;
        this.refresh(0);
        await Sleeper.sleep(this._speed)
        
        // this._screen.printPosition();
        
        this._timer = new Stopwatch();
        this._timer.start();
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
        if ((dir & this._maze!.loc(this._x, this._y)) !==  0) {
            await Sleeper.sleep(this._speed)
            return -1;
        }
        // this._screen?.deletePosition();
        // const m: number = ++this._movements;
        // const t: number = (this._timer?.getElapsedTime()??0)/1000;
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
        // this.writeMovement(this._movements, this._x, this._y);
        await Sleeper.sleep(this._speed);
        this._screen?.printPosition();
        // if(this.moveListener){
        //     this.moveListener(m);
        // }
        
        // Thread.Sleep(this._speed);
        if (this.isDone())
        {
            await Sleeper.sleep(10);
            if (this._timer != null) {
                this._timer.stop();
            }
            if(this.endListener){
                
                this.endListener(true);
                this.started = false;
            }
            this._screen?.printSuccessMessage();
            // new Thread((ThreadStart) (() => this.writeResult(m, t))).Start();
            this._timer = null;
            return 15;
        }
        if (this._movements < this._max) {
            return this._maze!.loc(this._x, this._y);
        }
        // this._x = this._maze!.fX();
        // this._y = this._maze!.fY();
        // if (this._timer != null) {
        //     this._timer.stop();
        // }
        // // if(this.endListener){
        // //     this.endListener(false);
        // //     this.started = false;
        // // }
        // this._screen?.printMaxMovementsMessage();
      
        // // new Thread((ThreadStart) (() => this.writeResult(m, t))).Start();
        // this._timer = null;
        return 15;
    }

}