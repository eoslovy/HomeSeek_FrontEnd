<template>
  <div class="map-container">
    <div id="map"></div>
  </div>
</template>

<script>
import axios from 'axios';
import { showFacilityInfo, createMarkerImage } from '@/utils/mapUtils';

// 전역 변수로 선언
let map = null;
let markers = [];
let selectedMarker = null;
let selectedInfowindow = null;
let clusterer = null;
let hoveredInfowindow = null;
let circle500m = null;  // 500m 반경 원
let circle1km = null;   // 1km 반경 원

export default {
  data() {
    return {
      map: null  // 컴포넌트 내부 상태로도 저장
    }
  },
  mounted() {
    if (window?.kakaoMapsLoaded) {
      this.initMap();
    } else {
      window.addEventListener("kakao-maps-sdk-loaded", this.initMap, {
        once: true,
      });
    }
  },

  methods: {
    async initMap() {
      const container = document.getElementById("map");
      if (!container || !window?.kakao?.maps) return;

      try {
        // 기본 지도 초기화
        map = new kakao.maps.Map(container, {
          center: new kakao.maps.LatLng(37.5012743, 127.039585),
          level: 3,
        });
        this.map = map;

        // 클러스터러 초기화
        clusterer = new kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true,
          minLevel: 3,
          gridSize: 80,
          minClusterSize: 5,
          styles: [
            {
              width: "50px",
              height: "50px",
              background: "rgba(10, 54, 47, .8)",
              color: "#fff",
              textAlign: "center",
              lineHeight: "50px",
              borderRadius: "25px",
              fontSize: "14px",
              fontWeight: "bold",
            },
          ],
        });

        // 주변 시설 정보 동시에 요청
        const [hospitals, markets, subways, schools] = await Promise.all([
          this.fetchNearbyFacilities('hospitals'),
          this.fetchNearbyFacilities('markets'),
          this.fetchNearbyFacilities('subways'),
          this.fetchNearbyFacilities('schools')
        ]);

        // 각 시설 유형별 마커 생성 및 표시
        this.createFacilityMarkers(hospitals, 'hospital');
        this.createFacilityMarkers(markets, 'market');
        this.createFacilityMarkers(subways, 'subway');
        this.createFacilityMarkers(schools, 'school');

      } catch (error) {
        console.error("카카오맵 초기화 중 오류:", error);
      }
    },

    // 주변 시설 정보 요청 메서드
    async fetchNearbyFacilities(type) {
      try {
        const response = await axios.get(`http://localhost:8080/map/getFacilities/${type}`);
        return response.data;
      } catch (error) {
        console.error(`${type} 정보 로드 실패:`, error);
        return [];
      }
    },

    // 시설 마커 생성 메서드
    createFacilityMarkers(facilities, type) {
      const facilityMarkers = [];
      
      facilities.forEach(facility => {
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(facility.latitude, facility.longitude),
          image: createMarkerImage(type)
        });

        // InfoWindow 미리 생성
        const infowindow = new kakao.maps.InfoWindow({
          content: showFacilityInfo(facility, type),
          removable: false,
          zIndex: 1
        });

        // 마우스 이벤트 등록
        kakao.maps.event.addListener(marker, 'mouseover', () => {
          if (hoveredInfowindow) {
            hoveredInfowindow.close();
          }
          infowindow.open(map, marker);
          hoveredInfowindow = infowindow;
        });

        kakao.maps.event.addListener(marker, 'mouseout', () => {
          infowindow.close();
          hoveredInfowindow = null;
        });

        facilityMarkers.push(marker);
      });

      // 지도 레벨 변경 이벤트 리스너
      kakao.maps.event.addListener(map, 'zoom_changed', () => {
        const level = map.getLevel();
        facilityMarkers.forEach(marker => {
          marker.setMap(level <= 5 ? map : null);
        });
      });

      // 초기 레벨에 따라 마커 표시 여부 설정
      const initialLevel = map.getLevel();
      facilityMarkers.forEach(marker => {
        marker.setMap(initialLevel <= 5 ? map : null);
      });
    },

    getMap() {
      return map;
    },

    setMapOptions(level, lat, lng) {
      if (map) {
        map.setLevel(level);
        map.setCenter(new kakao.maps.LatLng(lat, lng));
      }
    },

    showMarker(apt) {
      if (!map || !apt || !apt.lat || !apt.lng) {
        console.error("유효하지 않은 데이터:", apt);
        return;
      }

      try {
        const position = new kakao.maps.LatLng(apt.lat, apt.lng);
        
        // 기존 마커와 원들 제거
        if(selectedMarker) {
          selectedMarker.setMap(null);
        }
        if(circle500m) {
          circle500m.setMap(null);
        }
        if(circle1km) {
          circle1km.setMap(null);
        }

        // 새 마커 생성
        selectedMarker = new kakao.maps.Marker({
          position: position,
          map: map,
          image: new kakao.maps.MarkerImage('/images/home.svg', new kakao.maps.Size(36, 36))
        });

        // 500m 반경 원 생성
        circle500m = new kakao.maps.Circle({
          center: position,
          radius: 500,
          strokeWeight: 2,
          strokeColor: '#0a362f',
          strokeOpacity: 0.8,
          strokeStyle: 'solid',
          fillColor: '#0a362f',
          fillOpacity: 0.2
        });
        
        // 1km 반경 원 생성
        circle1km = new kakao.maps.Circle({
          center: position,
          radius: 1000,
          strokeWeight: 2,
          strokeColor: '#0a362f',
          strokeOpacity: 0.6,  // 더 투명하게
          strokeStyle: 'dashed',  // 점선으로
          fillColor: '#0a362f',
          fillOpacity: 0.1  // 더 투명하게
        });
        
        // 원들을 지도에 표시
        circle1km.setMap(map);   // 1km 원을 먼저 그려서 아래에 깔리도록
        circle500m.setMap(map);  // 500m 원을 나중에 그려서 위에 보이도록

        // 마커에 마우스 오버/아웃 이벤트 추가
        const infowindow = new kakao.maps.InfoWindow({
          content: `
            <div style="
              padding: 8px;
              max-width: 200px;
              word-break: keep-all;
              word-wrap: break-word;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
              <div style="
                font-size: 14px;
                font-weight: 600;
                color: #0a362f;
                margin-bottom: 4px;
              ">${apt.aptName || apt.title}</div>
              <div style="
                font-size: 12px;
                color: #666;
                line-height: 1.4;
              ">
                <p style="margin: 4px 0;">${apt.address || ''}</p>
              </div>
            </div>
          `
        });

        kakao.maps.event.addListener(selectedMarker, 'mouseover', function() {
          if (hoveredInfowindow) {
            hoveredInfowindow.close();
          }
          infowindow.open(map, selectedMarker);
          hoveredInfowindow = infowindow;
        });

        kakao.maps.event.addListener(selectedMarker, 'mouseout', function() {
          infowindow.close();
          hoveredInfowindow = null;
        });

        map.setCenter(position);
        map.setLevel(4);  // 레벨을 5로 조정하여 1km 원까지 잘 보이도록 함
      } catch (error) {
        console.error("마커 표시 중 오류 발생:", error);
      }
    },

    showMarkers(apartments) {
      if (!map || !apartments?.length || !window?.kakao?.maps) {
        console.log("조건 체크 실패", { map, apartmentsLength: apartments?.length });
        return;
      }
      
      try {
        this.clearMarkers();
        const cur = map.getCenter();
        const curLat = cur.getLat();
        const curLng = cur.getLng();
        
        // 최대 마커 수를 10000개로 증가
        const MAX_MARKERS = 10000;
        
        // 필터링 최적화 - 청크로 나누어 처리
        const filteredApts = [];
        const CHUNK_SIZE = 1000; // 한 번에 처리할 데이터 크기

        for (let i = 0; i < apartments.length && filteredApts.length < MAX_MARKERS; i += CHUNK_SIZE) {
          const chunk = apartments.slice(i, i + CHUNK_SIZE);
          
          chunk.forEach(apt => {
            if (filteredApts.length >= MAX_MARKERS) return;
            
            if (apt?.latitude && 
                apt?.longitude && 
                apt?.aptName && 
                Math.abs(curLat - apt.latitude) < 0.5 && 
                Math.abs(curLng - apt.longitude) < 0.5) {
              filteredApts.push(apt);
            }
          });
        }

        // 마커 생성을 청크로 나누어 처리
        const createMarkers = () => {
          const markers = [];
          for (let i = 0; i < filteredApts.length; i += CHUNK_SIZE) {
            const chunk = filteredApts.slice(i, i + CHUNK_SIZE);
            const chunkMarkers = chunk.map(apt => {
              const marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(apt.latitude, apt.longitude),
                image: new kakao.maps.MarkerImage('/images/home.svg', new kakao.maps.Size(36, 36))
              });
              
              // InfoWindow 생성
              const infowindow = new kakao.maps.InfoWindow({
                content: `
                    <div style="
                      min-width: 140px;
                      font-size: 13px;
                      font-weight: 600;
                      color: #0a362f;
                      text-align: center;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    ">
                      ${apt.aptName}
                    </div>
                  `,
                removable: false,
                zIndex: 1
              });
              
              // 마우스 이벤트 등록
              kakao.maps.event.addListener(marker, 'mouseover', function() {
                // 이전 InfoWindow 닫기
                if (hoveredInfowindow) {
                  hoveredInfowindow.close();
                }
                infowindow.open(map, marker);
                hoveredInfowindow = infowindow;
              });

              kakao.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
                hoveredInfowindow = null;
              });

              kakao.maps.event.addListener(marker, 'click', () => {
                this.$emit('select-house', {
                  aptName: apt.aptName,
                  si: apt.si,
                  gu: apt.gu
                });
              });

              marker.aptData = { aptName: apt.aptName };
              return marker;
            });
            markers.push(...chunkMarkers);
          }
          return markers;
        };

        markers = createMarkers();

        if (markers.length > 0) {
          // 마커 일괄 추가 - 청크로 나누어 처리
          const addMarkersInChunks = (index = 0) => {
            const chunk = markers.slice(index, index + CHUNK_SIZE);
            if (chunk.length === 0) return;

            clusterer.addMarkers(chunk);

            if (index + CHUNK_SIZE < markers.length) {
              requestAnimationFrame(() => {
                addMarkersInChunks(index + CHUNK_SIZE);
              });
            }
          };
          addMarkersInChunks();
        }
      } catch (error) {
        console.error("마커 표시 중 오류:", error);
      }
    },

    clearMarkers() {
      if (clusterer) {
        clusterer.clear();
      }
      if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
      }
      if(circle500m) {
        circle500m.setMap(null);
      }
      if(circle1km) {
        circle1km.setMap(null);
      }
      markers = [];
    },
  },
};
</script>

<style>
#map {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>
