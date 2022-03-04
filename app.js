function getRandomValue(minNum, maxNum) {
    const attackValue = Math.floor(Math.random() * (1+maxNum-minNum)) + minNum; // integer between [min, max]
    return attackValue;
}

const app = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            logMessages: []
        };
    },
    computed: {
        monsterStyles() {
            if (this.monsterHealth < 0) return { width: '0%' }
            else return { width: this.monsterHealth + '%' }
        },
        playerStyles() {
            if (this.playerHealth < 0) return { width: '0%' }
            else return { width: this.playerHealth + '%' }
        },
        specialAttackLogic() {
            return this.currentRound % 3 !== 0;
        }
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                // player lost
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                // monster lost
                this.winner = 'player';
            }
        }
    },
    methods: {
        attackMonster() {
            this.currentRound += 1;
            const attackValue = getRandomValue(5, 12); // [5, 12]
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer(); // monster attacks back
        },
        attackPlayer() {
            const attackValue = getRandomValue(8, 15); // [8, 15]
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
        },
        specialAttack() {
            this.currentRound += 1;
            const attackValue = getRandomValue(10, 25); // [10, 25]
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer(); // monster attacks back
        },
        healPlayer() {
            this.currentRound += 1;
            const healValue = getRandomValue(8, 20);
            if (this.playerHealth + healValue > 100) this.playerHealth = 100;
            else this.playerHealth += healValue;
            this.addLogMessage('player', 'heal', healValue);
            this.attackPlayer(); // monster still attacks
        },
        startGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound = 0;
            this.winner = null;
            this.logMessages = [];
        },
        surrender() {
            this.winner = 'monster'; // better approach
            // this.playerHealth = 0; // not the better approach
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            }); // reverse of push()
        }
        // stopped at 1:04 / 14:11 Video 57
    }
});

app.mount('#game');