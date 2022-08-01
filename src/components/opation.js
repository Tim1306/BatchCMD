const folderColumns = [
  { title: '文件夹', dataIndex: "content", ellipsis: true},
  { title: '操作', dataIndex: "action", width: 60, scopedSlots: { customRender: 'action' } }
]

const commandColumns = [
  { title: '命令', dataIndex: "content", ellipsis: true},
  { title: '操作', dataIndex: "action", width: 60, scopedSlots: { customRender: 'action' } }
]
const executionColumns = [
  { title: '命令', dataIndex: "command", ellipsis: true},
  { title: '文件夹', dataIndex: "position", ellipsis: true },
  { title: '状态', dataIndex: "status", width: 80, scopedSlots: { customRender: 'status' } }
]

export default {
  folderColumns,
  commandColumns,
  executionColumns
}