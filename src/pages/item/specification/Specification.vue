<template>
  <v-card>
    <v-layout row>
      <!--商品分类-->
      <v-flex xs3>
        <v-card>
          <v-card-title>选择分类，查看规格参数模板：</v-card-title>
          <v-divider/>
          <v-tree url="/item/category/list"
                  :isEdit="false"
                  @handleClick="handleClick"
          />
        </v-card>
      </v-flex>
      <!--规格参数-->
      <v-flex xs9 class="px-1">
        <v-card class="elevation-0" v-show="currentNode.id">
          <v-card-title v-if="!currentNode.path">
            请先选择一个分类
          </v-card-title>
          <!--导航面包屑-->
          <v-breadcrumbs dense v-else>
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item
              v-for="(item,i) in items"
              :key="i"
            >
              <span v-if="i==2" @click="back">{{ item }}</span>
              <span v-else>{{item}}</span>
            </v-breadcrumbs-item>
          </v-breadcrumbs>
          <v-divider/>
          <v-card-text>
            <spec-group :cid="currentNode.id" v-show="showGroup" @select="chooseGroup"/>
            <span-param :group="group" v-show="!showGroup"/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
  export default {
    name: "Specification",
    methods: {
      //分类点击后的弹窗
      handleClick(node){
        if (!node.isParent){
          //把当前点击的节点记录下来
          this.currentNode=node;
          //显示规格组
          this.showGroup=true;
          //记录选中的规格组，默认为空
          this.group={};
        }
      },

    }
  }
</script>

<style scoped>

</style>
