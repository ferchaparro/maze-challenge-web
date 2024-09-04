export class Confeti {
    
    constructor(private confetiContainer: HTMLElement) {}

    createConfetiExplosion() {
        
        const confetiCount = 300; 
    const colors = ['#FF5733', '#FFBD33', '#DBFF33', '#75FF33', '#33FF57', '#33FFBD', '#33DBFF', '#3375FF', '#5733FF', '#BD33FF'];

    for (let i = 0; i < confetiCount; i++) {
        const confeti = document.createElement('div');
        confeti.classList.add('confeti');
        
        const angle = Math.random() * 360;
        const distance = Math.random() * 800; 
        confeti.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        confeti.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
        
        confeti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        this.confetiContainer.appendChild(confeti);

        setTimeout(() => {
            confeti.remove();
        }, 3000); 
    }
    }
    
}