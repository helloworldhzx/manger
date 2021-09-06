<template>
  <div class="user-wrapper">
    <div class="query-form">
      <el-form ref="queryFormRef" :inline="true" :model="queryForm">
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="queryForm.userId"
            placeholder="请输入用户ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input
            v-model="queryForm.userName"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="queryForm.state">
            <el-option
              v-for="(val, key) in userState"
              :label="val"
              :value="Number(key)"
            ></el-option>
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
        <el-button type="primary" @click="handleAdd" v-has="'user-add'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handlePatchDel"
          v-has="'user-batch-delete'"
          >批量删除</el-button
        >
      </div>
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
              v-has="'user-edit'"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDel([scope.row.userId])"
              v-has="'user-delete'"
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
      >
      </el-pagination>
    </div>
    <el-dialog title="用户新增" v-model="dialogVisible" @close="dialogClose">
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :label-width="100"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            :disabled="action === 'edit'"
            v-model="dialogForm.userName"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            :disabled="action === 'edit'"
            v-model="dialogForm.userEmail"
            placeholder="请输入邮箱"
          >
            <template #append>@zz.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="dialogForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="dialogForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="dialogForm.state">
            <el-option
              v-for="(val, key) in userState"
              :value="Number(key)"
              :label="val"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            multiple
            v-model="dialogForm.roleList"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in roleData"
              :key="item._id"
              :value="item._id"
              :label="item.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="dialogForm.deptId"
            :options="deptData"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
          ></el-cascader>
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
import { getCurrentInstance, reactive, ref, onMounted } from "vue";
import utils from "./../utils/utils";
import dict from "../utils/dict";
export default {
  name: "user",
  setup() {
    // ctx 生产环境是获取不到全局属性 如$api (我这开发时就获取不到) 使用proxy获取
    const { proxy } = getCurrentInstance();

    // 搜索
    const queryForm = reactive({ state: 0 });
    const handleSearch = () => {
      getUserList();
    };
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };

    // 表格
    const tableData = ref([]);
    const pager = reactive({ pageSize: 10, pageNum: 1, total: 0 });
    const checkedUserIds = ref([]);
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return dict.userType[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return dict.userState[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
        width: 180,
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        width: 180,
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
    ]);
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入邮箱",
          trigger: "blur",
        },
      ],
      mobile: [
        {
          pattern: /^1\d{10}$/,
          message: "手机号格式有误",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          type: "array",
          required: true,
          message: "请选择部门",
        },
      ],
    });
    const getUserList = () => {
      const params = { ...queryForm, ...pager };
      proxy.$api.getUserList(params).then((res) => {
        const { list, page } = res;
        tableData.value = list;
        pager.total = page.total;
      });
    };
    const handleAdd = () => {
      action.value = "add";
      dialogVisible.value = true;
    };
    const handleEdit = (row) => {
      dialogVisible.value = true;
      action.value = "edit";
      proxy.$nextTick(() => {
        Object.assign(dialogForm, row);
      });
    };
    const handleDel = async (userIds) => {
      await proxy.$api.userDel({ userIds });
      proxy.$message.success("删除成功");
      getUserList();
    };
    const handlePatchDel = () => {
      if (checkedUserIds.value.length === 0) {
        proxy.$message.error("请选择要删除的数据");
        return;
      }
      handleDel(checkedUserIds.value);
    };
    const handleSelectionChange = (list) => {
      const arr = list.map((item) => item.userId);
      checkedUserIds.value = arr;
    };
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };

    // 弹框
    const dialogForm = reactive({ state: 3 });
    const roleData = ref([]);
    const deptData = ref([]);
    const dialogVisible = ref(false);
    const action = ref("add");
    const getAllRoleList = () => {
      proxy.$api.getAllRoleList().then((res) => {
        roleData.value = res;
      });
    };
    const getDeptList = () => {
      proxy.$api.getDeptList().then((res) => {
        deptData.value = res;
      });
    };

    const handleClose = () => {
      dialogVisible.value = false;
    };
    const dialogClose = () => {
      handleReset("dialogFormRef");
    };
    const handleSubmit = () => {
      proxy.$refs.dialogFormRef.validate(async (valid) => {
        if (valid) {
          const params = { ...dialogForm };
          params.action = action.value;
          params.userEmail += "@zz.com";
          await proxy.$api.userSubmit(params);
          dialogVisible.value = false;
          proxy.$message.success("添加成功");
          getUserList();
        }
      });
    };

    onMounted(() => {
      getUserList();
      getAllRoleList();
      getDeptList();
    });
    return {
      userType: dict.userType,
      userState: dict.userState,
      queryForm,
      columns,
      tableData,
      pager,
      dialogVisible,
      dialogForm,
      rules,
      deptData,
      roleData,
      action,
      handleReset,
      handleSearch,
      handleAdd,
      handleSubmit,
      handleClose,
      handleEdit,
      dialogClose,
      handleDel,
      handleSelectionChange,
      handlePatchDel,
      handleCurrentChange,
    };
  },
};
</script>

<style scoped lang='scss'>
</style>
