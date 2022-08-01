import Vue from 'vue'

import {
  Layout,
  Table,
  Icon,
  Button,
  Form,
  Input,
  Checkbox,
  Upload,
  Card,
  Spin,
  Dropdown,
  Menu,
  message,
  Modal
} from 'ant-design-vue'

Vue.use(Layout)
Vue.use(Table)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Spin)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(Modal)

Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm