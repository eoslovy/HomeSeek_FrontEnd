<template>
  <div class="favorite-view">
    <div class="favorite-header">
      <div class="header-content">
        <span class="back-icon" @click="$emit('close')">←</span>
        <span class="header-title">{{ currentUser.nickname }}님의 관심 목록</span>
        <button class="compare-btn" @click="toggleCompareMode">
          {{ isCompareMode ? '비교 시작' : '비교하기' }}
        </button>
      </div>
    </div>
    <div class="favorite-content">
      <div class="favorite-list">
        <div
          v-for="house in favoriteList"
          :key="house.aptSeq"
          class="house-item"
        >
          <div class="item-content" @click="handleHouseClick(house)">
            <div class="house-main-info">
              <h3 class="house-name">{{ house.aptName }}</h3>
            </div>
            <div class="house-address">
              {{ getAddress(house) }}
            </div>
            <div class="house-sub-info">
              <span>{{ house.buildYear }}년 건축</span>
            </div>
          </div>
          <div class="action-buttons">
            <button 
              v-if="isCompareMode"
              class="select-btn"
              :class="{ 'selected': selectedHouses.includes(house) }"
              @click.stop="toggleHouseSelection(house)"
            >
              <i class="bi" :class="selectedHouses.includes(house) ? 'bi-check-circle-fill' : 'bi-circle'"></i>
            </button>
            <button class="delete-btn" @click.stop="deleteFavorite(house)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import Swal from 'sweetalert2';

export default {
  name: "FavoriteListView",
  computed: {
    ...mapState({
      currentUser: state => state.auth.user,
      isLoggedIn: state => state.auth.isLoggedIn
    })
  },
  data() {
    return {
      favoriteList: [],
      isLoading: false,
      isCompareMode: false,
      selectedHouses: []
    };
  },
  methods: {
    async fetchUserFavoriteList() {
      if (!this.isLoggedIn) {
        console.error('로그인이 필요합니다');
        return;
      }

      try {
        this.isLoading = true;
        const response = await axios.get('/users/getFavoriteList', {
          params: {
            userId: this.currentUser.id
          }
        });
        this.favoriteList = response.data;
      } catch (error) {
        console.error('관심 목록 로딩 중 오류 발생:', error);
        this.favoriteList = [];
      } finally {
        this.isLoading = false;
      }
    },
    handleHouseClick(house) {
      this.$emit('view-house', {
        lat: house.latitude,
        lng: house.longitude,
        title: house.aptName,
      });

      const dealInfo = {
        aptSeq: house.aptSeq,
        aptName: house.aptName,
        si: house.sidoName,
        gu: house.gugunName
      };
      
      this.$emit('select-house', dealInfo);
    },
    getAddress(house) {
      return `${house.sidoName} ${house.gugunName} ${house.dongName}`;
    },
    async deleteFavorite(house) {
      try {
        await axios.delete('/users/deleteFavorite', {
          data: {
            userId: this.currentUser.id,
            aptSeq: house.aptSeq
          }
        });
        
        await this.fetchUserFavoriteList();
        
        this.$emit('favorite-deleted', house.aptSeq);
        
        Swal.fire({
          icon: 'success',
          title: '관심 목록에서 제거되었습니다',
          showConfirmButton: false,
          timer: 1500,
          position: 'top-end',
          toast: true
        });
      } catch (error) {
        console.error('관심 목록 삭제 실패:', error);
        Swal.fire({
          icon: 'error',
          title: '처리 실패',
          text: '관심 목록 처리 중 오류가 발생했습니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#dc3545'
        });
      }
    },
    toggleCompareMode() {
      if (this.isCompareMode && this.selectedHouses.length === 2) {
        this.$emit('compare-houses', this.selectedHouses);
        this.isCompareMode = false;
        this.selectedHouses = [];
      } else {
        this.isCompareMode = !this.isCompareMode;
        this.selectedHouses = [];
      }
    },
    toggleHouseSelection(house) {
      if (this.selectedHouses.includes(house)) {
        this.selectedHouses = this.selectedHouses.filter(h => h !== house);
      } else {
        if (this.selectedHouses.length >= 2) {
          Swal.fire({
            icon: 'warning',
            title: '최대 2개까지만 선택 가능합니다',
            showConfirmButton: false,
            timer: 1500,
            position: 'top-end',
            toast: true
          });
          return;
        }
        this.selectedHouses.push(house);
      }
    }
  },
  created() {
    this.fetchUserFavoriteList();
  }
};
</script>

<style scoped>
.favorite-view {
  position: absolute;
  top: 70px;
  left: 0;
  width: 400px;
  height: calc(100vh - 70px);
  background: white;
  z-index: 999;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.favorite-header {
  background: #0a362f;
  padding: 16px;
  height: 60px;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 15px;
}

.back-icon {
  font-size: 20px;
  cursor: pointer;
  color: white;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.compare-btn {
  margin-left: auto;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.compare-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.favorite-content {
  height: calc(100vh - 196px);
  overflow-y: auto;
  padding: 16px;
}

.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.house-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.item-content {
  flex: 1;
  padding: 16px;
  cursor: pointer;
}

.item-content:hover {
  background-color: #f8f9fa;
}

.delete-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.bi-trash {
  pointer-events: none;
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

.house-address {
  color: #666;
  margin-bottom: 8px;
}

.house-sub-info {
  font-size: 14px;
  color: #888;
}

.action-buttons {
  display: flex;
  gap: 8px;
  padding-right: 8px;
}

.select-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.select-btn:hover {
  opacity: 1;
}

.select-btn.selected {
  color: #0a362f;
  opacity: 1;
}
</style>
