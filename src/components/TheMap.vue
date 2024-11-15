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
      infowindow: null
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
    showMarker(location) {
      const kakao = window.kakao
      
      if (this.marker) {
        this.marker.setMap(null)
      }
      
      this.marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(location.lat, location.lng)
      })
      
      this.marker.setMap(this.map)
      this.map.setCenter(new kakao.maps.LatLng(location.lat, location.lng))
      
      if (this.infowindow) {
        this.infowindow.close()
      }
      
      this.infowindow = new kakao.maps.InfoWindow({
        content: `<div style="padding:5px;">${location.title}</div>`
      })
      
      this.infowindow.open(this.map, this.marker)
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