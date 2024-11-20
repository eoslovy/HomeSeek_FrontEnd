<template>
  <div>
    <table v-if="showBuyTable" class="table table-hover mt-4">
      <thead>
        <tr>
          <th>단지명</th>
          <th>주소</th>
          <th>층</th>
          <th>건축연도</th>
          <th class="text-end">거래금액</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="house in houses"
          :key="house.aptName"
          @click="
            $emit('view-house', {
              lat: house.latitude,
              lng: house.longitude,
              title: house.aptName,
            })
          "
        >
          <td>{{ house.aptName }}</td>
          <td>{{ getFullAddress(house) }}</td>
          <td>{{ house.floor }}층</td>
          <td>{{ house.buildYear }}년</td>
          <td class="text-end">{{ formatPrice(house.dealAmount) }}만원</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "HouseList",
  props: {
    houses: Array,
    showBuyTable: Boolean,
    showRentTable: Boolean,
  },
  methods: {
    getFullAddress(house) {
      return `${house.sidoName} ${house.gugunName} ${house.umdNm} ${
        house.roadNm
      } ${house.roadNmBonbun}${
        house.roadNmBubun !== "0" ? "-" + house.roadNmBubun : ""
      }`;
    },
    formatPrice(price) {
      return price.replace(/,/g, "");
    },
  },
};
</script>

<style scoped>
.text-end {
  text-align: right;
}
.table tbody tr {
  cursor: pointer;
}
.table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}
</style>
