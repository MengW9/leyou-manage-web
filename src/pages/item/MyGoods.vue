<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="addGoods">新增商品</v-btn>
      <v-spacer/>
      <v-flex xs3>
        状态：
        <v-btn-toggle v-model="filter.saleable">
          <v-btn flat :value="2">
            全部
          </v-btn>
          <v-btn flat :value="1">
            上架
          </v-btn>
          <v-btn flat :value="0">
            下架
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      <!--搜索框，与search属性关联-->
      <v-text-field label="输入关键字搜索" v-model.lazy="filter.search" append-icon="search" hide-details/>
    </v-card-title>
    <v-divider/>
    <v-data-table
      :headers="headers"
      :items="goodsList"
      :pagination.sync="pagination"
      :total-items="totalGoods"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.title }}</td>
        <td class="text-xs-center">{{props.item.cname}}</td>
        <td class="text-xs-center">{{ props.item.bname }}</td>
        <td class="justify-center layout">
          <v-btn color="info" @click="editGoods(props.item)">编辑</v-btn>
          <v-btn color="warning">删除</v-btn>
          <v-btn icon small v-if="props.item.saleable">下架</v-btn>
          <v-btn icon v-else>上架</v-btn>
        </td>
      </template>
    </v-data-table>
    <!--弹出的对话框-->
    <v-dialog v-if="show" v-model="show" max-width="900" scrollable persistent>
      <v-card>
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '修改商品' : '新增商品'}}</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="closeForm">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="height: 600px;">
          <!-- 表单 -->
          <MyGoodsForm :oldGoods="selectedGoods" :isEdit="isEdit" :step="step" ref="goodsForm" @closeForm="closeForm"/>
        </v-card-text>
        <v-card-actions>
          <v-layout row justify-center>
            <v-flex xs2>
              <v-btn :disabled="step === 1" @click="lastStep">上一步</v-btn>
            </v-flex>
            <v-flex xs2>
              <v-btn :disabled="step === 4" color="primary" @click="nextStep">下一步</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
  // 导入自定义的表单组件
  import MyGoodsForm from './MyGoodsForm'

  export default {
    name: "my-goods",
    data() {
      return {
        filter:{
          saleable: 2, // 上架还是下架
        },
        // search: '', // 搜索过滤字段
        totalGoods: 0, // 总条数
        goodsList: [], // 当前页品牌数据
        loading: true, // 是否在加载中
        pagination: {}, // 分页信息
        headers: [
          {text: 'id', align: 'center', value: 'id'},
          {text: '标题', align: 'center', sortable: false, value: 'title'},
          {text: '商品分类', align: 'center', sortable: false, value: 'cname'},
          {text: '品牌', align: 'center', value: 'bname', sortable: false,},
          {text: '操作', align: 'center', sortable: false}
        ],
        show: false,// 控制对话框的显示
        oldGoods: {}, // 即将被编辑的商品信息
        isEdit: false, // 是否是编辑
        step:1,//子组件中的步骤线索引，默认为1
      }
    },
    mounted() { // 渲染后执行
      // 查询数据
      this.getDataFromServer();
    },
    watch: {
      filter: {// 监视搜索字段
        handler() {
          this.getDataFromServer();
        },
        deep:true
      },
      pagination: { // 监视pagination属性的变化
        deep: true, // deep为true，会监视pagination的属性及属性中的对象属性变化
        handler() {
          // 变化后的回调函数，这里我们再次调用getDataFromServer即可
          this.getDataFromServer();
        }
      },
      // search: { // 监视搜索字段
      //   handler() {
      //     this.getDataFromServer();
      //   }
      // }
    },
    methods: {
      getDataFromServer() { // 从服务的加载数的方法。
        // 发起请求
        this.$http.get("/item/spu/page", {
          params: {
            key: this.filter.search, // 搜索条件
            saleable: this.filter.saleable, // 上下架
            page: this.pagination.page,// 当前页
            rows: this.pagination.rowsPerPage,// 每页大小
          }
        }).then(resp => { // 这里使用箭头函数
          this.goodsList = resp.data.items;
          this.totalGoods = resp.data.total;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        })
      },
      addGoods() {
        // 修改标记
        this.isEdit = false;
        // 控制弹窗可见：
        this.show = true;
        // 把oldBrand变为null
        this.oldBrand = null;
      },
      editGoods(oldGoods){
        // 修改标记
        this.isEdit = true;
        // 控制弹窗可见：
        this.show = true;
        // 获取要编辑的brand
        this.oldGoods = oldGoods;
      },
      closeWindow(){
        // 重新加载数据
        this.getDataFromServer();
        // 关闭窗口
        this.show = false;
      },
      previous(){
        if(this.step > 1){
          this.step--
        }
      },
      next(){
        if(this.step < 4){
          this.step++
        }
      }
    },
    components:{
      MyGoodsForm
    }
  }
</script>

<style scoped>

</style>
