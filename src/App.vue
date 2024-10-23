<template>
  <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <router-link to="/" class="navbar-brand">Code Test</router-link>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" aria-current="page">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/leaderboard" class="nav-link">LeaderBoard</router-link>
          </li>
        </ul>

        <!-- Username and Dropdown for Logout -->
        <ul class="navbar-nav bg-primary ms-auto mb-2 mb-lg-0" v-if="playerId">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ playerId }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" style="color: black;" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Route Content Here -->
  <main>
    <router-view></router-view>
  </main>
</template>

<script>
// import SlotMachine from './components/SlotMachine.vue';

export default {
  name: 'App',
  data() {
    return {
      playerId: null
    };
  },
  components: {
    // SlotMachine
  },
  mounted() {
    this.checkLogin();
  },
  methods: {
    logout() {
      localStorage.removeItem("playerId");
      this.playerId = null;
    },
    checkLogin() {
      setInterval(() => {
        const playerId = localStorage.getItem("playerId");
        if (playerId) {
          this.playerId = playerId;
        }
      }, 1000);
    },
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
