<template>
  <div class="house-list">
    <div v-if="showBuyTable" class="list-container">
      <div
        v-for="house in houses"
        :key="house.aptName"
        class="house-item"
        @click="
          $emit('view-house', {
            lat: house.latitude,
            lng: house.longitude,
            title: house.aptName,
          })
        "
      >
        <div class="house-main-info">
          <h3 class="house-name">
            <span v-html="highlightSearchKeyword(house.aptName)"></span>
          </h3>
        </div>
        <div class="house-address">
          <span v-html="highlightSearchKeyword(getAddress(house))"></span>
        </div>
        <div class="house-sub-info">
          <span>{{ house.buildYear }}년 건축</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HouseList",
  props: {
    houses: Array,
    showBuyTable: Boolean,
    showRentTable: Boolean,
    searchKeyword: {
      type: String,
      default: ""
    }
  },
  methods: {
    getAddress(house) {
      return `${house.sidoName} ${house.gugunName} ${house.dongName}`;
    },
    highlightSearchKeyword(text) {
      if (!this.searchKeyword || !text) return text;
      const escapedKeyword = this.searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedKeyword})`, 'gi');
      return text.replace(regex, '<span class="highlight">$1</span>');
    }
  }
};
</script>

<style scoped>
.house-list {
  padding: 16px;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.house-item {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.house-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.house-main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.house-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.price {
  font-size: 18px;
  font-weight: 600;
  color: #0a362f;
}

.house-address {
  color: #666;
  margin-bottom: 8px;
}

.house-sub-info {
  font-size: 14px;
  color: #888;
}

.divider {
  margin: 0 8px;
}

:deep(.highlight) {
  background-color: #fff3bf;
  padding: 2px 0;
  border-radius: 2px;
}
</style>