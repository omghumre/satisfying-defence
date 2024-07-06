
    const gameArea = document.getElementById('gameArea');
    const defense = document.getElementById('defense');
    let enemies = [];
    let bullets = [];
    let gamePaused = false;
    let firingInterval;

    // Create enemies on click
    gameArea.addEventListener('click', function(event) {
        createEnemy(event.clientX, event.clientY);
    });

    // Function to create enemy
    function createEnemy(x, y) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = `${x - 5}px`;
        enemy.style.top = `${y - 5}px`;  // Centering the enemy on click
        gameArea.appendChild(enemy);
        enemies.push(enemy);
        if (!gamePaused) {
            moveEnemy(enemy); // Start moving towards defense if not paused
            shootBullet(enemy);
        }
    }

    // Play button functionality
    const playButton = document.getElementById('playButton');
    playButton.addEventListener('click', function() {
        gamePaused = false;
        enemies.forEach(enemy => {
            if (!enemy.dataset.moving) {
                moveEnemy(enemy);
            }
        });
        firingInterval = setInterval(() => {
            enemies.forEach(enemy => {
                if (!gamePaused) {
                    shootBullet(enemy);
                }
            });
        }, 1000); // Firing rate every second
    });

    // Pause button functionality
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.addEventListener('click', function() {
        gamePaused = true;
        clearInterval(firingInterval);
    });

    function moveEnemy(enemy) {
        if (!gamePaused) {
            enemy.dataset.moving = true; // Set attribute to indicate it's moving
            const interval = setInterval(() => {
                const defenseRect = defense.getBoundingClientRect();
                const enemyRect = enemy.getBoundingClientRect();

                const dx = defenseRect.left + defenseRect.width / 2 - (enemyRect.left + enemyRect.width / 2);
                const dy = defenseRect.top + defenseRect.height / 2 - (enemyRect.top + enemyRect.height / 2);

                const angle = Math.atan2(dy, dx);
                enemy.style.left = `${enemy.offsetLeft + Math.cos(angle) * 2}px`;
                enemy.style.top = `${enemy.offsetTop + Math.sin(angle) * 2}px`;

                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < defenseRect.width / 2) {
                    clearInterval(interval);
                    enemy.remove();
                    enemies = enemies.filter(e => e !== enemy);
                }
            }, 15);
        }
    }

    function shootBullet(enemy) {
        if (!gamePaused) {
            const bullet = document.createElement('div');
            bullet.classList.add('bullet');
            bullet.style.left = `${defense.offsetLeft + defense.clientWidth / 2 - 2.5}px`;
            bullet.style.top = `${defense.offsetTop + defense.clientHeight / 2 - 2.5}px`;
            gameArea.appendChild(bullet);
            bullets.push(bullet);

            const bulletMove = () => {
                const bulletRect = bullet.getBoundingClientRect();
                const enemyRect = enemy.getBoundingClientRect();

                const dx = enemyRect.left + enemyRect.width / 2 - (bulletRect.left + bulletRect.width / 2);
                const dy = enemyRect.top + enemyRect.height / 2 - (bulletRect.top + bulletRect.height / 2);

                const angle = Math.atan2(dy, dx);
                bullet.style.left = `${bullet.offsetLeft + Math.cos(angle) * 20}px`; // Increased bullet speed
                bullet.style.top = `${bullet.offsetTop + Math.sin(angle) * 20}px`; // Increased bullet speed

                if (
                    bulletRect.left < enemyRect.right &&
                    bulletRect.right > enemyRect.left &&
                    bulletRect.top < enemyRect.bottom &&
                    bulletRect.bottom > enemyRect.top
                ) {
                    clearInterval(interval);
                    enemy.remove();
                    enemies = enemies.filter(e => e !== enemy);
                    bullet.remove();
                    bullets = bullets.filter(b => b !== bullet);
                } else if (
                    bulletRect.left < 0 || bulletRect.right > window.innerWidth ||
                    bulletRect.top < 0 || bulletRect.bottom > window.innerHeight
                ) {
                    clearInterval(interval);
                    bullet.remove();
                    bullets = bullets.filter(b => b !== bullet);
                }
            };

            const interval = setInterval(bulletMove, 20); 
        }
    }
