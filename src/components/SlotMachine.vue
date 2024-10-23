<template>

  <div class="slot-machine">
    <h3>Game Center</h3>
    <!-- Player Name Input -->
    <div v-if="!playerId" class="player-name-input">

      <form class="row">
        <div class="col-auto">
          <input type="text" class="form-control-plaintext" placeholder="Enter your player name" id="playerName" v-model="inputPlayerName">
        </div>
        <div class="col-auto">
          <button @click="setPlayerId" class="btn btn-primary mb-3">Submit</button>
        </div>
      </form>
    </div>

    <!-- Slot Machine Display -->
    <div v-else>
      <!-- <div class="reels">
        <div
          v-for="(reel, index) in reels"
          :key="index"
          class="reel"
          :class="{'spinning': isSpinning[index]}"
        >
          <div
            v-for="(symbol, rowIndex) in reel"
            :key="rowIndex"
            :class="{'symbol': true, 'winning-symbol': isWinningSymbol(rowIndex, index)}"
          >
            {{ symbol }}
          </div>
        </div>
      </div> -->

      <div class="reels row justify-content-center">
  <div
    v-for="(reel, index) in reels"
    :key="index"
    class="reel col"
    :class="{'spinning': isSpinning[index]}"
    style="max-width: 18%;"
  >
    <div
      v-for="(symbol, rowIndex) in reel"
      :key="rowIndex"
      :class="['symbol', 'd-flex', 'justify-content-center', 'align-items-center', 'mb-2', isWinningSymbol(rowIndex, index) ? 'winning-symbol bg-warning' : 'bg-light']"
      style="width: 60px; height: 60px; border: 1px solid #ccc;"
    >
      {{ symbol }}
    </div>
  </div>
</div>

      <!-- Bet Options -->
      <div class="controls">
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Paylines: {{ selectedPaylines }}</label>
            <input type="range" class="form-range" min="1" max="25" v-model="selectedPaylines" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Bet per line: {{ betPerLine }}</label>
            <input type="range" class="form-range" min="1" max="10" v-model="betPerLine" />
          </div>
        </div>

        <div class="d-grid gap-2 d-md-block">
          <button @click="spin" class="btn btn-primary" :disabled="isSpinning.some(spin => spin)">Spin</button>
        </div>
      </div>

      <!-- Game History -->
      <div class="game-history">
        <h3>Game History</h3>
        <ul class="list-group">
          <li v-for="(result, index) in gameHistory" :key="index" class="list-group-item">
            <span class="fw-bold">Bet:</span> {{ result.totalBet }}, 
            <span class="fw-bold">Winnings:</span> {{ result.winnings }}
          </li>
        </ul>
      </div>

      <div class="balance">
        <h3>Balance: ${{ balance }}</h3>
      </div>
    </div>
    <!-- <LeaderBoard ref="leaderBoardRef" /> -->
  </div>
</template>

<script>
import axios from 'axios';
// import LeaderBoard from './LeaderBoard.vue';

