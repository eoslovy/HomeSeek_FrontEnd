<template>
  <transition name="fade">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="header-left">
            <i class="bi bi-arrow-left" @click="$emit('close')"></i>
            <h3>부동산 비교</h3>
          </div>
        </div>
        <div class="modal-body">
          <div class="map-container">
            <div class="map-section">
              <div class="map-header">
                <h3>{{ leftApt.aptName }}</h3>
                <div class="facility-info">
                  <div class="facility-item" @click="toggleFacilityDetails('hospitals', 'left')">
                    <i class="bi bi-hospital"></i>
                    <span>병원 {{ leftFacilities.hospitals?.length || 0 }}개</span>
                  </div>
                  <div class="facility-item" @click="toggleFacilityDetails('markets', 'left')">
                    <i class="bi bi-shop"></i>
                    <span>마트 {{ leftFacilities.markets?.length || 0 }}개</span>
                  </div>
                  <div class="facility-item" @click="toggleFacilityDetails('subways', 'left')">
                    <i class="bi bi-train-front"></i>
                    <span>지하철 {{ leftFacilities.subways?.length || 0 }}개</span>
                  </div>
                  <div class="facility-item" @click="toggleFacilityDetails('schools', 'left')">
                    <i class="bi bi-book"></i>
                    <span>학교 {{ leftFacilities.schools?.length || 0 }}개</span>
                  </div>
                </div>
                <transition name="slide-down">
                  <div v-if="showLeftFacilityDetails" class="facility-details-overlay">
                    <div class="facility-details">
                      <div v-for="facility in leftSelectedFacilities" :key="facility.facility.id" class="facility-details-item" @click="highlightMarker(facility, 'left')" :class="{ 'active': facility.facility.id === activeMarkerId }">
                        <span>{{ facility.facility.name }}</span>
                        <span>{{ Math.round(facility.distance) }}m</span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              <div class="map-content">
                <div id="map1" ref="map1" class="map"></div>
                <transition name="slide">
                  <div v-if="showLeftModal" class="side-modal left-modal">
                    <div class="modal-header">
                      <span class="header-title">{{ leftApt.aptName }} 거래정보</span>
                    </div>
                    <div class="modal-content">
                      <div class="chart-container">
                        <Line v-if="leftChartData.datasets" :data="leftChartData" :options="chartOptions" />
                      </div>
                      <div class="price-history">
                        <div class="history-header">
                          <span>거래일</span>
                          <span>면적</span>
                          <span>가격</span>
                        </div>
                        <div v-for="deal in leftDeals" :key="deal.id" class="history-item">
                          <span>{{ formatDate(deal.dealYear, deal.dealMonth, deal.dealDay) }}</span>
                          <span>{{ deal.excluUseAr }}㎡</span>
                          <span>{{ formatPrice(deal.dealAmount) }}만원</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="map-section">
              <div class="map-header">
                <h3>{{ rightApt.aptName}}</h3>
                <div class="facility-info">
                  <div class="facility-item" @click="toggleFacilityDetails('hospitals', 'right')">
                    <i class="bi bi-hospital"></i>
                    <span>병원 {{ rightFacilities.hospitals?.length || 0 }}개</span>
                  </div>
                  <div class="facility-item" @click="toggleFacilityDetails('markets', 'right')">
                    <i class="bi bi-shop"></i>
                    <span>마트 {{ rightFacilities.markets?.length || 0 }}개</span>
                  </div>
                  <div class="facility-item" @click="toggleFacilityDetails('subways', 'right')">
                    <i class="bi bi-train-front"></i>
                    <span>지하철 {{ rightFacilities.subways?.length || 0 }}개</span>
                  </div>
                  <div class="facility-item" @click="toggleFacilityDetails('schools', 'right')">
                    <i class="bi bi-book"></i>
                    <span>학교 {{ rightFacilities.schools?.length || 0 }}개</span>
                  </div>
                </div>
                <transition name="slide-down">
                  <div v-if="showRightFacilityDetails" class="facility-details-overlay">
                    <div class="facility-details">
                      <div v-for="facility in rightSelectedFacilities" :key="facility.facility.id" class="facility-details-item" @click="highlightMarker(facility, 'right')" :class="{ 'active': facility.facility.id === activeMarkerId }">
                        <span>{{ facility.facility.name }}</span>
                        <span>{{ Math.round(facility.distance) }}m</span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              <div class="map-content">
                <div id="map2" ref="map2" class="map"></div>
                <transition name="slide">
                  <div v-if="showRightModal" class="side-modal right-modal">
                    <div class="modal-header">
                      <span class="header-title">{{ rightApt.aptName }} 거래정보</span>
                    </div>
                    <div class="modal-content">
                      <div class="chart-container">
                        <Line v-if="rightChartData.datasets" :data="rightChartData" :options="chartOptions" />
                      </div>
                      <div class="price-history">
                        <div class="history-header">
                          <span>거래일</span>
                          <span>면적</span>
                          <span>가격</span>
                        </div>
                        <div v-for="deal in rightDeals" :key="deal.id" class="history-item">
                          <span>{{ formatDate(deal.dealYear, deal.dealMonth, deal.dealDay) }}</span>
                          <span>{{ deal.excluUseAr }}㎡</span>
                          <span>{{ formatPrice(deal.dealAmount) }}만원</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Line } from 'vue-chartjs';
