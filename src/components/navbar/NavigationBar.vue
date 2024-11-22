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
    <div class="nav-item" @click="toggleLoan">
      <i class="bi bi-bank"></i>
      <span>대출</span>
    </div>
    <div class="nav-item" @click="toggleAnalysis">
      <i class="bi bi-graph-up"></i>
      <span>비교</span>
    </div>

    <LoanView 
      :show="showLoan" 
      @close="closeLoan"
    />
    <AnalysisView 
      :show="showAnalysis" 
      @close="closeAnalysis"
    />
  </div>
</template>

<script>
import LoanView from './LoanView.vue';
import AnalysisView from './AnalysisView.vue';

export default {
  name: "NavigationBar",
  components: {
    LoanView,
    AnalysisView
  },
  data() {
    return {
      showLoan: false,
      showAnalysis: false
    }
  },
  methods: {
    toggleLoan() {
      this.showLoan = true;
    },
    closeLoan() {
      this.showLoan = false;
    },
    toggleAnalysis() {
      this.showAnalysis = true;
    },
    closeAnalysis() {
      this.showAnalysis = false;
    }
  }
};
</script>

<style scoped>
.navigation-bar {
  display: flex;
  justify-content: flex-start;
  padding: 12px 15px;
  background-color: white;
  border-radius: 8px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px 12px;
  margin-right: 25px;
  border-radius: 4px;
  width: 70px;
  height: 55px;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.nav-item:last-child {
  margin-right: 0;
}

.nav-item:hover {
  background-color: #f8f9fa;
  color: #42b983;
}

.nav-item i {
  font-size: 1.15em;
  margin-bottom: 4px;
  line-height: 1;
  pointer-events: none;
}

.nav-item span {
  font-size: 0.85em;
  font-weight: 500;
  line-height: 1;
  pointer-events: none;
}
</style>
