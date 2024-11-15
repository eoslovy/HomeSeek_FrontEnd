import { createStore } from 'vuex'
import house from './modules/house'
import auth from './modules/auth'
import region from './modules/region'

export default createStore({
  modules: {
    house,
    auth,
    region
  }
})