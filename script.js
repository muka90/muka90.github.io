const canvas = document.getElementById('network-bg');
const context = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) {
            this.vx = -this.vx;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.vy = -this.vy;
        }
    }

    draw() {
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.fill();
    }
}

let particles = [];
for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
}

const mouse = {
    x: undefined,
    y: undefined,
    radius: 200
};

canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    console.log(`Mouse moved to: (${mouse.x}, ${mouse.y})`); // Debugging log
});

canvas.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
    console.log(`Mouse left the canvas`); // Debugging log
});


function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                context.strokeStyle = 'rgba(255, 255, 255, ' + (1 - distance / 150) + ')';
                context.lineWidth = 0.5;
                context.beginPath();
                context.moveTo(particles[i].x, particles[i].y);
                context.lineTo(particles[j].x, particles[j].y);
                context.stroke();
            }
        }
    }
}

function connectToMouse() {
    if (mouse.x === undefined || mouse.y === undefined) return;

    particles.forEach(particle => {
        let dx = mouse.x - particle.x;
        let dy = mouse.y - particle.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            context.strokeStyle = 'rgba(255, 255, 255, ' + (1 - distance / mouse.radius) + ')';
            context.lineWidth = 0.5;
            context.beginPath();
            context.moveTo(mouse.x, mouse.y);
            context.lineTo(particle.x, particle.y);
            context.stroke();
            console.log(`Connecting to mouse at: (${mouse.x}, ${mouse.y}) with distance: ${distance}`); // Debugging log
        }
    });
}


function animate() {
    context.fillStyle = 'rgba(0, 0, 0, 0.15)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    connectParticles();
    connectToMouse();

    requestAnimationFrame(animate);
}
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


animate();
