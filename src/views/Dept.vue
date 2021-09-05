<template>
  <div class="dept-wrapper">
    <div class="query-form">
      <el-form ref="queryFormRef" :inline="true" :model="queryForm">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList">查询</el-button>
          <el-button @click="handleReset('queryFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="tableData" row-key="_id">
        <el-table-column v-for="item in columns" :key="item.prop" v-bind="item">
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="部门新增" v-model="dialogVisible" @close="dialogClose">
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :label-width="100"
        :rules="rules"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="dialogForm.parentId"
            :options="tableData"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
          ></el-cascader>
          <span>不选则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            label="请输入部门名称"
            v-model="dialogForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="userId">
          <el-select v-model="dialogForm.userId" @change="handleSelectChang">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input
            disabled
            v-model="dialogForm.userEmail"
            placeholder="请输入负责人邮箱"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import utils from "../utils/utils";
export default {
  name: "dept",
  data() {
    return {
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
        },
        {
          label: "负责人",
          prop: "userName",
        },
        {
          label: "更新时间",
          prop: "updateTime",
        },
        {
          label: "创建时间",
          prop: "createTime",
        },
      ],
      rules: {
        deptName: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
        ],
        userId: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "blur",
          },
        ],
      },
      action: "add",
      tableData: [],
      userList: [],
      dialogVisible: false,
      queryForm: {},
      dialogForm: {},
    };
  },
  mounted() {
    this.getDeptList();
    this.getAllUserList();
  },
  methods: {
    async getDeptList() {
      const res = await this.$api.getDeptList(this.queryForm);
      this.tableData = res;
    },
    async getAllUserList() {
      const res = await this.$api.getAllUserList();
      this.userList = res;
    },
    handleAdd() {
      this.dialogVisible = true;
      this.action = "add";
    },
    handleEdit(row) {
      this.dialogVisible = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.dialogForm, row);
      });
    },
    async handleDel(_id) {
      await this.$api.deptSubmit({ _id, action: "delete" });
      this.$message.success("删除成功");
      this.getDeptList();
    },
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    dialogClose() {
      this.handleReset("dialogFormRef");
    },
    handleSelectChang(value) {
      const user = this.userList.find((item) => item.userId === value);
      this.dialogForm.userEmail = user.userEmail;
      this.dialogForm.userName = user.userName;
    },
    handleSubmit() {
      this.$refs.dialogFormRef.validate(async (valid) => {
        if (valid) {
          const params = { ...this.dialogForm };
          params.action = this.action;
          await this.$api.deptSubmit(params);
          this.dialogVisible = false;
          this.$message.success("添加成功");
          this.getDeptList();
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
</style>
