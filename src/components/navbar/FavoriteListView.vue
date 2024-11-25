<template>
  <div class="favorite-view">
    <div class="favorite-header">
      <div class="header-content">
        <span class="back-icon" @click="$emit('close')">←</span>
        <span class="header-title">관심 목록</span>
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
          <button class="delete-btn" @click.stop="deleteFavorite(house)">
            <i class="bi bi-trash"></i>
          </button>
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
      isLoading: false
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
        
        // 삭제 후 목록 새로고침
        await this.fetchUserFavoriteList();
        
        // 성공 메시지
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
  width: 450px;
  height: calc(100vh - 70px);
  background: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.favorite-header {
  position: sticky;
  top: 0;
  background: #0a362f;
  color: white;
  padding: 15px;
  height: 56px;
  display: flex;
  align-items: center;
  z-index: 1001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-icon {
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  color: rgba(255, 255, 255, 0.9);
  transition: color 0.2s ease;
}

.back-icon:hover {
  color: white;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.95);
}

.favorite-content {
  height: calc(100vh - 126px);
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
</style>