import axios from 'axios';
import { showFacilityInfo, createMarkerImage } from '@/utils/mapUtils';

export default {
  name: "AnalysisView",
  components: {
    Line
  },
  mounted() {
    // 카카오맵 초기화
    if (window.kakao && window.kakao.maps) {
      this.initializeMaps();
    }
  },
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
      showLeftModal: false,
      showRightModal: false,
      leftApt: {},
      rightApt: {},
      leftDeals: [],
      rightDeals: [],
      leftChartData: {},
      rightChartData: {},
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      leftFacilities: {},
      rightFacilities: {},
      leftMarkers: [],
      rightMarkers: [],
      showLeftFacilityDetails: false,
      showRightFacilityDetails: false,
      leftSelectedFacilities: [],
      rightSelectedFacilities: [],
      leftSelectedFacilityType: null,
      rightSelectedFacilityType: null,
      leftFacilityTimer: null,
      rightFacilityTimer: null,
      hoveredInfowindow: null,
      activeMarkerId: null,
      markerAnimations: {},
    };
  },
  methods: {
    initializeMaps() {
      const mapOption = {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 3
      };

      this.map1 = new kakao.maps.Map(this.$refs.map1, mapOption);
      this.map2 = new kakao.maps.Map(this.$refs.map2, mapOption);
    },
    async showApartment(mapNum, apt) {
      // 맵이 초기화되지 않았다면 초기화
      if (!this.map1 || !this.map2) {
        this.initializeMaps();
      }

      const map = mapNum === 1 ? this.map1 : this.map2;
      const position = new kakao.maps.LatLng(apt.latitude, apt.longitude);
      
      // 기존 마커들 제거
      if (mapNum === 1) {
        this.leftMarkers.forEach(marker => marker.setMap(null));
        this.leftMarkers = [];
      } else {
        this.rightMarkers.forEach(marker => marker.setMap(null));
        this.rightMarkers = [];
      }

      const marker = new kakao.maps.Marker({
        position: position,
        map: map,
        image: new kakao.maps.MarkerImage('/images/home.svg', new kakao.maps.Size(36, 36))
      });

      const circle = new kakao.maps.Circle({
        center: position,  // 원의 중심 좌표
        radius: 1000,     // 1km를 미터 단위로
        strokeWeight: 2,   // 선의 두께
        strokeColor: '#0a362f',  // 선의 색깔
        strokeOpacity: 0.8,  // 선의 불투명도
        strokeStyle: 'solid', // 의 스타일
        fillColor: '#0a362f',  // 채우기 색깔
        fillOpacity: 0.1  // 채우기 불투명도
      });
      
      circle.setMap(map);  // 지도에 원 표시

      // 시설물 마커 생 함수
      const createFacilityMarkers = (facilities) => {
        const markers = [];
        
        // 기존 인포윈도우 닫기
        if (this.hoveredInfowindow) {
          this.hoveredInfowindow.close();
          this.hoveredInfowindow = null;
        }

        facilities.hospitals?.forEach(hospitalData => {
          const position = new kakao.maps.LatLng(
            hospitalData.facility.latitude, 
            hospitalData.facility.longitude
          );
          
          const marker = new kakao.maps.Marker({
            position: position,
            map: map,
            image: createMarkerImage('hospital')
          });

          const infowindow = new kakao.maps.InfoWindow({
            content: showFacilityInfo(hospitalData.facility, 'hospital'),
            removable: false,
            zIndex: 1
          });

          // 마커와 정보창을 함께 저장
          markers.push({
            id: hospitalData.facility.id,
            marker: marker,
            infowindow: infowindow
          });

          // 마우스오버 이벤트
          kakao.maps.event.addListener(marker, 'mouseover', () => {
            if (this.hoveredInfowindow) {
              this.hoveredInfowindow.close();
            }
            infowindow.open(map, marker);
            this.hoveredInfowindow = infowindow;
          });
          
          kakao.maps.event.addListener(marker, 'mouseout', () => {
            if (this.hoveredInfowindow === infowindow && !this.markerAnimations[hospitalData.facility.id]) {
              infowindow.close();
              this.hoveredInfowindow = null;
            }
          });
        });

        // 마트 마커
        facilities.markets?.forEach(marketData => {
          const position = new kakao.maps.LatLng(
            marketData.facility.latitude, 
            marketData.facility.longitude
          );
          
          const marker = new kakao.maps.Marker({
            position: position,
            map: map,
            image: createMarkerImage('market')
          });

          const infowindow = new kakao.maps.InfoWindow({
            content: showFacilityInfo(marketData.facility, 'market'),
            removable: false,
            zIndex: 1
          });

          // 마커와 정보창을 함께 저장
          markers.push({
            id: marketData.facility.id,
            marker: marker,
            infowindow: infowindow
          });

          kakao.maps.event.addListener(marker, 'mouseover', () => {
            if (this.hoveredInfowindow) {
              this.hoveredInfowindow.close();
            }
            infowindow.open(map, marker);
            this.hoveredInfowindow = infowindow;
          });
          
          kakao.maps.event.addListener(marker, 'mouseout', () => {
            if (this.hoveredInfowindow === infowindow && !this.markerAnimations[marketData.facility.id]) {
              infowindow.close();
              this.hoveredInfowindow = null;
            }
          });
        });

        // 지하철 마커
        facilities.subways?.forEach(subwayData => {
          const position = new kakao.maps.LatLng(
            subwayData.facility.latitude, 
            subwayData.facility.longitude
          );
          
          const marker = new kakao.maps.Marker({
            position: position,
            map: map,
            image: createMarkerImage('subway')
          });

          const infowindow = new kakao.maps.InfoWindow({
            content: showFacilityInfo(subwayData.facility, 'subway'),
            removable: false,
            zIndex: 1
          });

          // 마커와 정보창을 함께 저장
          markers.push({
            id: subwayData.facility.id,
            marker: marker,
            infowindow: infowindow
          });

          kakao.maps.event.addListener(marker, 'mouseover', () => {
            if (this.hoveredInfowindow) {
              this.hoveredInfowindow.close();
            }
            infowindow.open(map, marker);
            this.hoveredInfowindow = infowindow;
          });
          
          kakao.maps.event.addListener(marker, 'mouseout', () => {
            if (this.hoveredInfowindow === infowindow && !this.markerAnimations[subwayData.facility.id]) {
              infowindow.close();
              this.hoveredInfowindow = null;
            }
          });
        });

        // 학교 마커
        facilities.schools?.forEach(schoolData => {
          const position = new kakao.maps.LatLng(
            schoolData.facility.latitude, 
            schoolData.facility.longitude
          );
          
          const marker = new kakao.maps.Marker({
            position: position,
            map: map,
            image: createMarkerImage('school')
          });

          const infowindow = new kakao.maps.InfoWindow({
            content: showFacilityInfo(schoolData.facility, 'school'),
            removable: false,
            zIndex: 1
          });

          // 마커와 정보창을 함께 저장
          markers.push({
            id: schoolData.facility.id,
            marker: marker,
            infowindow: infowindow
          });

          kakao.maps.event.addListener(marker, 'mouseover', () => {
            if (this.hoveredInfowindow) {
              this.hoveredInfowindow.close();
            }
            infowindow.open(map, marker);
            this.hoveredInfowindow = infowindow;
          });
          
          kakao.maps.event.addListener(marker, 'mouseout', () => {
            if (this.hoveredInfowindow === infowindow && !this.markerAnimations[schoolData.facility.id]) {
              infowindow.close();
              this.hoveredInfowindow = null;
            }
          });
        });

        return markers;
      };

      // 시설물 정보를 가져온 후 마커 생성
      if (mapNum === 1) {
        this.leftApt = {
          aptName: apt.aptName  // 아파트 이름 설정
        };
        this.showLeftModal = true;
        this.fetchDeals(apt, 'left');
        await this.fetchFacilities(apt, 'left');
        this.leftMarkers = createFacilityMarkers(this.leftFacilities);
      } else {
        this.rightApt = {
          aptName: apt.aptName  // 아파트 이름 설정
        };
        this.showRightModal = true;
        this.fetchDeals(apt, 'right');
        await this.fetchFacilities(apt, 'right');
        this.rightMarkers = createFacilityMarkers(this.rightFacilities);
      }

      map.setCenter(position);
      map.setLevel(5);  // 줌 레벨을 조금 더 넓게 설정
    },

    async fetchDeals(apt, side) {
      try {
        const houseInfo = {
          aptSeq: apt.aptSeq,
          aptName: apt.aptName,
          si: apt.sidoName,
          gu: apt.gugunName
        };

        const response = await axios.post('/deals/search', {
          aptName: houseInfo.aptName,
          si: houseInfo.si,
          gu: houseInfo.gu
        });

        if (side === 'left') {
          this.leftDeals = response.data;
          this.updateChartData(response.data, 'left');
        } else {
          this.rightDeals = response.data;
          this.updateChartData(response.data, 'right');
        }
      } catch (error) {
        console.error('거래 데이터 조회 실패:', error);
      }
    },

    updateChartData(deals, side) {
      const sortedDeals = [...deals].sort((a, b) => {
        const dateA = new Date(a.dealYear, a.dealMonth - 1, a.dealDay);
        const dateB = new Date(b.dealYear, b.dealMonth - 1, b.dealDay);
        return dateA - dateB;
      });

      const chartData = {
        labels: sortedDeals.map(deal => 
          `${deal.dealYear}.${String(deal.dealMonth).padStart(2, '0')}`
        ),
        datasets: [{
          label: '거래가격',
          data: sortedDeals.map(deal => deal.dealAmount),
          borderColor: '#0a362f',
          tension: 0.1
        }]
      };
      
      if (side === 'left') {
        this.leftChartData = chartData;
      } else {
        this.rightChartData = chartData;
      }
    },

    formatDate(year, month, day) {
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    },

    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    async fetchFacilities(apt, side) {
      try {
        const response = await axios.get('/map/getNearbyFacilities', {
          params: {
            aptName: apt.aptName
          }
        });
        
        if (side === 'left') {
          this.leftFacilities = response.data;
        } else {
          this.rightFacilities = response.data;
        }
      } catch (error) {
        console.error('시설 정보 조회 실패:', error);
      }
    },

    toggleFacilityDetails(facilityType, side) {
      const facilities = side === 'left' ? this.leftFacilities : this.rightFacilities;
      
      // 타이머 초기화
      if (side === 'left') {
        clearTimeout(this.leftFacilityTimer);
      } else {
        clearTimeout(this.rightFacilityTimer);
      }
      
      if (side === 'left') {
        if (this.leftSelectedFacilityType === facilityType && this.showLeftFacilityDetails) {
          this.showLeftFacilityDetails = false;
          this.leftSelectedFacilityType = null;
        } else {
          this.leftSelectedFacilities = facilities[facilityType] || [];
          this.showLeftFacilityDetails = true;
          this.leftSelectedFacilityType = facilityType;
          
          // 5초 후 자동으로 닫힘
          this.leftFacilityTimer = setTimeout(() => {
            this.showLeftFacilityDetails = false;
            this.leftSelectedFacilityType = null;
          }, 5000);
        }
      } else {
        if (this.rightSelectedFacilityType === facilityType && this.showRightFacilityDetails) {
          this.showRightFacilityDetails = false;
          this.rightSelectedFacilityType = null;
        } else {
          this.rightSelectedFacilities = facilities[facilityType] || [];
          this.showRightFacilityDetails = true;
          this.rightSelectedFacilityType = facilityType;
          
          // 5초 후 자동으로 닫힘
          this.rightFacilityTimer = setTimeout(() => {
            this.showRightFacilityDetails = false;
            this.rightSelectedFacilityType = null;
          }, 5000);
        }
      }
    },

    highlightMarker(facility, side) {
      const markers = side === 'left' ? this.leftMarkers : this.rightMarkers;
      const facilityId = facility.facility.id;
      const map = side === 'left' ? this.map1 : this.map2;
      
      // 리스트 닫기
      if (side === 'left') {
        this.showLeftFacilityDetails = false;
        this.leftSelectedFacilityType = null;
        clearTimeout(this.leftFacilityTimer);  // 기존 타이머 제거
      } else {
        this.showRightFacilityDetails = false;
        this.rightSelectedFacilityType = null;
        clearTimeout(this.rightFacilityTimer);  // 기존 타이머 제거
      }
      
      // 이전 활성화된 마커의 애니메이션 중지
      if (this.activeMarkerId && this.markerAnimations[this.activeMarkerId]) {
        clearInterval(this.markerAnimations[this.activeMarkerId]);
        delete this.markerAnimations[this.activeMarkerId];
      }

      // 기존 열린 인포윈도우 닫기
      if (this.hoveredInfowindow) {
        this.hoveredInfowindow.close();
        this.hoveredInfowindow = null;
      }

      const targetMarkerInfo = markers.find(markerInfo => 
        markerInfo.id === facilityId
      );

      if (targetMarkerInfo) {
        this.activeMarkerId = facilityId;
        const { marker, infowindow } = targetMarkerInfo;

        // 정보창 표시
        infowindow.open(map, marker);
        this.hoveredInfowindow = infowindow;
        
        // 마커 깜빡임 효과
        let isVisible = true;
        this.markerAnimations[facilityId] = setInterval(() => {
          marker.setVisible(isVisible);
          isVisible = !isVisible;
        }, 500);

        // 3초 후 애니메이션과 정보창 중지
        setTimeout(() => {
          if (this.markerAnimations[facilityId]) {
            clearInterval(this.markerAnimations[facilityId]);
            delete this.markerAnimations[facilityId];
            marker.setVisible(true);
            this.activeMarkerId = null;
            
            if (this.hoveredInfowindow) {
              this.hoveredInfowindow.close();
              this.hoveredInfowindow = null;
            }
          }
        }, 3000);
      }
    },

    // 시설물 타입 판별 함수 추가
    getFacilityType(facility) {
      if (this.leftSelectedFacilityType || this.rightSelectedFacilityType) {
        return this.leftSelectedFacilityType || this.rightSelectedFacilityType;
      }
      // 기본값으로 시설물 타입 반환
      return 'hospital'; // 또는 적절한 타입 판별 로직 추가
    },
  },

  // 컴포넌트가 제거될 때 타이머 정리
  beforeDestroy() {
    clearTimeout(this.leftFacilityTimer);
    clearTimeout(this.rightFacilityTimer);
    
    // 열려있는 인포윈도우 정리
    if (this.hoveredInfowindow) {
      this.hoveredInfowindow.close();
      this.hoveredInfowindow = null;
    }
    
    // 마커들 제거
    this.leftMarkers.forEach(marker => marker.setMap(null));
    this.rightMarkers.forEach(marker => marker.setMap(null));
    
    Object.values(this.markerAnimations).forEach(animation => {
      clearInterval(animation);
    });
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
  background: white;
  width: 98vw;
  height: 90vh;
  margin: 0;
  border-radius: 15px;
  border: none;
  z-index: 10000;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px;
  border-bottom: none;
  background: #0a362f;
  border-radius: 15px 15px 0 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left i {
  color: #fff;
  cursor: pointer;
  font-size: 1.2rem;
}

.header-left h3 {
  color: #fff;
  margin: 0;
  font-size: 1.2rem;
}

.modal-body {
  flex: 1;
  overflow: hidden;
  padding: 15px;
  background: white;
  border-radius: 0 0 15px 15px;
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
  position: relative;
}

.map-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 700;
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

.map-content {
  position: relative;
  flex: 1;
  display: flex;
}

.side-modal {
  position: absolute;
  top: 0;
  width: 300px;
  height: 100%;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1;
  display: none;
}

.modal-header {
  padding: 15px;
  border-bottom: none;
  background: #0a362f;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.chart-container {
  height: 200px;
  padding: 15px;
}

.price-history {
  padding: 15px;
}

.history-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-weight: 600;
  color: #333;
}

.history-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  color: #666;
}

.facility-info {
  display: flex;
  gap: 15px;
  margin-top: 8px;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.facility-item:hover {
  background-color: rgba(10, 54, 47, 0.1);
}

.facility-item i {
  font-size: 16px;
  color: #0a362f;
}

.facility-details-overlay {
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.facility-details {
  padding: 10px;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.facility-details-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  text-decoration: none;
  color: inherit;
}

.facility-details-item:hover {
  background-color: rgba(10, 54, 47, 0.1);
}

.facility-details-item.active {
  background-color: rgba(10, 54, 47, 0.15);
  font-weight: 600;
}

/* 클릭 효과 */
.facility-details-item:active {
  transform: scale(0.98);
  background-color: rgba(10, 54, 47, 0.2);
}

/* 애니메이션 효과 */
@keyframes highlight {
  0% { background-color: rgba(10, 54, 47, 0.1); }
  50% { background-color: rgba(10, 54, 47, 0.2); }
  100% { background-color: rgba(10, 54, 47, 0.1); }
}

.facility-details-item.active {
  animation: highlight 1s infinite;
}
</style>
