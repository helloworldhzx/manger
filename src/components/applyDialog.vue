<template>
  <el-dialog
    title="详情"
    v-model="visible"
    @close="detailClose($refs.dialogFormRef)"
  >
    <el-steps
      v-show="!isApprove"
      :active="detail.applyState > 2 ? 3 : detail.applyState"
      align-center
    >
      <el-step title="待审批"></el-step>
      <el-step title="审批中"></el-step>
      <el-step title="审批通过/审批拒绝"></el-step>
    </el-steps>
    <el-form
      label-width="120px"
      label-suffix=":"
      :model="dialogForm"
      :rules="rules"
      ref="dialogFormRef"
    >
      <el-form-item label="休假类型" v-show="isApprove">
        <div>{{ detail.applyUser.userName }}</div>
      </el-form-item>
      <el-form-item label="休假类型">
        <div>{{ detail.applyTypeName }}</div>
      </el-form-item>
      <el-form-item label="休假时间">
        <div>{{ detail.time }}</div>
      </el-form-item>
      <el-form-item label="休假时长">
        <div>{{ detail.leaveTime }}</div>
      </el-form-item>
      <el-form-item label="休假原因">
        <div>{{ detail.reasons }}</div>
      </el-form-item>
      <el-form-item label="审批状态">
        <div>{{ detail.applyStateName }}</div>
      </el-form-item>
      <el-form-item label="审批人">
        <div>{{ detail.curAuditUserName }}</div>
      </el-form-item>
      <el-form-item v-show="isApprove" label="备注" prop="remark">
        <el-input
          type="textarea"
          :rows="3"
          v-model="dialogForm.remark"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer v-show="isApprove">
      <span class="dialog-footer">
        <el-button type="primary" @click="handleApprove('pass')"
          >审批通过</el-button
        >
        <el-button type="danger" @click="handleApprove('refuse')"
          >驳回</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "applyDialog",
  props: ["visible", "detailClose", "detail", "type"],
  emits: ["handleApprove"],
  computed: {
    isApprove() {
      return this.type === "approve";
    },
  },
  data() {
    return {
      dialogForm: {},
      rules: {
        remark: [
          {
            required: true,
            message: "请选择休假类型",
          },
        ],
      },
    };
  },
  methods: {
    handleApprove(type) {
      this.$refs.dialogFormRef.validate((valid) => {
        if (valid) {
          this.$emit("handleApprove", type, this.dialogForm);
        }
      });
    },
  },
};
</script>

<style>
</style>