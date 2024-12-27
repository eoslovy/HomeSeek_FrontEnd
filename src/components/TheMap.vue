<template>
  <div class="map-container">
    <div id="map"></div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import { showFacilityInfo, createMarkerImage } from '@/utils/mapUtils';

// 전역 변수로 선언
let map = null;
let markers = [];
let selectedMarker = null;
let selectedInfowindow = null;
let clusterer = null;
let hoveredInfowindow = null;
let circle500m = null; // 500m 반경 원
let circle1km = null; // 1km 반경 원

export default {
  data() {
    return {
      map: null, // 컴포넌트 내부 상태로도 저장
    };
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

  computed: {
    ...mapState({
      sidoList: (state) => state.region.sidoList, // 시도 리스트
      gugunList: state => {
        console.log('computed에서 확인하는 구군 리스트:', state.region.gugunList);  // 디버깅 로그 추가
        return state.region.gugunList;
      },
      dongList: (state) => state.region.dongList, // 동 리스트
    }),
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
          this.fetchNearbyFacilities("hospitals"),
          this.fetchNearbyFacilities("markets"),
          this.fetchNearbyFacilities("subways"),
          this.fetchNearbyFacilities("schools"),
        ]);

        // 각 시설 유형별 마커 생성 및 표시
        this.createFacilityMarkers(hospitals, "hospital");
        this.createFacilityMarkers(markets, "market");
        this.createFacilityMarkers(subways, "subway");
        this.createFacilityMarkers(schools, "school");
      } catch (error) {
        console.error("카카오맵 초기화 중 오류:", error);
      }
    },

    // 주변 시설 정보 요청 메서드
    async fetchNearbyFacilities(type) {
      try {
        const response = await axios.get(
          `/map/getFacilities/${type}`
        );
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
          zIndex: 1,
        });

        // 마우스 이벤트 등록
        kakao.maps.event.addListener(marker, "mouseover", () => {
          if (hoveredInfowindow) {
            hoveredInfowindow.close();
          }
          infowindow.open(map, marker);
          hoveredInfowindow = infowindow;
        });

        kakao.maps.event.addListener(marker, "mouseout", () => {
          infowindow.close();
          hoveredInfowindow = null;
        });

        facilityMarkers.push(marker);
      });

      // 지도 레벨 변경 이벤트 리스너
      kakao.maps.event.addListener(map, "zoom_changed", () => {
        const level = map.getLevel();
        facilityMarkers.forEach((marker) => {
          marker.setMap(level <= 5 ? map : null);
        });
      });

      // 초기 레벨에 따라 마커 표시 여부 설정
      const initialLevel = map.getLevel();
      facilityMarkers.forEach((marker) => {
        marker.setMap(initialLevel <= 5 ? map : null);
      });
    },
    // 마커 이미지 생성 메서드
    createMarkerImage(type) {
      const imageSize = new kakao.maps.Size(36, 36);
      let imageSrc;
      switch (type) {
        case "hospital":
          imageSrc = "/images/hospital.png";
          break;
        case "market":
          imageSrc = "/images/supermarket.svg";
          break;
        case "subway":
          imageSrc = "/images/subway.svg";
          break;
        case "school":
          imageSrc = "/images/school.png";
          break;
      }

      return new kakao.maps.MarkerImage(imageSrc, imageSize);
    },

    // 시설 정보창 표시 메서드
    showFacilityInfo(facility, type) {
      switch (type) {
        case "hospital":
          return `
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
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              ">${facility.name}</div>
              <div style="
                font-size: 12px;
                color: #666;
                line-height: 1.4;
              ">
                <p style="margin: 4px 0; word-break: keep-all;">${
                  facility.address
                }</p>
                <p style="margin: 4px 0;">병원 분류: ${
                  facility.category || "정보없음"
                }</p>
                <p style="margin: 4px 0;">전화번호: ${
                  facility.tel || "정보없음"
                }</p>
              </div>
            </div>
          `;
        case "market":
          return `
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
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              ">${facility.name}</div>
              <div style="
                font-size: 12px;
                color: #666;
                line-height: 1.4;
              ">
                <p style="margin: 4px 0; word-break: keep-all;">${
                  facility.address
                }</p>
                <p style="margin: 4px 0;">영업 분류: ${
                  facility.category || "정보없음"
                }</p>
              </div>
            </div>
          `;
        case "subway":
          return `
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
              ">${facility.name}역</div>
              <div style="
                font-size: 12px;
                color: #666;
                line-height: 1.4;
              ">
                <p style="margin: 4px 0;">${facility.line}호선</p>
              </div>
            </div>
          `;
        case "school":
          return `
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
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              ">${facility.name}</div>
              <div style="
                font-size: 12px;
                color: #666;
                line-height: 1.4;
              ">
                <p style="margin: 4px 0;">학교 분류 : ${
                  facility.category || "정보없음"
                }</p>
                <p style="margin: 4px 0;">설립 분류 : ${
                  facility.type || "정보없음"
                }</p>
                <p style="margin: 4px 0; word-break: keep-all;">주소 : ${
                  facility.address || "정보없음"
                }</p>
              </div>
            </div>
          `;
      }
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

        this.clearMarkers();

        // 새 마커 생성
        selectedMarker = new kakao.maps.Marker({
          position: position,
          map: map,
          image: new kakao.maps.MarkerImage(
            "/images/home.svg",
            new kakao.maps.Size(36, 36)
          ),
        });

        // 500m와 1km 반경 원 생성 및 표시
        circle500m = new kakao.maps.Circle({
          center: position,
          radius: 500,
          strokeWeight: 2,
          strokeColor: "#0a362f",
          strokeOpacity: 0.8,
          strokeStyle: "solid",
          fillColor: "#0a362f",
          fillOpacity: 0.2,
        });

        circle1km = new kakao.maps.Circle({
          center: position,
          radius: 1000,
          strokeWeight: 2,
          strokeColor: "#0a362f",
          strokeOpacity: 0.6,
          strokeStyle: "dashed",
          fillColor: "#0a362f",
          fillOpacity: 0.1,
        });

        circle1km.setMap(map);
        circle500m.setMap(map);

        // 정보창 생성
        selectedInfowindow = new kakao.maps.InfoWindow({
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

        // 정보창이 생성된 후에 열기
        if (selectedInfowindow && selectedMarker) {
          selectedInfowindow.open(map, selectedMarker);
        }

        // 도 중심 이동 및 레벨 설정
        map.setCenter(position);
        map.setLevel(4);

      } catch (error) {
        console.error("마커 표시 중 오류 발생:", error);
      }
    },

    async showMarkers(apartments, selectedLevel) {
      this.clearMarkers();
      if (!map || !apartments?.length || !window?.kakao?.maps) {
        console.log("조건 체크 실패", {
          map,
          apartmentsLength: apartments?.length,
        });
        return;
      }

      try {
        // dong 레벨일 경우 개별 마커로 표시
        if (selectedLevel === "dong") {
          apartments.forEach((apt) => {
            const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(apt.latitude, apt.longitude),
              map: map,
              title: apt.aptName,
              image: new kakao.maps.MarkerImage(
                "/images/home.svg",
                new kakao.maps.Size(36, 36)
              ),
            });

            // 인포윈도우 생성
            const infowindow = new kakao.maps.InfoWindow({
              content: `
                <div style="padding: 10px; text-align: center;">
                  <div style="font-weight: bold; margin-bottom: 4px;">${apt.aptName}</div>
                </div>
              `,
            });

            // 마우스 이벤트
            kakao.maps.event.addListener(marker, "mouseover", () =>
              infowindow.open(map, marker)
            );
            kakao.maps.event.addListener(marker, "mouseout", () =>
              infowindow.close()
            );

            // 클릭 이벤트 수정
            kakao.maps.event.addListener(marker, "click", async () => {
              try {
                // POST 메서드로 변경
                const response = await axios.post('/deals/search', {
                  aptName: apt.aptName
                });
                // 검색 결과를 Vuex store에 저장
                this.$store.commit('house/setSearchResults', response.data);
                // HouseList 컴포넌트 표시
                this.$store.commit('house/setShowHouseList', true);
              } catch (error) {
                console.error('실거래가 조회 중 오류:', error);
              }
            });

            markers.push(marker);
          });
          return;
        }

        // si, gu 레벨일 경우 클러스터링

        let regionNames =
          selectedLevel === "si"
            ? this.gugunList.map((gu) => gu.guName) // 구군 이름만 추출
            : this.dongList.map((dong) => dong.dongName); // 동 이름만 추출

        if (!regionNames?.length) {
          console.log("행정구역 리스트가 비어있습니다.");
          return;
        }

        // 하위 행정구역별로 그룹화
        const groupedApts = {};
        regionNames.forEach((name) => {
          groupedApts[name] = {
            apartments: [],
            center: { lat: 0, lng: 0 },
            count: 0,
          };
        });

        // 아파트들을 해당 그룹에 할당
        apartments.forEach((apt) => {
          const key = selectedLevel === "si" ? apt.gu : apt.dong;
          if (groupedApts[key]) {
            if(apt.latitude && apt.longitude){
              groupedApts[key].apartments.push(apt);
              groupedApts[key].center.lat += parseFloat(apt.latitude);
              groupedApts[key].center.lng += parseFloat(apt.longitude);
              groupedApts[key].count++;
            }
          }
        });

        // 빈 그룹 제거 및 중심점 계산
        Object.keys(groupedApts).forEach((key) => {
          if (groupedApts[key].count === 0) {
            delete groupedApts[key];
          } else {
            groupedApts[key].center.lat /= groupedApts[key].count;
            groupedApts[key].center.lng /= groupedApts[key].count;
          }
        });

        // 클러스터러 초기화 수정
        clusterer = new kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true,
          minLevel: selectedLevel === "si" ? 7 : 6,
          gridSize: selectedLevel === "si" ? 120 : 100,
          disableClickZoom: selectedLevel === "si" || selectedLevel === "gu", // si 또는 gu 레벨일 때 클릭 줌 비활성화
          minClusterSize: 1,
          texts: (count) => {
            const currentMarker = markers[markers.length - 1];
            return currentMarker ? currentMarker.getTitle() : `${count}개`;
          },
          calculator: [1, 10, 30], // 클러스터 크기 구분값
          styles: [
            {
              width: "100px",
              height: "40px",
              background: "rgba(10, 54, 47, .8)",
              borderRadius: "20px",
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              lineHeight: "41px",
              fontSize: "12px",
            },
            {
              width: "110px",
              height: "45px",
              background: "rgba(10, 54, 47, .8)",
              borderRadius: "23px",
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              lineHeight: "46px",
              fontSize: "13px",
            },
            {
              width: "120px",
              height: "50px",
              background: "rgba(10, 54, 47, .8)",
              borderRadius: "25px",
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              lineHeight: "51px",
              fontSize: "14px",
            },
          ],
        });

        // 각 그룹별 마커 생성
        Object.entries(groupedApts).forEach(([key, group]) => {
          if (group.count > 0) {
            const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(
                group.center.lat,
                group.center.lng
              ),
              title: `${key}\n(${group.count}개)`, // 마커 타이틀에 지역명과 개수 포함
            });

            markers.push(marker);
            clusterer.addMarker(marker);
          }
        });
      } catch (error) {
        console.error("마커 표시 중 오류:", error);
      }
    },

    clearMarkers() {
      if (clusterer) {
        clusterer.clear();
      }
      if (markers.length > 0) {
        markers.forEach((marker) => marker.setMap(null));
      }
      if (circle500m) {
        circle500m.setMap(null);
      }
      if (circle1km) {
        circle1km.setMap(null);
      }
      markers = [];
    },

    async handleSiClick(si) {
      try {
        console.log('시도 클릭:', si);  // 디버깅 로그 추가
        const guList = await this.fetchGuNames(si);
        console.log('받은 구 목록:', guList);  // 디버깅 로그 추가
        
        if (guList && Array.isArray(guList) && guList.length > 0) {
          this.$store.commit('setSelectedSi', si);
          this.$store.commit('setGuList', guList);
        } else {
          console.warn('구 목록이 비어있거나 올바른 형식이 아닙니다:', guList);
        }
      } catch (error) {
        console.error('구 목록 로드 중 오류:', error);
      }
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
