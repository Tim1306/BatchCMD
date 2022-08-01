<template>
  <a-layout class="layout">
    <!-- <a-layout-header>还没想好放啥</a-layout-header> -->
    <a-layout-content class="wrapper">
      <a-card class="commands" title="命令">
        <a-button type="dashed" slot="extra" class="add" @click="showModal('command', 'add')" :disabled="Boolean(executioningLength)">+</a-button>
        <a-table :columns="commandColumns" :data-source="commandList" :pagination="false" :row-selection="rowSelectionC" size="small" :scroll="{y: 'auto'}">
          <a-dropdown slot="action" slot-scope="index, record" :disabled="Boolean(executioningLength)">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="showModal('command', 'edit', record)">编辑</a-menu-item>
              <a-menu-item key="2" @click="delItem('command', record)">删除</a-menu-item>
            </a-menu>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">操作<a-icon type="down" /> </a>
          </a-dropdown>
        </a-table>
      </a-card>
      <a-card class="execution-list" title="执行列表">
        <a-button type="primary" @click="execution" slot="extra" :loading="Boolean(executioningLength)">执行</a-button>
        <a-table :columns="executionColumns" :data-source="executionList" :pagination="false" size="small" :scroll="{y: 'auto'}">
          <template slot="status" slot-scope="index, record">
            <span :class="record.status" v-if="record.status == 'wait'">待执行</span>
            <span :class="record.status" v-if="record.status == 'loading'">执行中</span>
            <span :class="record.status" v-if="record.status == 'success'">执行成功</span>
            <span :class="record.status" v-if="record.status == 'error'">失败</span>
          </template>
        </a-table>
      </a-card>
      <a-card class="folder" title="文件夹">
        <a-button type="dashed" slot="extra" class="add" @click="showModal('folder', 'add')" :disabled="Boolean(executioningLength)">+</a-button>
        <a-table :columns="folderColumns" :data-source="folderList" :pagination="false" :row-selection="rowSelectionF" size="small" :scroll="{y: 'auto'}">
          <a-dropdown slot="action" slot-scope="index, record" :disabled="Boolean(executioningLength)">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="showModal('folder', 'edit', record)">编辑</a-menu-item>
              <a-menu-item key="2" @click="delItem('folder', record)">删除</a-menu-item>
            </a-menu>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">操作<a-icon type="down" /> </a>
          </a-dropdown>
        </a-table>
      </a-card>
      <a-modal
        :title="`${addType.opation}${addType.name}`"
        :visible="modalVisible"
        :destroyOnClose="true"
        @ok="$refs.add.submit()"
        @cancel="cancel"
      >
        <add :type="addMode" ref="add" @setData="setData" :editItem="editItem" @success="setData"></add>
      </a-modal>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      BatchCMD ©2020 Created by Hong Shan
    </a-layout-footer>
  </a-layout>
</template>

