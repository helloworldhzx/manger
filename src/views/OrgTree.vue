<template>
  <vue2-org-tree
    horizontal
    :data="data"
    collapsable
    @onExpand="onExpand"
    @onNodeClick="onNodeClick"
    @onNodeDrop="onNodeDrop"
    labelClassName="bg-orange"
    labelWidth="120px"
  ></vue2-org-tree>
</template>

<script>
export default {
  name: "orgTree",
  data() {
    return {
      data: {
        id: 0,
        label: "XXX科技有限公司",
        expand: true,
        children: [
          {
            id: 2,
            label: "产品研发部",
            expand: true,
            children: [
              {
                id: 5,
                label: "研发-前端",
              },
              {
                id: 6,
                label: "研发-后端",
              },
              {
                id: 9,
                label: "UI设计",
              },
              {
                id: 10,
                label: "产品经理",
              },
            ],
          },
          {
            id: 3,
            label: "销售部",
            expand: true,
            children: [
              {
                id: 7,
                label: "销售一部",
              },
              {
                id: 8,
                label: "销售二部",
              },
            ],
          },
          {
            id: 4,
            label: "财务部",
          },
          {
            id: 9,
            label: "HR人事",
          },
        ],
      },
    };
  },
  methods: {
    onExpand(e, data) {
      console.log(data, e);
    },
    onNodeClick(e, data) {
      console.log(data, e);
    },
    onNodeDrop(e, drop, data) {
      console.log(data, drop, e);
    },
  },
};
</script>

<style>
.bg-orange {
  background: orange;
}
</style>