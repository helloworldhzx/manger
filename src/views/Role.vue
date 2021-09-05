<template>
  <div class="role-wrapper">
    <div class="query-form">
      <el-form ref="queryFormRef" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('queryFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column
          v-for="item in columns"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="handlePermission(scope.row)"
              >设置权限</el-button
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
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog title="角色新增" v-model="dialogVisible" @close="dialogClose">
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :label-width="100"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="dialogForm.roleName"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="dialogForm.remark"
            placeholder="请输入备注"
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
    <el-dialog title="设置权限" v-model="permissionVisible">
      <el-form ref="permissionFormRef" :label-width="100">
        <el-form-item label="角色名称">
          {{ curRow.roleName }}
        </el-form-item>
        <el-form-item label="备注">
          <el-tree
            ref="permissionTree"
            default-expand-all
            node-key="_id"
            :data="menuList"
            show-checkbox
            :props="{ label: 'menuName' }"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import utils from "../utils/utils";
export default {
  name: "role",
  data() {
    return {
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",
          width: 200,
          formatter: (row, column, value) => {
            let names = [];
            let list = value.halfCheckedKeys || [];
            list.map((key) => {
              let name = this.menuMap[key];
              if (key && name) names.push(name);
            });
            return names.join(",");
          },
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色角色名称",
          },
        ],
      },
      action: "add",
      tableData: [],
      menuList: [],
      menuMap: {}, // 菜单映射表
      dialogVisible: false,
      permissionVisible: false,
      curRow: {}, // 选中设置的角色
      queryForm: {},
      dialogForm: {},
      pager: { pageSize: 10, total: 0, pageNum: 1 },
    };
  },
  mounted() {
    console.log(this.pager);
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    async getRoleList() {
      const params = { ...this.queryForm, ...this.pager };
      const { list, page } = await this.$api.getRoleList(params);
      this.tableData = list;
      this.pager.total = page.total;
    },
    async getMenuList() {
      const res = await this.$api.getMenuList();
      const menuMap = {};
      this.getMenuMap(res, menuMap);
      this.menuList = res;
      this.menuMap = menuMap;
    },
    getMenuMap(list, menuMap) {
      list.forEach((item) => {
        if (item.action) {
          menuMap[item._id] = item.menuName;
        } else if (item.children && item.children.length > 0) {
          this.getMenuMap(item.children, menuMap);
        }
      });
    },
    handleAdd() {
      this.dialogVisible = true;
      this.action = "add";
    },
    handlePermission({ roleName, _id, permissionList }) {
      this.permissionVisible = true;
      this.curRow = { roleName, _id };
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys(permissionList.checkedKeys);
      });
    },
    handleCurrentChange(current) {
      this.pager.pageNum = current;
      this.getRoleList();
    },
    handleEdit(row) {
      this.dialogVisible = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.dialogForm, row);
      });
    },
    async handleDel(_id) {
      await this.$api.roleSubmit({ _id, action: "delet" });
      this.$message.success("删除成功");
      this.getRoleList();
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
    handleSubmit() {
      this.$refs.dialogFormRef.validate(async (valid) => {
        if (valid) {
          const params = { ...this.dialogForm };
          params.action = this.action;
          await this.$api.roleSubmit(params);
          this.dialogVisible = false;
          this.$message.success("添加成功");
          this.getRoleList();
        }
      });
    },
    async handlePermissionSubmit() {
      const checkedNode = this.$refs.permissionTree.getCheckedNodes();
      const halfCheckedKeys = this.$refs.permissionTree.getHalfCheckedKeys();
      const checkedKeys = [];
      const parentKeys = [];
      if (checkedNode.length > 0) {
        checkedNode.forEach((item) => {
          if (!item.action) {
            checkedKeys.push(item._id);
          } else {
            parentKeys.push(item._id);
          }
        });
      }
      const params = {
        _id: this.curRow._id,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: halfCheckedKeys.concat(parentKeys),
        },
      };
      await this.$api.updatePermission(params);
      this.$message.success("设置成功");
      this.permissionVisible = false;
      this.getRoleList();
    },
  },
};
</script>

<style scoped lang='scss'>
</style>
