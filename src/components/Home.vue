<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <div class="logo">
        <img src="../assets/logo.png" />
        <span>zz</span>
      </div>
      <el-menu
        :collapse="isCollapse"
        :default-active="activeMenu"
        class="nav-menu"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <tree-menu :list="menuList" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="toggle" @click="toggle">
            <i class="el-icon-s-fold"></i>
          </div>
          <breadcrumb />
        </div>
        <div class="userInfo">
          <el-badge is-dot class="notify">
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱：{{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import TreeMenu from "./TreeMenu.vue";
import Breadcrumb from "./Breadcrumb.vue";
export default {
  name: "Home",
  components: { TreeMenu, Breadcrumb },
  data() {
    return {
      isCollapse: false,
      menuList: [],
      userInfo: this.$store.state.userInfo,
      activeMenu: location.hash.slice(1),
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    getMenuList() {
      this.$api.getPermissionMenu().then(({ menuList, actionList }) => {
        this.menuList = menuList;
      });
    },
    handleLogout(value) {
      if (value === "logout") {
        this.$store.commit("saveUserInfo", "");
        this.$router.push("/login");
      }
    },
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang='scss' scoped>
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    background: #001529;
    height: 100vh;
    color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
    transition: width 0.5s;
    &.unfold {
      width: 200px;
    }
    &.fold {
      width: 64px;
    }
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        width: 32px;
        height: 32px;
        margin: 0 16px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
  }
  .content-right {
    margin-left: 200px;
    &.unfold {
      margin-left: 200px;
    }
    &.fold {
      margin-left: 64px;
    }
    .nav-top {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .toggle {
          margin-right: 10px;
          font-size: 20px;
        }
      }
      .userInfo {
        .notify {
          margin-right: 15px;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      padding: 20px;
      background: #eef0f3;
      height: calc(100vh - 50px);
      overflow: auto;
    }
  }
}
</style>
