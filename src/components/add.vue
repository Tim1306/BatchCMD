<template>
  <div>
    <a-form :form="form">
    <template v-if="type === 'command'">
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="名称"
      >
        <a-input
          v-decorator="['key', { rules: [{ required: true, message: '请输入名称' }] },]"
          onkeyup="value=value.replace(/[^a-zA-z]/g,'')"
          :disabled="isEdit"
        ></a-input>
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="命令"
      >
        <a-input
          v-decorator="['content', { rules: [{ required: true, message: '请输入命令' }] },]"
        ></a-input>
      </a-form-item>
    </template>
    <template v-if="type === 'folder'">
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="名称"
      >
        <a-input
          v-decorator="['key', { rules: [{ required: true, message: '请输入名称' }] },]"
          onkeyup="value=value.replace(/[^a-zA-z]/g,'')"
          :disabled="isEdit"
        ></a-input>
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="文件夹"
      >
        <a-input-search
          v-decorator="['content', { rules: [{ required: true, message: '请输入名称' }] },]"
          @search="openDialog"
        ><a-button slot="enterButton"><a-icon type="folder" /></a-button></a-input-search>
      </a-form-item>
    </template>
    </a-form>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
export default {
  name: 'add',
  props: ['type', 'editItem'],
  data() {
    return {
      isEdit: false,
      form: this.$form.createForm(this, { name: 'form' }),
      formItemLayout,
    }
  },
  methods: {
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('success', {
            type: this.type,
            opation: this.isEdit ? 'edit' : 'add',
            item: values
          })
        }
      })
    },
    async openDialog() {
      const result = await this.$electron.remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
      })
      this.form.setFieldsValue({content: result.filePaths[0]})
    }
  },
  mounted() {
    this.isEdit = JSON.stringify(this.editItem) != '{}'
    if(this.isEdit) {
      this.form.setFieldsValue(this.editItem)
    }
  }
}
</script>

<style>

</style>