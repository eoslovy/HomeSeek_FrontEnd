<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>부동산 규제 정책</h3>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <div v-if="!policies.length" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">최신 정보를 가져오는 중...</p>
        </div>
        <div v-else>
          <div v-for="(group, index) in policies" :key="index" class="policy-section">
            <h3 class="main-title">{{ group.mainTitle }}</h3>
            <div class="sub-groups-grid">
              <div v-for="(subGroup, subIndex) in group.subGroups" 
                   :key="`${index}-${subIndex}`" 
                   class="sub-group">
                <h4 class="sub-title"
                    :class="{ 
                      'warning-header': subGroup.title === '투기지역, 투기과열지구' || subGroup.title === '투기지역, 투기과열지구, 조정대상지역',
                      'toogi-only-header': subGroup.title === '투기지역',
                      'joejung-header': subGroup.title === '조정대상지역',
                      'gwayeol-header': subGroup.title === '투기과열지구',
                      'default-header': ['비규제 지역', '수도권', '비수도권'].includes(subGroup.title)
                    }">
                  <img v-if="subGroup.title === '투기지역, 투기과열지구' || subGroup.title === '투기지역' || subGroup.title === '투기과열지구' || subGroup.title === '투기지역, 투기과열지구, 조정대상지역'" 
                       src="/images/toogi.svg"
                       alt="toogi" 
                       class="policy-icon">
                  <img v-if="subGroup.title === '조정대상지역'" 
                       src="/images/joejung.svg"
                       alt="joejung" 
                       class="policy-icon">
                  {{ subGroup.title }}
                </h4>
                <div v-for="(policy, policyIndex) in subGroup.policies" 
                     :key="`${index}-${subIndex}-${policyIndex}`" 
                     class="policy-item">
                  <div class="policy-header">
                    <h5 class="policy-title">{{ policy.title }}</h5>
                  </div>
                  <div v-if="policy.details.length > 0" class="policy-details">
                    <p v-for="(detail, detailIndex) in policy.details" 
                       :key="`detail-${detailIndex}`"
                       style="white-space: pre-line">
                      {{ detail }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PolicyModal',
  props: {
    policies: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 7.5vh;
  z-index: 1100;
}

.modal-content {
  background: white;
  width: 95%;
  max-width: 1400px;
  max-height: 90vh;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px;
  background: #0a362f;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(90vh - 60px);
}

.policy-section {
  margin-bottom: 40px;
}

.main-title {
  color: #0a362f;
  border-bottom: 2px solid #0a362f;
  padding-bottom: 8px;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.sub-groups-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 0 20px;
}

.sub-group {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.sub-title {
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.policy-item {
  margin: 15px 0;
  padding: 15px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.policy-title {
  color: #0a362f;
  margin-bottom: 10px;
  font-weight: 600;
}

.policy-details {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.policy-item.type1 {
  background: linear-gradient(to right, #f03e3e, #fd7e14);
  color: white;
}

.policy-item.type1 .policy-title,
.policy-item.type1 .policy-details {
  color: white;
}

.policy-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.policy-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 18px;
}

.warning-header {
  background: linear-gradient(to right, #f03e3e, #fd7e14);
  color: white !important;
  padding: 8px;
  border-radius: 4px;
}

.warning-header .policy-title {
  color: white !important;
}

.policy-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.joejung-header {
  background-color: #ffca28;
  color: #000 !important;
  padding: 8px;
  border-radius: 4px;
}

.toogi-only-header {
  background-color: #f03e3e;
  color: white !important;
  padding: 8px;
  border-radius: 4px;
}

.gwayeol-header {
  background: #fd7e14;
  color: white !important;
  padding: 8px;
  border-radius: 4px;
}

.default-header {
  background-color: #69696f;
  color: white !important;
  padding: 8px;
  border-radius: 4px;
}

@media (max-width: 1024px) {
  .sub-groups-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 0 10px;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0a362f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #0a362f;
  font-size: 1.1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 