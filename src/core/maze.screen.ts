import { MazeInfo } from "./maze-info";
import { MazeConfig } from "./maze.config";

export class MazeScreen {
    public static CELL_SIZE: number = 25;
    private static MARGIN_TOP: number = 0;
    private static MARGIN_BOTTOM: number = 0;
    private static MARGIN_LEFT: number = 0;
    private static MARGIN_RIGTH: number = 0;
    private height: number = 0;
    private width: number = 0;
    private config: MazeConfig | null = null;
    

    constructor(private mazeInfo: MazeInfo, private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {
        this.ctx.scale(MazeScreen.CELL_SIZE, MazeScreen.CELL_SIZE);
    }

    drawMaze(config: MazeConfig): void {
        this.config = config;
        this.canvas.width = (config.width() * MazeScreen.CELL_SIZE);
        this.canvas.height = (config.height() * MazeScreen.CELL_SIZE);

        this.height = config.height();
        this.width = config.width();
        for (let index = 0; index < this.width; ++index)
        {
            for (let y = 0; y < this.width; ++y) {
                MazeScreen.printCell(this.ctx, MazeScreen.MARGIN_LEFT + y * MazeScreen.CELL_SIZE, MazeScreen.MARGIN_TOP + index * MazeScreen.CELL_SIZE, config.loc(this.height - 1 - index, y));
            }
        }
        
        this.printOnCell(config.fX(), config.fY(), 'green');
        this.printPosition()
    }

    public printPosition(): void {
        
        this.printOnCell(this.mazeInfo.X(), this.mazeInfo.Y(), 'white');
    }

    // public deletePosition(): void {
    //     this.printOnCell(this.mazeInfo.X(), this.mazeInfo.Y(), 'black');
    // }

    private printOnCell(x: number, y: number, c: string): void {
        const num1: number = this.mazeInfo.movements();
        const num2: number = this.mazeInfo.time();
        const permutedY = (this.config!.width()-1)-x>=0?(this.config!.width()-1)-x:(this.config!.width()-1)-x+this.config!.width()-1
        const permutedX = y-(this.config!.height()-1)>0?y-(this.config!.height()-1):y-(this.config!.height()-1)+this.config!.height()-1
        const centerX = (permutedX + 0.5) * MazeScreen.CELL_SIZE + MazeScreen.MARGIN_LEFT;
        const centerY = (permutedY + 0.5) * MazeScreen.CELL_SIZE + MazeScreen.MARGIN_TOP;
        
        // Calcular el radio del círculo, ajustado por la escala
        const radius = MazeScreen.CELL_SIZE * 0.27; // Ajustar el 0.4 para cambiar el tamaño del círculo

        const permutedCenterX = (x + 0.5) * MazeScreen.CELL_SIZE + MazeScreen.MARGIN_LEFT;
        const permutedCenterY = this.canvas.height - (y + 0.5) * MazeScreen.CELL_SIZE - MazeScreen.MARGIN_TOP;

        // Dibujar el círculo
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = c;
        this.ctx.fill();
    //   Console.SetCursorPosition(MazeScreen.MARGIN_LEFT + y * MazeScreen.CELL_SIZE, MazeScreen.MARGIN_TOP + (this.height - 1) * MazeScreen.CELL_SIZE - x * MazeScreen.CELL_SIZE);
    //   Console.Write(c);
    //   Console.SetCursorPosition(MazeScreen.MARGIN_LEFT, MazeScreen.MARGIN_TOP + this.height * MazeScreen.CELL_SIZE + 1);
    //   Console.Write("Número de movimientos: {0}", (object) num1);
    //   Console.SetCursorPosition(MazeScreen.MARGIN_LEFT, MazeScreen.MARGIN_TOP + this.height * MazeScreen.CELL_SIZE + 2);
    //   Console.Write("Tiempo transcurrido: {0} segundos.", (object) num2);
    }

    public printSuccessMessage(): void {
        console.log('Congratulations! You have finished the maze successfully!');
    //   const num1: number = this.mazeInfo.movements();
    //   const num2: number = this.mazeInfo.time();
    //   const num3: number = MazeScreen.MARGIN_LEFT - 5;
    //   const num4: number = MazeScreen.MARGIN_TOP + this.height * MazeScreen.CELL_SIZE;
    //   const left1: number = num3;
    //   const top1: number = num4;
    //   const num5: number = top1 + 1;
    //   Console.SetCursorPosition(left1, top1);
    //   Console.WriteLine("FELICIDADES ha finalizado exitosamente su recorrido en el laberinto.");
    //   const left2: number = num3;
    //   const top2: number = num5;
    //   const num6: number = top2 + 1;
    //   Console.SetCursorPosition(left2, top2);
    //   Console.WriteLine("Cantidad de movimientos requieridos:     {0}.", (object) num1);
    //   const left3: number = num3;
    //   const top3: number = num6;
    //   const num7: number = top3 + 1;
    //   Console.SetCursorPosition(left3, top3);
    //   Console.WriteLine("Cantidad de tiempo requerido:            {0} segundos.", (object) num2);
    }

    public printMaxMovementsMessage(): void {
    //   const num1: number = this.mazeInfo.movements();
    //   const num2: number = this.mazeInfo.time();
    //   const num3: number = MazeScreen.MARGIN_LEFT - 5;
    //   const num4: number = MazeScreen.MARGIN_TOP + this.height * MazeScreen.CELL_SIZE;
    //   const left1: number = num3;
    //   const top1: number = num4;
    //   const num5: number = top1 + 1;
    //   Console.SetCursorPosition(left1, top1);
    //   Console.WriteLine("LO SENTIMOS ha superado el número máximo de movimientos permitidos..");
    //   const left2: number = num3;
    //   const top2: number = num5;
    //   const num6: number = top2 + 1;
    //   Console.SetCursorPosition(left2, top2);
    //   Console.WriteLine("Cantidad de movimientos realizados:     {0}.", (object) num1);
    //   const left3: number = num3;
    //   const top3: number = num6;
    //   const num7: number = top3 + 1;
    //   Console.SetCursorPosition(left3, top3);
    //   Console.WriteLine("Cantidad de tiempo:            {0} segundos.", (object) num2);
    }

    private static printCell(ctx: CanvasRenderingContext2D, x: number, y: number, c: number): void {
        const size = MazeScreen.CELL_SIZE;
        
        const borders = {
            south: (c & 1) === 1,
            east: (c & 2) === 2,
            north: (c & 4) === 4,
            west: (c & 8) === 8,
        };
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, size, size);

        // Configurar el estilo de los bordes
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;

        // Dibujar los bordes especificados
        ctx.beginPath();
        
        if (borders.north) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + size, y);
        }

        if (borders.east) {
            ctx.moveTo(x + size, y);
            ctx.lineTo(x + size, y + size);
        }

        if (borders.south) {
            ctx.moveTo(x + size, y + size);
            ctx.lineTo(x, y + size);
        }

        if (borders.west) {
            ctx.moveTo(x, y + size);
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();

    //   const num: number = MazeScreen.CELL_SIZE / 2;
    //   const str: string = "#";
    //   if ((c & 4) == 4)
    //   {
    //     for (let index = num; index >= -num; --index)
    //     {
    //       Console.SetCursorPosition(x - index, y - num);
    //       Console.Write(str);
    //     }
    //   }
    //   if ((c & 1) == 1)
    //   {
    //     for (let index = num; index >= -num; --index)
    //     {
    //       Console.SetCursorPosition(x - index, y + num);
    //       Console.Write(str);
    //     }
    //   }
    //   if ((c & 2) == 2)
    //   {
    //     for (let index = num; index >= -num; --index)
    //     {
    //       Console.SetCursorPosition(x + num, y - index);
    //       Console.Write(str);
    //     }
    //   }
    //   if ((c & 8) != 8)
    //     return;
    //   for (let index = num; index >= -num; --index)
    //   {
    //     Console.SetCursorPosition(x - num, y - index);
    //     Console.Write(str);
    //   }
    }
}