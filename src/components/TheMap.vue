<template>
  <div class="map-container">
    <div id="map"></div>
  </div>
</template>

<script>
// 전역 변수로 선언
let map = null;
let markers = [];
let selectedMarker = null;
let selectedInfowindow = null;
let clusterer = null;

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
        map = new kakao.maps.Map(container, {
          center: new kakao.maps.LatLng(37.5012743, 127.039585),
          level: 3,
        });
        this.map = map;  // 컴포넌트 상태에도 저장

        clusterer = new kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true,
          minLevel: 3,
          gridSize: 60,
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
      } catch (error) {
        console.error("카카오맵 초기화 중 오류:", error);
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
        
        if(selectedMarker) {
          selectedMarker.setMap(null);
        }

        selectedMarker = new kakao.maps.Marker({
          position: position,
          map: map,
        });

        if (apt.title) {
          selectedInfowindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;"><strong>${apt.title}</strong></div>`,
            removable: true,
          });
          selectedInfowindow.open(map, selectedMarker);
        }

        map.setCenter(position);
        map.setLevel(3);
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

        // 필터링된 마커 확인
        const filteredApts = apartments.filter(
          (apt) =>
            apt?.latitude &&
            apt?.longitude &&
            apt?.aptName &&
            Math.abs(cur.getLat() - apt.latitude) < 0.5 &&
            Math.abs(cur.getLng() - apt.longitude) < 0.5
        );

        markers = filteredApts.map((apt) => {
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(apt.latitude, apt.longitude),
          });
          marker.aptData = { aptName: apt.aptName };
          return marker;
        });
    
        
        if (markers.length > 0) {
          clusterer.clear();
          clusterer.addMarkers(markers);
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
