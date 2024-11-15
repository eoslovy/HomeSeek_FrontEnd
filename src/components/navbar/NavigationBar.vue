<template>
  <div class="navigation-bar">
    <div class="nav-item" @click="$emit('nav-change', 'news')">
      <i class="bi bi-newspaper"></i>
      <span>뉴스</span>
    </div>
    <div class="nav-item" @click="$emit('nav-change', 'policy')">
      <i class="bi bi-file-text"></i>
      <span>정책</span>
    </div>
    <div class="nav-item" @click="$emit('nav-change', 'loan')">
      <i class="bi bi-bank"></i>
      <span>대출</span>
    </div>
    <div class="nav-item" @click="$emit('nav-change', 'analysis')">
      <i class="bi bi-graph-up"></i>
      <span>비교분석</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavigationBar",
  methods: {
    navigateTo(route) {
      this.$router.push(`/${route}`);
    },
  },
};
</script>

<style scoped>
.navigation-bar {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: white;
  border-radius: 8px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: #f8f9fa;
  color: #42b983;
}

.nav-item i {
  font-size: 1.2em;
  margin-bottom: 4px;
}

.nav-item span {
  font-size: 0.9em;
  font-weight: 500;
}
</style>
