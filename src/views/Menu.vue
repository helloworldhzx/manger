<template>
  <div class="user-wrapper">
    <div class="query-form">
      <el-form ref="queryFormRef" :inline="true" :model="queryForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryForm.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset('queryFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">新增</el-button>
      </div>
      <el-table :data="tableData" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template #default="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleAdd(2, scope.row)"
              >新增</el-button
            >
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
    <el-dialog title="菜单新增" v-model="dialogVisible" @close="dialogClose">
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :label-width="100"
        :rules="rules"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="dialogForm.parentId"
            :options="tableData"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          ></el-cascader>
          <span>不选则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="dialogForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="dialogForm.menuName"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-show="dialogForm.menuType == 1"
        >
          <el-input v-model="dialogForm.icon" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="path"
          v-show="dialogForm.menuType == 1"
        >
          <el-input v-model="dialogForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="menuCode"
          v-show="dialogForm.menuType == 2"
        >
          <el-input
            v-model="dialogForm.menuCode"
            placeholder="请输入权限标识"
          />
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-show="dialogForm.menuType == 1"
        >
          <el-input
            v-model="dialogForm.component"
            placeholder="请输入组件路径"
          />
        </el-form-item>
        <el-form-item
          label="菜单状态"
          prop="menuState"
          v-show="dialogForm.menuType == 1"
        >
          <el-radio-group v-model="dialogForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
  name: "menu",
  data() {
    return {
      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
          width: 150,
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "菜单类型",
          prop: "menuType",
          formatter(row, column, value) {
            return {
              1: "菜单",
              2: "按钮",
            }[value];
          },
        },
        {
          label: "权限标识",
          prop: "menuCode",
        },
        {
          label: "路由地址",
          prop: "path",
        },
        {
          label: "组件路径",
          prop: "component",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          width: 90,
          formatter(row, column, value) {
            return {
              1: "正常",
              2: "停用",
            }[value];
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
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在2-8个字符",
            trigger: "blur",
          },
        ],
      },
      action: "add",
      tableData: [],
      dialogVisible: false,
      queryForm: { menuState: 1 },
      dialogForm: { menuType: 1, menuState: 1 },
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    async getMenuList() {
      const res = await this.$api.getMenuList(this.queryForm);
      this.tableData = res;
    },
    handleAdd(type, row) {
      this.dialogVisible = true;
      this.action = "add";
      console.log(row);
      if (type === 2) {
        this.$nextTick(() => {
          this.dialogForm.parentId = [...row.parentId, row._id].filter(
            (item) => item
          );
        });
      }
    },
    handleEdit(row) {
      this.dialogVisible = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.dialogForm, row);
      });
    },
    async handleDel(_id) {
      await this.$api.menuSubmit({ _id, action: "delet" });
      this.$message.success("删除成功");
      this.getMenuList();
    },
    handleSearch() {
      this.getMenuList();
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
          await this.$api.menuSubmit(params);
          this.dialogVisible = false;
          this.$message.success("添加成功");
          this.getMenuList();
        }
      });
    },
  },
};
</script>

<style scoped lang='scss'>
</style>
