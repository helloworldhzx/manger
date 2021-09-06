<template>
  <div class="user-wrapper">
    <div class="query-form">
      <el-form ref="queryFormRef" :inline="true" :model="queryForm">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option label="所有" value=""></el-option>
            <el-option label="待审批" :value="1"></el-option>
            <el-option label="审批中" :value="2"></el-option>
            <el-option label="审批拒绝" :value="3"></el-option>
            <el-option label="审批通过" :value="4"></el-option>
            <el-option label="作废" :value="5"></el-option>
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
        <el-button type="primary" @click="handleAdd" v-has="'leave-add'"
          >申请休假</el-button
        >
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
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="mini" @click="handleView(scope.row)"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDel(scope.row._id)"
              >作废</el-button
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
    <el-dialog title="申请休假" v-model="dialogVisible" @close="dialogClose">
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :label-width="100"
        :rules="rules"
      >
        <el-form-item label="休假类型" prop="applyType">
          <el-select v-model="dialogForm.applyType">
            <el-option :value="1" label="事假"></el-option>
            <el-option :value="2" label="调休"></el-option>
            <el-option :value="3" label="年假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假类型" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="dialogForm.startTime"
                  type="date"
                  placeholder="选择日期"
                  @change="(val) => handleDateChange('startTime', val)"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime">
                <el-date-picker
                  v-model="dialogForm.endTime"
                  type="date"
                  placeholder="选择日期"
                  @change="(val) => handleDateChange('endTime', val)"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" required prop="leaveTime">{{
          dialogForm.leaveTime
        }}</el-form-item>
        <el-form-item label="休假原因" prop="reasons">
          <el-input
            type="textarea"
            v-model="dialogForm.reasons"
            placeholder="请输入休假原因"
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
    <apply-dialog
      :visible="detailVisible"
      :detailClose="detailClose"
      :detail="detail"
    ></apply-dialog>
  </div>
</template>
<script>
import { getCurrentInstance, reactive, ref, onMounted } from "vue";
import utils from "../utils/utils";
import applyDialog from "../components/applyDialog.vue";
import dict from "../utils/dict";
export default {
  name: "leave",
  components: {
    applyDialog,
  },
  setup() {
    // ctx 生产环境是获取不到全局属性 如$api (我这开发时就获取不到) 使用proxy获取
    const { proxy } = getCurrentInstance();

    // 搜索
    const queryForm = reactive({ applyState: "" });
    const handleSearch = () => {
      getLeaveList();
    };
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };

    // 表格
    const tableData = ref([]);
    const pager = reactive({ pageSize: 10, pageNum: 1, total: 0 });
    const columns = reactive([
      {
        label: "单号",
        prop: "orderNo",
      },
      {
        label: "休假时间",
        prop: "",
        formatter(row) {
          return (
            utils.formateDate(new Date(row.startTime), "yyyy-MM-dd") +
            "到" +
            utils.formateDate(new Date(row.endTime), "yyyy-MM-dd")
          );
        },
      },
      {
        label: "休假时长",
        prop: "leaveTime",
      },
      {
        label: "休假类型",
        prop: "applyType",
        formatter(row, column, value) {
          return dict.applyType[value];
        },
      },
      {
        label: "休假原因",
        prop: "reasons",
      },
      {
        label: "申请时间",
        prop: "createTime",
        width: 180,
        formatter: (row, column, value) => {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "审批人",
        prop: "auditUsers",
      },
      {
        label: "当前审批人",
        prop: "curAuditUserName",
      },
      {
        label: "审批状态",
        prop: "applyState",
        formatter: (row, column, value) => {
          // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
          return dict.applyState[value];
        },
      },
    ]);

    const rules = reactive({
      applyType: [
        {
          required: true,
          message: "请选择休假类型",
        },
      ],
      startTime: [
        {
          required: true,
          message: "请选择休假类型",
        },
      ],
      endTime: [
        {
          required: true,
          message: "请选择休假类型",
        },
      ],
      reasons: [
        {
          required: true,
          message: "请选择休假类型",
        },
      ],
    });
    const getLeaveList = () => {
      const params = { ...queryForm, ...pager };
      proxy.$api.getLeaveList(params).then((res) => {
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
    const handleDel = async (_id) => {
      await proxy.$api.leaveSubmit({ _id, action: "delete" });
      proxy.$message.success("删除成功");
      getLeaveList();
    };
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getLeaveList();
    };

    // 弹框
    const dialogForm = reactive({ leaveTime: "0天" });
    const dialogVisible = ref(false);
    const action = ref("add");

    const handleDateChange = (type, value) => {
      const { startTime, endTime } = dialogForm;
      if (!startTime || !endTime) {
        return;
      }
      if (startTime > endTime) {
        proxy.$message.error("开始日期不能晚于结束日期");
        dialogForm.leaveTime = "0天";
        dialogForm[type] = "";
      } else {
        dialogForm.leaveTime =
          (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + "天";
      }
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
          await proxy.$api.leaveSubmit(params);
          dialogVisible.value = false;
          proxy.$message.success("添加成功");
          getLeaveList();
        }
      });
    };

    // 查看弹框
    const detailVisible = ref(false);
    const detail = ref({});
    const detailClose = () => {
      detailVisible.value = false;
    };
    const handleView = (row) => {
      let data = { ...row };
      data.applyTypeName = dict.applyType[data.applyType];
      data.time =
        utils.formateDate(new Date(data.startTime), "yyyy-MM-dd") +
        "到" +
        utils.formateDate(new Date(data.endTime), "yyyy-MM-dd");
      // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
      data.applyStateName = dict.applyState[data.applyState];
      detailVisible.value = true;
      detail.value = data;
    };
    onMounted(() => {
      getLeaveList();
    });
    return {
      queryForm,
      columns,
      tableData,
      pager,
      dialogVisible,
      dialogForm,
      rules,
      action,
      detailVisible,
      detail,
      handleReset,
      handleSearch,
      handleAdd,
      handleSubmit,
      handleClose,
      handleEdit,
      dialogClose,
      handleDel,
      handleCurrentChange,
      handleDateChange,
      detailClose,
      handleView,
    };
  },
};
</script>

<style scoped lang='scss'>
</style>
