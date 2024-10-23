<template>
  <div class="leaderboard">
    <h3>Leaderboard</h3>
    <table class="table-secondary">
      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Player ID</th>
          <th scope="col">Total Winnings</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in leaderboard" :key="player.player_id">
          <td scope="row">{{ index + 1 }}</td>
          <td>{{ player.player_id }}</td>
          <td>{{ player.total_winnings }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      leaderboard: []
    };
  },
  created() {
    this.fetchLeaderboard();
  },
  methods: {
    async fetchLeaderboard() {
      try {
        const response = await axios.get('http://localhost:3000/api/leaderboard');
        this.leaderboard = response.data;
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    }
  }
};
</script>

<style scoped>
.leaderboard {
  margin-top: 50px;
}
table {
  width: 95%;
  border-collapse: collapse;
  margin: 20px 20px 20px 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>