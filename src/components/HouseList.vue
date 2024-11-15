<template>
    <div>
      <table v-if="showBuyTable" class="table table-hover mt-4">
        <thead>
          <tr>
            <th>단지명</th>
            <th>층</th>
            <th>면적</th>
            <th>법정동</th>
            <th class="text-end">거래금액</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="house in houses" :key="house.id" @click="$emit('view-house', house)">
            <td>{{ house.name }}</td>
            <td>{{ house.floor }}</td>
            <td>{{ house.area }}</td>
            <td>{{ house.dong }}</td>
            <td class="text-end">{{ house.dealAmount }}만원</td>
          </tr>
        </tbody>
      </table>
  
      <table v-if="showRentTable" class="table table-hover mt-4">
        <thead>
          <tr>
            <th>단지명</th>
            <th>층</th>
            <th>면적</th>
            <th>법정동</th>
            <th class="text-end">보증금</th>
            <th class="text-end">월세</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="house in houses" :key="house.id" @click="$emit('view-house', house)">
            <td>{{ house.name }}</td>
            <td>{{ house.floor }}</td>
            <td>{{ house.area }}</td>
            <td>{{ house.dong }}</td>
            <td class="text-end">{{ house.deposit }}만원</td>
            <td class="text-end">{{ house.monthlyRent }}만원</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HouseList',
    props: {
      houses: Array,
      showBuyTable: Boolean,
      showRentTable: Boolean
    }
  }
  </script>
  
  <style scoped>
  .text-end {
    text-align: right;
  }
  </style>