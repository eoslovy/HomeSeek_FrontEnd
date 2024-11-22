<template>
  <div class="map-container">
    <div id="map"></div>
  </div>
</template>

<script>
import { toRaw } from 'vue'

export default {
  data() {
    return {
      map: null,
      markers: [],
      selectedMarker: null,
      selectedInfowindow: null,
      clusterer: null,
      markerQueue: [],
      isProcessingMarkers: false
    }
  },

  mounted() {
    if (window?.kakaoMapsLoaded) {
      this.initMap();
    } else {
      window.addEventListener("kakao-maps-sdk-loaded", this.initMap, { once: true });
    }
  },

  methods: {
    async initMap() {
      const container = document.getElementById('map');
      if (!container || !window?.kakao?.maps) return;

      try {
        const rawKakao = toRaw(window.kakao);
        
        this.map = new rawKakao.maps.Map(container, {
          center: new rawKakao.maps.LatLng(37.5012743, 127.039585),
          level: 3
        });

        this.clusterer = new rawKakao.maps.MarkerClusterer({
          map: toRaw(this.map),
          averageCenter: true,
          minLevel: 6,
          gridSize: 80,
          minClusterSize: 5,
          disableClickZoom: false,
          calculator: [10, 30, 50],
          styles: [{
            width: '50px',
            height: '50px',
            background: 'rgba(10, 54, 47, .8)',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '50px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: 'bold'
          }]
        });

        let timeout;
        kakao.maps.event.addListener(this.map, 'dragend', () => {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            this.processMarkerQueue();
          }, 150);
        });

      } catch (error) {
        console.error("카카오맵 초기화 중 오류:", error);
      }
    },

    async processMarkerQueue() {
      if (this.isProcessingMarkers || !this.markerQueue.length) return;
      
      this.isProcessingMarkers = true;
      const BATCH_SIZE = 100;
      
      try {
        while (this.markerQueue.length) {
          const batch = this.markerQueue.splice(0, BATCH_SIZE);
          if (this.clusterer) {
            this.clusterer.addMarkers(batch);
          }
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      } finally {
        this.isProcessingMarkers = false;
      }
    },

    showMarkers(apartments) {
      if (!this.map || !apartments?.length || !window?.kakao?.maps) return;

      try {
        this.clearMarkers();
        const cur = this.map.getCenter();
        const rawKakao = toRaw(window.kakao);
        
        this.markerQueue = apartments
          .filter(apt => 
            apt?.latitude && 
            apt?.longitude && 
            apt?.aptName && 
            Math.abs(cur.getLat() - apt.latitude) < 0.5 && 
            Math.abs(cur.getLng() - apt.longitude) < 0.5
          )
          .map(apt => {
            const marker = new rawKakao.maps.Marker({
              position: new rawKakao.maps.LatLng(apt.latitude, apt.longitude)
            });
            marker.aptData = { aptName: apt.aptName };
            return marker;
          })
          .filter(Boolean);

        this.markers = this.markerQueue.slice();
        this.processMarkerQueue();
      } catch (error) {
        console.error("마커 표시 중 오류:", error);
      }
    },

    clearMarkers() {
      this.markerQueue = [];
      if (this.clusterer) {
        this.clusterer.clear();
      }
      this.markers = [];
    }
  }
}
</script>

<style>
#map {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>