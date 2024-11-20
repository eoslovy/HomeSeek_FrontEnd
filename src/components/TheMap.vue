<template>
  <div id="map"></div>
</template>

<script>
export default {
  name: 'TheMap',
  data() {
    return {
      map: null,
      marker: null,
      infowindow: null,
      markers: [],
      bounds: null,
      clusterer: null
    }
  },
  mounted() {
    const initMap = () => {
      try {
        const container = document.getElementById('map')
        const kakao = window.kakao
        const options = {
          center: new kakao.maps.LatLng(37.5012743, 127.039585),
          level: 3
        }
        this.map = new kakao.maps.Map(container, options)
        this.bounds = new kakao.maps.LatLngBounds()
        
        // 클러스터러 초기화
        this.clusterer = new kakao.maps.MarkerClusterer({
          map: this.map,
          averageCenter: true,
          minLevel: 6,
          disableClickZoom: true,
          gridSize: 60,
          styles: [{
            width: '50px',
            height: '50px',
            background: 'rgba(10, 54, 47, .8)',
            borderRadius: '25px',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '50px',
            fontSize: '14px',
            fontWeight: 'bold'
          }]
        });

        // 지도 이동 이벤트 리스너
        kakao.maps.event.addListener(this.map, 'idle', this.updateMarkers);
      } catch (error) {
        console.error('카카오맵 초기화 실패:', error)
      }
    }

    if (window.kakao && window.kakao.maps) {
      initMap()
    } else {
      window.addEventListener('kakao-maps-sdk-loaded', initMap, { once: true })
    }
  },

  methods: {
    clearMarkers() {
      if (this.clusterer) {
        this.clusterer.clear();
      }
      this.markers = [];
      this.bounds = new window.kakao.maps.LatLngBounds();
    },
    
    showMarkers(apartments) {
      this.clearMarkers();
      this.allApartments = apartments; // 전체 아파트 데이터 저장
      this.updateMarkers(); // 현재 영역에 있는 마커만 표시
    },

    updateMarkers() {
      if (!this.allApartments) return;

      const bounds = this.map.getBounds();
      const markers = [];

      this.allApartments.forEach(apt => {
        const position = new window.kakao.maps.LatLng(apt.latitude, apt.longitude);
        
        if (bounds.contain(position)) {
          const marker = new window.kakao.maps.Marker({
            position: position
          });
          
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">${apt.aptName}</div>`,
            removable: true
          });
          
          marker.infowindow = infowindow;
          
          window.kakao.maps.event.addListener(marker, 'click', () => {
            this.markers.forEach(m => {
              if (m.infowindow) m.infowindow.close();
            });
            infowindow.open(this.map, marker);
          });
          
          markers.push(marker);
          this.bounds.extend(position);
        }
      });

      // 기존 클러스터 제거 후 새로운 마커 추가
      this.clusterer.clear();
      this.clusterer.addMarkers(markers);
      this.markers = markers;
    },
    
    showMarker({ lat, lng, title }) {
      const position = new window.kakao.maps.LatLng(lat, lng);
      this.map.setCenter(position);
      this.map.setLevel(3);
    },
    
    setCenter(lat, lng) {
      const position = new window.kakao.maps.LatLng(lat, lng);
      this.map.setCenter(position);
      this.map.setLevel(8);
    }
  }
}
</script>

<style>
#map {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100vh !important;
  z-index: 0 !important;
}
</style>