<template>
  <div class="org-tree-container">
    <div class="org-tree" :class="{ horizontal, collapsable }">
      <org-tree-node
        :data="data"
        :props="props"
        :horizontal="horizontal"
        :labelWidth="labelWidth"
        :collapsable="collapsable"
        :render-content="renderContent"
        :labelClassName="labelClassName"
        :selectedClassName="selectedClassName"
        :selectedKey="selectedKey"
        @expand="(e, data) => $emit('onExpand', e, data)"
        @node-focus="(e, data) => $emit('onNodeFocus', e, data)"
        @node-click="(e, data) => $emit('onNodeClick', e, data)"
        @node-mouseover="(e, data) => $emit('onNodeMouseover', e, data)"
        @node-mouseout="(e, data) => $emit('onNodeMouseout', e, data)"
        @node-drag-start="(e, data) => onDragStart(e, data)"
        @node-drag-over="(e, data) => onDragOver(e, data)"
        @node-drop="(e, data) => onDrop(e, data)"
      />
    </div>
  </div>
</template>



<script>
import render from "./node";
import { h } from "vue";
export default {
  name: "Vue2OrgTree",
  data() {
    return {
      dragState: {
        dragg: null,
        drop: null,
      },
    };
  },
  components: {
    OrgTreeNode: {
      render: function (content) {
        return render(h, content);
      },
      inheritAttrs: false,
      functional: true,
    },
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    props: {
      type: Object,
      default: () => ({
        label: "label",
        expand: "expand",
        children: "children",
      }),
    },
    horizontal: Boolean,
    selectedKey: String,
    collapsable: Boolean,
    renderContent: Function,
    labelWidth: [String, Number],
    labelClassName: [Function, String],
    selectedClassName: [Function, String],
  },
  methods: {
    onDragStart(event, data) {
      let dragState = this.dragState;
      try {
        event.dataTransfer.setData("text/plain", "");
      } catch (e) {}
      dragState.drag = data;
    },
    onDragOver(event, data) {
      event.preventDefault();
    },
    onDrop(event, data) {
      event.preventDefault();
      let dragState = this.dragState;
      let drag = dragState.drag;
      dragState.drop = data;
      this.$emit("onNodeDrop", event, drag, data);
    },
  },
};
</script>

<style lang="scss">
.org-tree-container {
  display: inline-block;
  padding: 15px;
  background-color: #fff;
}

.org-tree {
  // display: inline-block;
  display: table;
  text-align: center;

  &:before,
  &:after {
    content: "";
    display: table;
  }

  &:after {
    clear: both;
  }
}

.org-tree-node,
.org-tree-node-children {
  position: relative;
  margin: 0;
  padding: 0;
  list-style-type: none;

  &:before,
  &:after {
    transition: all 0.35s;
  }
}
.org-tree-node-label {
  position: relative;
  display: inline-block;

  .org-tree-node-label-inner {
    padding: 10px 15px;
    text-align: center;
    border-radius: 3px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  }
}
.org-tree-node-btn {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 20px;
  height: 20px;
  z-index: 10;
  margin-left: -11px;
  margin-top: 9px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.35s ease;

  &:hover {
    background-color: #e7e8e9;
    transform: scale(1.15);
  }

  &:before,
  &:after {
    content: "";
    position: absolute;
  }

  &:before {
    top: 50%;
    left: 4px;
    right: 4px;
    height: 0;
    border-top: 1px solid #ccc;
  }

  &:after {
    top: 4px;
    left: 50%;
    bottom: 4px;
    width: 0;
    border-left: 1px solid #ccc;
  }

  &.expanded:after {
    border: none;
  }
}
.org-tree-node {
  padding-top: 20px;
  display: table-cell;
  vertical-align: top;

  &.is-leaf,
  &.collapsed {
    padding-left: 10px;
    padding-right: 10px;
  }

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 19px;
  }

  &:after {
    left: 50%;
    border-left: 1px solid #ddd;
  }

  &:not(:first-child):before,
  &:not(:last-child):after {
    border-top: 1px solid #ddd;
  }
}
.collapsable .org-tree-node.collapsed {
  padding-bottom: 30px;

  .org-tree-node-label:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    width: 50%;
    height: 20px;
    border-right: 1px solid #ddd;
  }
}
.org-tree > .org-tree-node {
  padding-top: 0;

  &:after {
    border-left: 0;
  }
}
.org-tree-node-children {
  padding-top: 20px;
  display: table;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 20px;
    border-left: 1px solid #ddd;
  }

  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.horizontal {
  .org-tree-node {
    // display: flex;
    // flex-direction: row;
    // justify-content: flex-start;
    // align-items: center;
    display: table-cell;
    float: none;
    padding-top: 0;
    padding-left: 20px;

    &.is-leaf,
    &.collapsed {
      padding-top: 10px;
      padding-bottom: 10px;
    }

    &:before,
    &:after {
      width: 19px;
      height: 50%;
    }

    &:after {
      top: 50%;
      left: 0;
      border-left: 0;
    }

    &:only-child:before {
      top: 1px;
      border-bottom: 1px solid #ddd;
    }

    &:not(:first-child):before,
    &:not(:last-child):after {
      border-top: 0;
      border-left: 1px solid #ddd;
    }

    &:not(:only-child):after {
      border-top: 1px solid #ddd;
    }

    .org-tree-node-inner {
      display: table;
    }
  }

  .org-tree-node-label {
    display: table-cell;
    vertical-align: middle;
  }

  &.collapsable .org-tree-node.collapsed {
    padding-right: 30px;

    .org-tree-node-label:after {
      top: 0;
      left: 100%;
      width: 20px;
      height: 50%;
      border-right: 0;
      border-bottom: 1px solid #ddd;
    }
  }

  .org-tree-node-btn {
    top: 50%;
    left: 100%;
    margin-top: -11px;
    margin-left: 9px;
  }

  & > .org-tree-node:only-child:before {
    border-bottom: 0;
  }

  .org-tree-node-children {
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: flex-start;
    display: table-cell;
    padding-top: 0;
    padding-left: 20px;

    &:before {
      top: 50%;
      left: 0;
      width: 20px;
      height: 0;
      border-left: 0;
      border-top: 1px solid #ddd;
    }

    &:after {
      display: none;
    }

    & > .org-tree-node {
      display: block;
    }
  }
}
</style>
