<template>
  <div id="app">
    <TheHeader />
    <router-view></router-view>
  </div>
</template>

<script>
import TheHeader from "@/components/header/TheHeader.vue";

export default {
  name: "App",
  components: {
    TheHeader,
  },
  mounted() {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=34932ec8f94f62ada36f0d8949296a56&libraries=services,clusterer&autoload=false`;
    script.async = true;
    script.onload = () => {
      kakao.maps.load(() => {
        window.dispatchEvent(new Event("kakao-maps-sdk-loaded"));
        console.log("Kakao Maps SDK loaded successfully");
      });
    };
    document.head.appendChild(script);
  },
};
</script>
