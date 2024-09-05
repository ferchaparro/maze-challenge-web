export class MazeConfig {

    private separator: string = ',';
    private mazeWidth: number = 0;
    private mazeHeight: number = 0;
    private initX: number = 0;
    private initY: number = 0;
    private goalX: number = 0;
    private goalY: number = 0;
    private maze: number[][] | null = null;

    constructor(private fileConfig: string) {}

    async load() {
        await this.loadConfig(this.fileConfig);
    }
    
    async loadConfig( fileConfig: string) {
        try {
            const fileLoaded = await fetch(`/mazes/${fileConfig}`).then(res => res.text());
            const lines = fileLoaded.split(/\r?\n/)
            let strArray1 = lines[0].split(this.separator);
            this.mazeWidth = parseInt(strArray1[0]);
            this.mazeHeight = parseInt(strArray1[1]);
            let strArray2 = lines[1].split(this.separator);
            this.initX = parseInt(strArray2[0]);
            this.initY = parseInt(strArray2[1]);
            let strArray3 = lines[2].split(this.separator);
            this.goalX = parseInt(strArray3[0]);
            this.goalY = parseInt(strArray3[1]);
            this.maze = new Array(this.mazeHeight).fill(0).map(() => new Array(this.mazeWidth).fill(0));
            let strArray4 = lines[3].split(this.separator);
            for (let index1 = 0; index1 < this.mazeHeight; ++index1)
            {
                for (let index2 = 0; index2 < this.mazeWidth; ++index2) {
                    this.maze[index1][index2] = parseInt(strArray4[index1 * this.mazeWidth + index2]);
                }
            }
        } catch (error) {
          console.error('Error loading file:', error);
        }
    }

    width = () => this.mazeWidth;

    height = () => this.mazeHeight;

    iX = () => this.initX;

    iY = () => this.initY;

    fX = () => this.goalX;

    fY = () => this.goalY;

    loc = (x: number, y: number) => this.maze? this.maze[x][y]:0;
    
}
