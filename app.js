Vue.component('modal', {
    props: {
        playerlabel: String,
        nextlabel: String,
        donelabel: String,
        modaltitle: String,
        nbofplayers: Number,
        playersnamecustomized: Boolean,
        playersnames: Array
    },
    data: function() {
        return {
            count: 1,
            playersNamesComponent: [...this.playersnames],
            playersNameCustomizedComponent: this.playersnamecustomized,
        }
    },
    watch: {
        playersnames: function(newVal, oldVal) {
            this.playersNamesComponent = [...this.playersnames];
        }
    },
    computed: {
        modalTitleNumbered: function() {
            return this.$props.modaltitle.replace('{{x}}', this.count);
        }
    },
    template: `
        <div class="modal-wrapper">
            <div class="modal-box">
                <div class="modal-bar">
                    <p class="modal-title">{{ modalTitleNumbered }}</p>
                    <a class="modal-btn modal-btn-close" v-on:click="$emit('closemodal', false)">X</a>
                </div>
                <div class="modal-content">
                    <div v-if="this.count <= this.$props.nbofplayers" class="modal-players-name">
                        <input type="text" v-bind:value="getPlayerName(playersNamesComponent, count)" ref="name" />
                        <button class="btn" v-on:click="setName">{{setBtnLabel()}}</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        getPlayerName: function(){
            return this.$props.playersnames[this.count-1];
        },
        setName: function(){
            this.playersNamesComponent[this.count-1] = this.$refs.name.value;
            if(this.count == this.$props.nbofplayers) {
                this.$emit('playersnamecustomizedfromcomponent', true);
                this.$emit('playersnamefromcomponent', this.playersNamesComponent);
                this.$emit('closemodal', false);
            }
            this.count++;
        },
        setBtnLabel: function(){
            if(this.count == this.$props.nbofplayers) {
                return this.$props.donelabel
            } else {
                return this.$props.nextlabel
            }
        },
    }
});
const app = new Vue({
    el: '#app',
    data: {
        game: 'TicTacToe++',
        difficulties: [
            {
                difficulty: 0,
                difficultyLabel: 'easy',
                base: 3
            },
            {
                difficulty: 1,
                difficultyLabel: 'normal',
                base: 4
            },
            {
                difficulty: 2,
                difficultyLabel: 'hard',
                base: 5
            },
            {
                difficulty: 3,
                difficultyLabel: 'inferno',
                base: 10
            }
        ],
        difficultySet: null,
        grid: [],
        squares: 0,
        gameEnded: false,
        modalShown: false,
        nbOfPlayers: 2,
        currentPlayer: 1,
        winnerPlayer: null,
        playersNameCustomized: false,
        playersNames: [],
        gamePlayed: 0,
        gameWonBy: [0,0,0,0],
        dashStyle: {},
        playersSymbolsPool: ['X','O','Y','Z'],
        playersSymbols: [],
        langSet: 1,
        langs: [
            {
                pos: 0,
                name: 'english',
            },
            {
                pos: 1,
                name: 'français'
            },
        ],
        texts: {
            welcome: [
                "Welcome to ",
                "Bienvenue au "
            ],
            difficulties: [
                [
                    "easy",
                    "facile",
                ],
                [
                    "normal",
                    "normale",
                ],
                [
                    "hard",
                    "difficile",
                ],
                [
                    "inferno",
                    "infernale",
                ],
            ],
            newGame: [
                "New game",
                "Nouvelle partie"
            ],
            selectDifficulty: [
                "Difficulty",
                "Difficultée"
            ],
            selectAnOption: [
                "select an option",
                "choisissez une option"
            ],
            selectNbPlayers: [
                "Number of players",
                "Nombre de joueurs"
            ],
            setPlayersName: [
                "Set players name",
                "Entrer le nom des joueurs"
            ],
            setPlayersNameModalTitle: [
                "Set player {{x}}'s name",
                "Entrer le nom du joueur {{x}}"
            ],
            player: [
                "Player",
                "Joueur"
            ],
            next: [
                "Next",
                "Suivant"
            ],
            done: [
                "Done",
                "Terminé"
            ],
            selectLang: [
                "Language",
                "Langue"
            ],
            gameFeedBackTie: [
                "It's a draw",
                "C'est un match nul"
            ],
            gameFeedBackWin: [
                " wins the game",
                " remporte la partie"
            ],
            gameFeedBackTurn: [
                "'s turn",
                "C'est le tour de ",
            ],
            restart: [
                "Restart",
                "Recommencer"
            ],
            scoreboardTitle: [
                "Scoreboard",
                "Tableau de pointage"
            ],
            scoreboardPlayed: [
                "Games played",
                "Parties jouées"
            ],
            scoreboardVictory: [
                "Wins",
                "Victoires"
            ]
        },
    },
    computed: {
        compTextsWelcome: function(){
            return [this.texts.welcome[0] + this.game, 
                    this.texts.welcome[1] + this.game]
        },
        compTextsGameFeedBackWin: function(){
            return [this.playersNames[this.winnerPlayer-1] + this.texts.gameFeedBackWin[0],
                    this.playersNames[this.winnerPlayer-1] + this.texts.gameFeedBackWin[1]]
        },
        compTextsGameFeedBackTurn: function(){
            return [this.playersNames[this.currentPlayer-1] + this.texts.gameFeedBackTurn[0],
                    this.texts.gameFeedBackTurn[1] + this.playersNames[this.currentPlayer-1],
            ]
        },
    },
    watch: {
        langSet: function(){
            this.setPlayersName();
        },
        playersNames: {
            handler: function(){
                
            },
            deep:true,
            immediate: true,
        },
        gameEnded: function(){
            if(this.gameEnded){
                this.gamePlayed++;
            }
        }
    },
    methods: {
        setTtt: function(){
            this.gameEnded = false;
            this.winnerPlayer = null;
            this.playersSymbols = [];
            this.dashStyle = {};
            if(this.difficultySet == null) this.difficultySet = 0; // if difficulty isn't set, set a default
            const difficultyObject = this.difficulties[this.difficultySet];
            this.squares = difficultyObject.base * difficultyObject.base; // set total square in the game based on difficulty (rows)
            for(let i = 0; i < this.nbOfPlayers; i++) {
                this.playersSymbols.push(this.playersSymbolsPool[i]);
            }
            this.grid = this.generateGrid(this.squares); // set grid layout in an array
            this.$forceUpdate();
            this.setFeedbackText();
        },
        squareClicked: function(index, e) {
            if(this.grid[index-1] === null && !this.gameEnded) { // square isn't set yet and the game isn't over
                this.grid[index-1] = this.playersSymbols[this.currentPlayer-1];

                // end game checks
                const base = this.difficulties[this.difficultySet].base;
                // rows colums, diagonals check
                loopTopLevelComb: for(let i = 1; i <= base; i++) {
                    const comb = { col: [], row: [], diag1: [], diag2: [] };
                    for(let k = 1; k <= base; k++) {
                        comb.row.push(this.grid[k + (base * (i-1)) - 1]);
                        comb.col.push(this.grid[(i + (( base * k) - base)) - 1]);
                        comb.diag1.push(this.grid[(((k * base) - base) + k) - 1]);
                        comb.diag2.push(this.grid[(((k * base) + base) - k) - base]);
                    }
                    //console.log(comb.row);
                    // check row comb
                    if (this.checkIfCombWins(comb.row)) { // if comb is true, a line is complete
                        this.declareWinner('row', i);
                        break loopTopLevelComb;
                    }
                    // check colum comb
                    if (this.checkIfCombWins(comb.col)) { // if comb is true, a line is complete
                        this.declareWinner('col', i);
                        break loopTopLevelComb;
                    }
                    // check diagonal 1 comb
                    if (this.checkIfCombWins(comb.diag1)) { // if comb is true, a line is complete
                        this.declareWinner('diag', 1);
                        break loopTopLevelComb;
                    }
                    // check diagonal 2 comb
                    if (this.checkIfCombWins(comb.diag2)) { // if comb is true, a line is complete
                        this.declareWinner('diag', 2);
                        break loopTopLevelComb;
                    }
                }
                if(!this.grid.includes(null)) { // if grid is complete
                    this.gameEnded = true;
                }

                // if game do not ends
                this.currentPlayer++;
                if(this.currentPlayer > this.nbOfPlayers) this.currentPlayer = 1;
            }
        },
        checkIfCombWins: function(comb) {
            return comb.every( (val, i, arr) => val === arr[0] && val != null ); // check all symbols in a line are the same
        },
        declareWinner: function(type, pos) {
            this.gameEnded = true;
            this.winnerPlayer = this.currentPlayer;
            this.gameWonBy[this.winnerPlayer-1]++;
            // set winning dash style
            const squareWidth = document.querySelector('.square').offsetWidth;
            if(type == "row") {
                this.dashStyle.top = (squareWidth * pos) - (squareWidth / 2 + 1) + "px";
            } else if(type == "col") {
                this.dashStyle.left = (squareWidth * pos) - (squareWidth / 2 - 1) + "px";
                this.dashStyle.transform = "rotate(90deg)";
            } else if(type == "diag") {
                if(pos == 1) {
                    this.dashStyle.width = "140%";
                    this.dashStyle.left = "1px";
                    this.dashStyle.transform = "rotate(45deg)";
                } else {
                    this.dashStyle.width = "140%";
                    this.dashStyle.left = "1px";
                    this.dashStyle.bottom = "0";
                    this.dashStyle.top = "auto";
                    this.dashStyle.transform = "rotate(-45deg)";
                }
            }
            //this.dashStyle;
        },
        setFeedbackText: function() {
            if(this.gameEnded) {
                if(!this.winnerPlayer) {
                    return this.texts.gameFeedBackTie[this.langSet];
                } else {
                    return this.compTextsGameFeedBackWin[this.langSet];
                }
            } else {
                return this.compTextsGameFeedBackTurn[this.langSet];
            }
        },
        setFeedbackSymbol: function() {
            if(this.gameEnded) {
                if(!this.winnerPlayer) {
                    return "-";
                } else {
                    return this.playersSymbols[this.winnerPlayer-1];
                }
            } else {
                return this.playersSymbols[this.currentPlayer-1];
            }
        },
        generateGrid: function(nb) {
            let grid = [];
            for(let i = 0; i < nb; i++) {
                grid.push(null);
            }
            return grid;
        },
        openPlayersNameModal: function() {
            this.modalShown = true;
        },
        setPlayersName: function(names) {
            if(!this.playersNameCustomized) {
                let arr = [];
                for(let i = 0; i < this.playersSymbolsPool.length; i++) {
                    arr.push(`${this.texts.player[this.langSet]} ${i+1}`)
                }
                this.playersNames = arr;
            } else {
                if(names) {
                    this.playersNames = names;
                }
            }
        },
    },
    mounted: function () {
        console.log('App ready!');
        this.setPlayersName();
    }
});