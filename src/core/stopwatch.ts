export class Stopwatch {
    private startTime: number = 0;
    private endTime: number = 0;
    private running: boolean = false;
  
    start(): void {
      if (!this.running) {
        this.startTime = performance.now();
        this.running = true;
        this.endTime = 0;
      }
    }
  
    stop(): void {
      if (this.running) {
        this.endTime = performance.now();
        this.running = false;
      }
    }
  
    reset(): void {
      this.startTime = 0;
      this.endTime = 0;
      this.running = false;
    }
  
    getElapsedTime(): number {
      if (this.running) {
        return performance.now() - this.startTime; // Tiempo en milisegundos
      } else if (this.startTime && this.endTime) {
        return this.endTime - this.startTime; // Tiempo en milisegundos
      } else {
        return 0;
      }
    }
  }
  
  // Ejemplo de uso:
  const sw = new Stopwatch();
  sw.start();
  
  setTimeout(() => {
    sw.stop();
    console.log(`Tiempo transcurrido: ${sw.getElapsedTime()} ms`);
  }, 2000);