<template>
  <transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <div class="header-left">
            <i class="bi bi-arrow-left" @click="$emit('close')"></i>
            <h3>대출 계산기</h3>
          </div>
        </div>
        
        <div class="modal-body">
          <div class="input-section">
            <div class="input-group">
              <label>대출 금액</label>
              <div class="input-wrapper">
                <input 
                  type="text" 
                  v-model="loanAmount"
                  placeholder="0"
                  class="input-field"
                >
                <span class="unit">원</span>
              </div>
              <div class="button-group">
                <button class="quick-button" @click="adjustAmount(-1)">초기화</button>
                <button class="quick-button" @click="adjustAmount(1000000)">+100만</button>
                <button class="quick-button" @click="adjustAmount(10000000)">+1000만</button>
                <button class="quick-button" @click="adjustAmount(100000000)">+1억</button>
              </div>
            </div>
            
            <hr class="divider">
            
            <div class="input-group">
              <label>연 이자율</label>
              <div class="input-wrapper">
                <input 
                  type="text" 
                  v-model="interestRate"
                  placeholder="0"
                  class="input-field"
                >
                <span class="unit">%</span>
              </div>
              <div class="button-group">
                <button class="quick-button" @click="adjustRate(-1)">초기화</button>
                <button class="quick-button" @click="adjustRate(1)">+1%</button>
                <button class="quick-button" @click="adjustRate(2)">+2%</button>
                <button class="quick-button" @click="adjustRate(5)">+5%</button>
              </div>
            </div>
            
            <hr class="divider">
            
            <div class="input-group">
              <label>상환기간</label>
              <div class="input-wrapper">
                <input 
                  type="text" 
                  v-model="loanPeriod"
                  placeholder="0"
                  class="input-field"
                >
                <span class="unit">년</span>
              </div>
              <div class="button-group">
                <button class="quick-button" @click="adjustPeriod(-1)">초기화</button>
                <button class="quick-button" @click="adjustPeriod(1)">1년</button>
                <button class="quick-button" @click="adjustPeriod(2)">2년</button>
                <button class="quick-button" @click="adjustPeriod(5)">5년</button>
              </div>
            </div>
            
            <hr class="divider">
            
            <div class="input-group">
              <label>상환방식</label>
              <select v-model="repaymentType" class="select-field">
                <option value="equal-principal-interest">원리금균등상환</option>
                <option value="equal-principal">원금균등상환</option>
                <option value="bullet">만기일시상환</option>
              </select>
            </div>

            <button class="calculate-button" @click="calculateLoan">
              계산하기
            </button>
          </div>

          <div v-if="result" class="result-section">
            <div class="calculation-result">
              <h3>계산 결과</h3>
              <div class="result-content">
                <p>{{ formatCurrency(loanAmount) }}원을 {{ loanPeriod }}년 동안</p>
                <p>{{ getRepaymentTypeText() }}으로 대출을 받았을때</p>
                <p>{{ interestRate }}% 기준 매월 {{ monthlyPayment }}원을 갚아야 합니다</p>
              </div>
            </div>

            <table class="loan-summary-table">
              <thead>
                <tr>
                  <th>회차</th>
                  <th>이자</th>
                  <th>원금</th>
                  <th>납입금액</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in paymentSchedule" :key="index">
                  <td>{{ row.period }}</td>
                  <td class="amount">{{ formatCurrency(row.interest) }}</td>
                  <td class="amount">{{ formatCurrency(row.principal) }}</td>
                  <td class="amount">{{ formatCurrency(row.payment) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

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
  padding-top: 80px;
  z-index: 9999;
}

.modal-content {
  background: rgba(33, 37, 41, 0.95);
  width: 600px;
  border-radius: 8px;
  border: none;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #0a362f;
  border-radius: 8px 8px 0 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left i {
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}

.header-left h3 {
  color: white;
  margin: 0;
  font-size: 1.2rem;
}

.modal-body {
  background: white;
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 70px);
  border-radius: 0 0 8px 8px;
}

.input-section {
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group label {
  display: block;
  color: #333;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 6px;
}

.input-wrapper {
  position: relative;
  margin-bottom: 4px;
  width: 200px;
}

.input-field {
  width: 100%;
  padding: 8px 40px 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.2s ease;
  height: 36px;
  margin-top: 4px;
}

.input-field:focus {
  outline: none;
  border-color: #ddd;
  box-shadow: none;
}

.unit {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 16px;
}

.button-group {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.quick-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-button:hover {
  background-color: #f5f5f5;
}

.quick-button:first-child {
  background-color: #f8f9fa;
}

.select-field {
  width: 200px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  color: #333;
  background-color: #fff;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.762L10.825 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition: all 0.2s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.select-field:focus {
  outline: none;
  border-color: #ddd;
  box-shadow: none;
}

.select-field::-moz-focus-inner {
  border: 0;
}

.select-field::-ms-expand {
  display: none;
}

.calculate-button {
  width: 100%;
  background: #0a362f;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
}

.calculate-button:hover {
  background: #0d4339;
}

.calculate-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.result-section {
  padding: 20px;
}

.calculation-result {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.calculation-result h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #dee2e6;
}

.result-content {
  padding: 0 8px;
}

.result-content p {
  font-size: 17px;
  line-height: 1.6;
  margin: 8px 0;
  color: #333;
}

.result-content p:last-child {
  font-size: 18px;
  font-weight: 600;
  color: #0a362f;
  margin-top: 12px;
}

.loan-summary-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.loan-summary-table th,
.loan-summary-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.loan-summary-table th {
  background-color: #f5f5f5;
  text-align: center;
}

.amount {
  text-align: right;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .input-wrapper,
  .select-field {
    width: 100%;
  }
  
  .button-group {
    flex-wrap: wrap;
  }
  
  .quick-button {
    flex: 1;
    min-width: calc(50% - 4px);
  }
}

.divider {
  border: none;
  height: 1px;
  background-color: #adb5bd;
  margin: 12px 0;
}

/* 페이드 인 애니메이션 추가 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 페이드 트랜지션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script>
export default {
  name: "LoanView",
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loanAmount: '',
      interestRate: '',
      loanPeriod: '',
      repaymentType: 'equal-principal-interest',
      result: null,
      monthlyPayment: null,
      paymentSchedule: [],
      annualSummary: []
    };
  },
  computed: {
    isValidInput() {
      return this.loanAmount > 0 && this.loanPeriod > 0;
    }
  },
  methods: {
    calculateLoan() {
      try {
        const P = Number(this.loanAmount);
        const years = Number(this.loanPeriod);
        const annualRate = Number(this.interestRate);
        const r = annualRate / 12 / 100;
        const n = years * 12;

        this.paymentSchedule = [];
        
        switch (this.repaymentType) {
          case 'bullet':
            this.calculateBulletPayment(P, r, n);
            break;
          case 'equal-principal':
            this.calculateEqualPrincipal(P, r, n);
            break;
          default:
            this.calculateEqualPrincipalInterest(P, r, n);
        }

        this.result = true;
      } catch (error) {
        console.error('Error:', error);
        alert('계산 중 오류가 발생했습니다.');
      }
    },

    calculateAnnualSummary() {
      const annualSummary = [];
      let remainingPrincipal = Number(this.loanAmount);

      for (let year = 1; year <= this.loanPeriod; year++) {
        let annualPayment = 0;
        let annualPrincipal = 0;
        let annualInterest = 0;

        for (let month = 1; month <= 12; month++) {
          const index = (year - 1) * 12 + month - 1;
          if (index >= this.paymentSchedule.length) break;

          const row = this.paymentSchedule[index];
          annualPayment += row.payment;
          annualPrincipal += row.principal;
          annualInterest += row.interest;
          remainingPrincipal = row.remainingPrincipal;
        }

        annualSummary.push({
          year,
          annualPayment: this.formatCurrency(annualPayment),
          annualPrincipal: this.formatCurrency(annualPrincipal),
          annualInterest: this.formatCurrency(annualInterest),
          remainingPrincipal: this.formatCurrency(remainingPrincipal)
        });
      }

      this.annualSummary = annualSummary;
    },

    calculateBulletPayment(P, r, n) {
      const monthlyInterest = P * r;
      const totalInterest = monthlyInterest * n;
      
      this.monthlyPayment = this.formatCurrency(monthlyInterest);
      this.totalPayment = this.formatCurrency(P + totalInterest);
      this.totalInterest = this.formatCurrency(totalInterest);
      
      // 매월 이자만 납부하는 스케줄 생성
      for (let month = 1; month <= n; month++) {
        this.paymentSchedule.push({
          period: `${month}개차`,
          payment: monthlyInterest,
          principal: month === n ? P : 0, // 마지막 달에만 원금 상환
          interest: monthlyInterest,
          remainingPrincipal: month === n ? 0 : P
        });
      }
    },

    calculateEqualPrincipal(P, r, n) {
      const monthlyPrincipal = P / n;
      let remainingPrincipal = P;
      let totalInterest = 0;
      
      // 첫 달 납입금으로 초기값 설정
      const initialMonthlyInterest = P * r;
      this.monthlyPayment = this.formatCurrency(monthlyPrincipal + initialMonthlyInterest);
      
      for (let month = 1; month <= n; month++) {
        const monthlyInterest = remainingPrincipal * r;
        const monthlyPayment = monthlyPrincipal + monthlyInterest;
        
        totalInterest += monthlyInterest;
        remainingPrincipal -= monthlyPrincipal;

        this.paymentSchedule.push({
          period: `${month}개월차`,
          payment: monthlyPayment,
          principal: monthlyPrincipal,
          interest: monthlyInterest,
          remainingPrincipal: Math.max(0, remainingPrincipal)
        });
      }
      
      this.totalPayment = this.formatCurrency(P + totalInterest);
      this.totalInterest = this.formatCurrency(totalInterest);
    },

    calculateEqualPrincipalInterest(P, r, n) {
      const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      this.monthlyPayment = this.formatCurrency(monthlyPayment);
      
      let remainingPrincipal = P;
      
      for (let month = 1; month <= n; month++) {
        const monthlyInterest = remainingPrincipal * r;
        const monthlyPrincipal = monthlyPayment - monthlyInterest;
        
        remainingPrincipal -= monthlyPrincipal;

        this.paymentSchedule.push({
          period: `${month}개월차`,
          payment: monthlyPayment,
          principal: monthlyPrincipal,
          interest: monthlyInterest,
          remainingPrincipal: Math.max(0, remainingPrincipal)
        });
      }
    },

    getRepaymentTypeText() {
      const types = {
        'equal-principal-interest': '원리금균등상환',
        'equal-principal': '원금균등상환',
        'bullet': '만기일시상환'
      };
      return types[this.repaymentType] || '원리금균등상환';
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('ko-KR', {
        style: 'decimal',
        maximumFractionDigits: 0
      }).format(Math.round(value));
    },

    adjustAmount(value) {
      if (value === -1) {
        this.loanAmount = '';
        return;
      }
      const currentAmount = Number(this.loanAmount) || 0;
      this.loanAmount = String(currentAmount + value);
    },
    
    adjustRate(value) {
      if (value === -1) {
        this.interestRate = '';
        return;
      }
      const currentRate = Number(this.interestRate) || 0;
      this.interestRate = String(currentRate + value);
    },
    
    adjustPeriod(value) {
      if (value === -1) {
        this.loanPeriod = '';
        return;
      }
      const currentPeriod = Number(this.loanPeriod) || 0;
      this.loanPeriod = String(currentPeriod + value);
    }
  }
};
</script>