export default {
  components: {
    // LeaderBoard
  },
  data() {
    return {
      reels: [
        [],
        [],
        [],
        [],
        []
      ],
      paylines: [
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2],
        [0, 1, 2, 1, 0],
        [2, 1, 0, 1, 2],
        [0, 0, 1, 2, 2],
        [2, 2, 1, 0, 0],
        [1, 0, 1, 2, 1],
        [1, 2, 1, 0, 1],
        // Add more payline definitions here
        [0, 0, 0, 1, 1],
        [1, 1, 1, 2, 2],
        [2, 2, 2, 1, 0],
        [0, 1, 0, 1, 0],
        [2, 1, 2, 1, 2],
        [0, 2, 1, 0, 2],
        [1, 0, 1, 0, 1],
        [0, 2, 0, 2, 0],
        [2, 0, 2, 0, 2],
        [1, 1, 0, 0, 1],
        [0, 2, 1, 1, 0],
        [1, 0, 2, 1, 1],
        [2, 0, 1, 0, 1],
        [1, 2, 0, 1, 2],
        [0, 0, 1, 2, 1],
        [2, 1, 1, 0, 0],
        [1, 1, 2, 2, 1],
        [0, 1, 2, 1, 0],
        [1, 1, 1, 1, 2],
        [0, 1, 0, 1, 0],
        [2, 1, 2, 1, 2],
        [1, 2, 1, 0, 1],
        [0, 0, 0, 1, 1],
        [1, 1, 1, 0, 0],
      ],
      winningLines: [],
      selectedPaylines: 1,
      betPerLine: 1,
      gameHistory: [],
      balance: 1000,
      isSpinning: [false, false, false, false, false],
      playerId: null, // Initially null
      inputPlayerName: '' // Variable to hold the input player name
    };
  },
  async created() {
    this.checkLogin();
    this.getUserBalance();
    this.initializeReels();
  },
  methods: {
    checkLogin() {
      setInterval(() => {
        const playerId = localStorage.getItem("playerId");
        this.playerId = playerId;
      }, 1000);
    },
    async getUserBalance() {
      try {
        const playerId = localStorage.getItem("playerId");
        const response = await axios.get('http://localhost:3000/api/user/' + playerId);
        this.balance = response.data?.balance || 1000;
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    },
    setPlayerId() {
      if (this.inputPlayerName.trim() === '') {
        alert("Please enter a valid name.");
        return;
      }
      this.playerId = this.inputPlayerName;
      this.inputPlayerName = '';
      localStorage.setItem("playerId", this.playerId);
    },
    initializeReels() {
      for (let i = 0; i < this.reels.length; i++) {
        this.reels[i] = [this.getRandomSymbol(), this.getRandomSymbol(), this.getRandomSymbol()];
      }
    },
    async spin() {
      this.winningLines = [];
      const totalBet = this.selectedPaylines * this.betPerLine;
      this.isSpinning.fill(true);
      this.balance -= totalBet;

      for (let i = 0; i < this.reels.length; i++) {
        await this.spinReel(i);
      }

      const winnings = this.calculateWinnings();
      this.balance += winnings;
      this.gameHistory.push({ totalBet, winnings });
      await this.recordSpin(totalBet, winnings);
    },
    async spinReel(reelIndex) {
      const spinDuration = 800 + reelIndex * 100;
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          this.reels[reelIndex] = this.reels[reelIndex].map(() => this.getRandomSymbol());
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          this.isSpinning[reelIndex] = false;
          this.snapToSymbol(reelIndex);
          resolve();
        }, spinDuration);
      });
    },
    getRandomSymbol() {
      const symbols = ['🍒', '🍋', '🍉', '⭐', '🍇'];
      return symbols[Math.floor(Math.random() * symbols.length)];
    },
    // calculateWinnings() {
    //   let winnings = 0;
    //   this.winningLines = []; // Reset winning lines for the next spin

    //   for (let i = 0; i < this.selectedPaylines; i++) {
    //     const payline = this.paylines[i];
    //     const symbolsOnPayline = payline.map((position, reelIndex) => this.reels[reelIndex][position]);
    //     console.log("-------symbols paylines");
    //     console.log(symbolsOnPayline);
    //     console.log(symbolsOnPayline[0]);

    //     // Check if all symbols on this payline are the same
    //     if (symbolsOnPayline.every(symbol => symbol === symbolsOnPayline[0])) {
    //       winnings += 10 * this.betPerLine; // Calculate winnings based on bet per line
    //       this.winningLines.push(payline); // Track winning lines
    //     }
    //   }
    //   return winnings;
    // },
    calculateWinnings() {
      let winnings = 0;
      this.winningLines = []; // Reset winning lines for the next spin

      for (let i = 0; i < this.selectedPaylines; i++) {
        const payline = this.paylines[i];
        const symbolsOnPayline = payline.map((position, reelIndex) => this.reels[reelIndex][position]);

        console.log("-------symbols paylines");
        console.log(symbolsOnPayline);
        console.log(symbolsOnPayline[0]);

        // Check for three consecutive symbols
        for (let j = 0; j <= symbolsOnPayline.length - 3; j++) {
          // Check if three consecutive symbols are the same
          console.log(symbolsOnPayline[j], symbolsOnPayline[j + 1], symbolsOnPayline[j + 2]);
          if (symbolsOnPayline[j] === symbolsOnPayline[j + 1] && symbolsOnPayline[j] === symbolsOnPayline[j + 2]) {
            winnings += 10 * this.betPerLine; // Calculate winnings based on bet per line
            this.winningLines.push(payline); // Track winning lines
            break; // Exit the loop once a win is found on this payline
          }
        }
      }
      return winnings;
    },
    isWinningSymbol(rowIndex, reelIndex) {
      // Check if the current symbol is part of any winning payline
      return this.winningLines.some(payline => payline[reelIndex] === rowIndex);
    },
    async recordSpin(totalBet, winnings) {
      try {
        await axios.post('http://localhost:3000/api/spin', {
          playerId: this.playerId,
          totalBet,
          winnings,
          userBalance: this.balance
        });
        // this.$refs.leaderBoardRef.fetchLeaderboard();
      } catch (error) {
        console.error("Error recording spin:", error);
      }
    },
    snapToSymbol(reelIndex) {
      const symbolHeight = 50; // Assume height of each symbol is 50px
      const offset = this.reels[reelIndex].length * symbolHeight;
      this.reels[reelIndex] = this.reels[reelIndex].slice(offset % this.reels[reelIndex].length);
    }
  }
};
</script>

<style scoped>
.slot-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
}

.player-name-input {
  margin: 20px;
}

.reels {
  display: flex;
}

.reel {
  display: flex;
  flex-direction: column;
  margin: 10px;
  overflow: hidden;
  height: 150px; /* Adjust as necessary */
}

.symbol {
  width: 50px;
  height: 50px;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.1s ease; /* Smooth transition for winning symbols */
}

.spinning .symbol {
  animation: spin 0.08s linear infinite; /* Faster continuous spin */
}

@keyframes spin {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

.winning-symbol {
  background-color: yellow; /* Highlight winning symbols */
  border: 2px solid green; /* Add border to highlight further */
}

.controls {
  margin: 20px;
}

.balance {
  margin: 20px;
}
</style>
