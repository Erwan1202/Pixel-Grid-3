const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.warn('\nATTENTION : Les tests E2E complets vont être lancés.');
console.log('Cela va prendre du temps (estimation : 2 à 3 minutes) car ils contactent les BDD en ligne et utilisent bcrypt.');

rl.question('\nVoulez-vous vraiment lancer les tests ? (y/N) ', (answer) => {
    
    if (answer.toLowerCase() === 'y') {
        console.log('\nBon on y va ! aller vous prendre un café ;)\n');
        try {
            execSync('jest --verbose --detectOpenHandles', { stdio: 'inherit' });
        } catch (error) {
            console.error('\nTests échoués.');
            process.exit(1);
        }
    } else {
        console.log('\nTests annulés.');
    }

    rl.close();
});