<template>
  <transition name="fade">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="header-left">
            <i class="bi bi-arrow-left" @click="$emit('close')"></i>
            <h3>지역 비교 분석</h3>
          </div>
        </div>
        <div class="modal-body">
          <div class="map-container">
            <div class="map-section">
              <div class="map-header">
                <h3>강남구</h3>
              </div>
              <div id="map1" ref="map1" class="map"></div>
            </div>
            <div class="map-section">
              <div class="map-header">
                <h3>송파구</h3>
              </div>
              <div id="map2" ref="map2" class="map"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AnalysisView",
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      map1: null,
      map2: null,
    };
  },
  watch: {
    show: {
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.initializeKakaoMaps();
            }, 100);
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    initializeKakaoMaps() {
      if (!window.kakao || !window.kakao.maps) {
        console.error('Kakao maps SDK not loaded');
        return;
      }

      try {
        const mapContainer1 = this.$refs.map1;
        const mapContainer2 = this.$refs.map2;

        if (!mapContainer1 || !mapContainer2) {
          console.error('Map containers not found');
          return;
        }

        const mapOption1 = {
          center: new kakao.maps.LatLng(37.4959854, 127.0664091),
          level: 5,
        };
        const mapOption2 = {
          center: new kakao.maps.LatLng(37.5145937, 127.1059186),
          level: 5,
        };

        this.map1 = new kakao.maps.Map(mapContainer1, mapOption1);
        this.map2 = new kakao.maps.Map(mapContainer2, mapOption2);

        window.dispatchEvent(new Event('resize'));
        
        setTimeout(() => {
          this.map1.relayout();
          this.map2.relayout();
        }, 50);

      } catch (error) {
        console.error('Error initializing maps:', error);
      }
    }
  },
  unmounted() {
    this.map1 = null;
    this.map2 = null;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 70px;
  z-index: 9999;
}

.modal-content {
  background: rgba(33, 37, 41, 0.95);
  width: 98vw;
  height: 90vh;
  margin: 0;
  border-radius: 8px;
  border: 1px solid #D4AF37;
  z-index: 10000;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #D4AF37;
  background: #0a362f;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left i {
  color: #D4AF37;
  cursor: pointer;
  font-size: 1.2rem;
}

.header-left h3 {
  color: #D4AF37;
  margin: 0;
  font-size: 1.2rem;
}

.modal-body {
  flex: 1;
  overflow: hidden;
  padding: 15px;
}

.map-container {
  display: flex;
  gap: 15px;
  height: 100%;
}

.map-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-header {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}

.map-header h3 {
  margin: 0;
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
}

.stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  font-size: 14px;
  color: #666;
}

.map {
  flex: 1;
  width: 100%;
  height: 100%;
  border-radius: 0 0 8px 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
