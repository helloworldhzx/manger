<template>
  <template v-for="item in list">
    <el-sub-menu
      v-if="item.children && item.children.length > 0 && item.children[0].menuType == 1"
      :key="item._id"
      :index="item.path"
    >
      <template #title>
        <i :class="item.icon"></i>
        <span>{{ item.menuName }}</span>
      </template>
      <tree-menu :list="item.children" />
    </el-sub-menu>
    <el-menu-item
      v-else-if="item.menuType == 1"
      :key="item._id"
      :index="item.path"
    >
      {{ item.menuName }}
    </el-menu-item>
  </template>
</template>

<script>
export default {
  name: "TreeMenu",
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  }
};
</script>

<style>
</style>