<template>
  <div class="user-wrapper">
    <div class="query-form">
      <el-form ref="queryFormRef" :inline="true" :model="queryForm">
        <!-- <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option label="所有" value=""></el-option>
            <el-option label="待审批" :value="1"></el-option>
            <el-option label="审批中" :value="2"></el-option>
            <el-option label="审批拒绝" :value="3"></el-option>
            <el-option label="审批通过" :value="4"></el-option>
            <el-option label="作废" :value="5"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset('queryFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
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
            <el-button
              size="mini"
              @click="handleDetail(scope.row)"
              v-show="
                scope.row.curAuditUserName == userInfo.userName &&
                [1, 2].includes(scope.row.applyState)
              "
              >审批</el-button
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
    <apply-dialog
      :visible="detailVisible"
      :detailClose="detailClose"
      :detail="detail"
      type="approve"
      v-on:handleApprove="handleApprove"
    ></apply-dialog>
  </div>
</template>
<script>
import { getCurrentInstance, reactive, ref, onMounted } from "vue";
import utils from "../utils/utils";
import applyDialog from "../components/applyDialog.vue";
import dict from "../utils/dict";
export default {
  name: "approve",
  components: {
    applyDialog,
  },
  setup() {
    // ctx 生产环境是获取不到全局属性 如$api (我这开发时就获取不到) 使用proxy获取
    const { proxy } = getCurrentInstance();
    const userInfo = proxy.$store.state.userInfo;
    // 搜索
    const queryForm = reactive({});
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
        label: "申请人",
        prop: "userName",
        formatter(row) {
          return row.applyUser.userName;
        },
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
          return {
            1: "事假",
            2: "调休",
            3: "年假",
          }[value];
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
          return {
            1: "待审批",
            2: "审批中",
            3: "审批拒绝",
            4: "审批通过",
            5: "作废",
          }[value];
        },
      },
    ]);

    const getLeaveList = () => {
      const params = { ...queryForm, ...pager, type: "approve" };
      proxy.$api.getLeaveList(params).then((res) => {
        const { list, page } = res;
        tableData.value = list;
        pager.total = page.total;
      });
    };

    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getLeaveList();
    };

    // 查看弹框
    const detailVisible = ref(false);
    const detail = ref({});
    const detailClose = (ref) => {
      detailVisible.value = false;
      ref.resetFields();
    };
    const handleDetail = (row) => {
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
    const handleApprove = async (action, value) => {
      console.log(detail);
      await proxy.$api.leaveApprove({
        action,
        ...value,
        _id: detail.value._id,
      });
      detailVisible.value = false;
      getLeaveList();
    };
    onMounted(() => {
      getLeaveList();
    });
    return {
      userInfo,
      queryForm,
      columns,
      tableData,
      pager,
      detailVisible,
      detail,
      handleReset,
      handleSearch,
      handleCurrentChange,
      detailClose,
      handleDetail,
      handleApprove,
    };
  },
};
</script>

<style scoped lang='scss'>
</style>