<script>
import opation from './opation'
import Add from './add'
export default {
  name: 'index',
  components: { Add },
  data() {
    return {
      commandColumns: opation.commandColumns,
      folderColumns: opation.folderColumns,
      executionColumns: opation.executionColumns,
      commandList: [],
      executionList: [],
      executioningLength: 0,
      folderList: [],
      modalVisible: false,
      selectC: [],
      selectF: [],
      editItem: {},
      addMode: null, // 文件夹or命令
      opation: null, // 添加or编辑
      list: [
        {title: 'webA', command: 'npm run build', position: 'I:/svn/dev', status: 'wait'},
        {title: 'webB', command: 'npm run build', position: 'I:/svn/electron', status: 'wait'}
      ],
      iconDisplay: ['loading', 'check', 'close']
    }
  },
  computed: {
    rowSelectionC() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectC = selectedRows
          this.initExecutionList()
        },
        columnWidth: 36,
        getCheckboxProps: record => ({
          props: {
            disabled: record.disabled, // Column configuration not to be checked
            name: record.key,
          },
        }),
      };
    },
    rowSelectionF() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectF = selectedRows
          this.initExecutionList()
        },
        columnWidth: 36,
        getCheckboxProps: record => ({
          props: {
            disabled: record.disabled, // Column configuration not to be checked
            name: record.key,
          },
        }),
      }
    },
    addType() {
      let obj = {}
      if (this.addMode == 'command') obj.name = '命令'
      if (this.addMode == 'folder') obj.name = '文件夹'
      if (this.opation == 'add') obj.opation = '添加'
      if (this.opation == 'edit') obj.opation = '编辑'
      return obj
    }
  },
  methods: {
    // 获取数据
    getData() {
      this.$electron.ipcRenderer.send('getData')
      this.$electron.ipcRenderer.on('gtDataSuccess', (event, data) => {
        this.commandList = JSON.parse(data).commandList
        this.folderList = JSON.parse(data).folderList
      })
      this.$electron.ipcRenderer.on('setDataErr', () => {
        this.$message.error('失败')
      })
      this.$electron.ipcRenderer.on('setDataSuccess', (event, data) => {
        this.$message.success('成功')
        this.cancel()
      })
    },

    // 执行命令
    execution() {
      if (this.executionList.length) {
        this.executioningLength = this.executionList.length
        this.setDisabled(true)
        this.executionList.forEach(item => {
          item.status = 'loading'
          this.$electron.ipcRenderer.send('cmd', item)
        })
      } else {
        this.$message.error('执行列表为空')
      }
    },

    // 设置禁止勾选
    setDisabled(bl) {
      let list = [...this.commandList, ...this.folderList]
      list.forEach(item => {
        if (bl) {
          this.$set(item, 'disabled', true)
        } else {
          this.$delete(item, 'disabled')
        }
      })
    },

    // 添加命令or文件夹
    showModal(type, opation, item = {}) {
      this.addMode = type
      this.opation = opation
      this.editItem = item
      this.modalVisible = true
    },

    // 删除命令or文件夹
    delItem(type, record) {
      let _this = this, text
      if (type === 'command') text = '命令'
      if (type === 'folder') text = '文件夹'
      this.$confirm({
        title: `确认删除${text}【${record.content}】吗`,
        onOk() {
          let list = []
          if (type === 'command') list = _this.commandList
          if (type === 'folder') list = _this.folderList
          let index = list.findIndex(item => item.key === record.key)
          list.splice(index, 1)
          _this.$electron.ipcRenderer.send('setData', JSON.stringify({commandList: _this.commandList, folderList: _this.folderList}))
        }
      })
    },

    // 设置命令or文件夹
    setData(data) {
      let list = []
      if (data.type == 'folder') list = this.folderList
      if (data.type == 'command') list = this.commandList
      if (data.opation == 'add') {
        if(list.some(o => o.key == data.item.key)) {
          this.$refs.add.form.setFields({
            key: {
              value: data.item.key,
              errors: [new Error("名称重复")],
            },
          })
        } else {
          list.push(data.item)
          this.$electron.ipcRenderer.send('setData', JSON.stringify({commandList: this.commandList, folderList: this.folderList}))
        }
      } else if(data.opation == 'edit') {
        let editItem = list.filter(o => o.key === data.item.key)[0]
        editItem.content = data.item.content
        this.$electron.ipcRenderer.send('setData', JSON.stringify({commandList: this.commandList, folderList: this.folderList}))
      }
    },

    // 执行列表
    initExecutionList() {
      let CL = this.selectC.length
      let FL = this.selectF.length
      let length =  CL * FL
      let arr = []
      for (let i = 0; i < length; i++) {
        let CITEM = this.selectC[i % CL]
        let FITEM = this.selectF[parseInt(i / CL)]
        arr.push({key: CITEM.key + FITEM.key + i, command: CITEM.content, position: FITEM.content, status: 'wait' })
      }
      this.executionList = [...arr]
    },

    // 取消添加
    cancel() {
      this.addMode = null
      this.opation = null
      this.editItem = {}
      this.modalVisible = false
    }
  },
  mounted() {
    this.getData()
    this.$electron.ipcRenderer.on('over', (event, data) => { // 监听窗口非正常关闭退出登录
      this.executioningLength--
      if (this.executioningLength == 0) this.setDisabled(false) // 命令&文件夹可勾选
      this.executionList.filter(item => item.key == data.title)[0].status = data.code == 0 ? 'success' : 'error'
    })
  }
}
</script>

<style lang="less" scoped>
.pd1{
  padding: 0;
}
.layout{
  height: 100%;
  .wrapper{
    padding: 10px;
    display: flex;
    /deep/ .ant-table-small{
      border: 0;
      .ant-table-body{
        margin: 0;
      }
    }
    .execution-list{
      flex: 1;
      margin: 0 10px;
      .loading{
        color: #1890ff;
      }
      .success{
        color: #52c41a;
      }
      .error{
        color: #f5222d;
      }
    }
    .commands, .execution-list, .folder{
      display: flex;
      flex-direction: column;
      /deep/ .ant-card-head{
        height: 48px;
      }
      /deep/ .ant-card-body{
        flex: 1;
        overflow: hidden;
        .pd1;
        .ant-table-wrapper, .ant-spin-nested-loading, .ant-spin-container, .ant-table:not(.ant-table-empty), .ant-table-content, {
          height: 100%;
          .ant-table-scroll{
            height: 100%;
            display: flex;
            flex-direction: column;
            .ant-table-body{
              flex: 1;
              overflow-y: auto!important;
            }
          }
        }
        .ant-table-header{
          background-color: #fafafa;
        }
      }
      /deep/ .ant-card-extra{
        padding: 12px 0;
      }
    }
    .commands, .folder{
      width: 300px;
    }
  }
}
</style>>