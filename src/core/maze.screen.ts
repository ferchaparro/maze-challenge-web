import { MazeInfo } from "./maze-info";
import { MazeConfig } from "./maze.config";

export class MazeScreen {
    public static CELL_SIZE: number = 25;
    private static MARGIN_TOP: number = 0;
    private static MARGIN_LEFT: number = 0;
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

    private printOnCell(x: number, y: number, c: string): void {
        const permutedY = (this.config!.width()-1)-x>=0?(this.config!.width()-1)-x:(this.config!.width()-1)-x+this.config!.width()-1
        const permutedX = y-(this.config!.height()-1)>0?y-(this.config!.height()-1):y-(this.config!.height()-1)+this.config!.height()-1
        const centerX = (permutedX + 0.5) * MazeScreen.CELL_SIZE + MazeScreen.MARGIN_LEFT;
        const centerY = (permutedY + 0.5) * MazeScreen.CELL_SIZE + MazeScreen.MARGIN_TOP;
        
        // Calcular el radio del círculo, ajustado por la escala
        const radius = MazeScreen.CELL_SIZE * 0.27; // Ajustar el 0.4 para cambiar el tamaño del círculo

        // Dibujar el círculo
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = c;
        this.ctx.fill();
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
    }
}