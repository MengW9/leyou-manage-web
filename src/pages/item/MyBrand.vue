<template>
  <v-card>
    <v-card-title class="layout row">
      <v-btn color="primary" @click="addBrand">
        新增品牌
      </v-btn>
      <v-spacer/>
      <v-text-field
        label="输入搜索条件"
        append-icon="search"
        single-line
        hide-details
        class="flex sm3"
        v-model="search"
      />
    </v-card-title>
    <v-divider/>
    <!--表格-->
    <v-data-table
      :headers="headers"
      :items="brands"
      :pagination.sync="pagination"
      :total-items="totalBrands"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center"><img :src="props.item.image"/></td>
        <td class="text-xs-center">{{ props.item.letter }}</td>
        <td class="justify-center layout px-0">
          <v-btn small icon class="mx-0" @click="editItem(props.item)" color="info">
            <v-icon color="success">edit</v-icon>
          </v-btn>
          <v-btn small icon class="mx-0" @click="deleteItem(props.item)" color="info">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <!--弹出的对话框-->
    <v-dialog max-width="500" v-model="show" persistent>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>新增品牌</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5">
          <!--我是表单-->
          <MyBrandForm :oldBrand="MyBrand" :isEdit="isEdit" @close="show = false" :reload="getDataFromServer"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  // 导入自定义的表单组件
  import MyBrandForm from './MyBrandForm'

  export default {
    name: "MyBrand",
    components: {
      MyBrandForm
    },
    data() {
      return {
        headers: [
          {text: "id", value: "id", align: 'center', sortable: true},
          {text: "名称", value: "name", align: 'center', sortable: false},
          {text: "LOGO", value: "image", align: 'center', sortable: false},
          {text: "首字母", value: "letter", align: 'center', sortable: false},
          {text: "操作", align: 'center', sortable: false},
        ],
        brands: [],// 当前页品牌数据
        pagination: {},// 分页信息
        totalBrands: 0,// 总条数
        loading: false,// 是否在加载中
        search: '',// 搜索过滤字段
        show: false,//控制对话框的显示
        isEdit: false, // 判断是编辑还是新增
        MyBrand: {}, // 品牌信息
      }
    },
    mounted() { // 渲染后执行
      // 查询数据
      this.getDataFromServer();

    },
    watch: {
      pagination: {// 监视pagination属性的变化
        deep: true,// deep为true，会监视pagination的属性及属性中的对象属性变化
        handler() {
          // 变化后的回调函数，这里我们再次调用getDataFromServer即可
          this.getDataFromServer();
        }
      },
      search: {// 监视搜索字段
        handler() {
          this.getDataFromServer();
        }
      }
    },
    created() {
      this.getDataFromServer();
    },
    methods: {
      getDataFromServer() {
        //发起ajax请求
        //page,rows,key,sortBy,desc
        this.$http.get("/item/brand/page", {
          params: {
            page: this.pagination.page,// 当前页
            rows: this.pagination.rowsPerPage,// 每页大小
            sortBy: this.pagination.sortBy,// 排序字段
            desc: this.pagination.descending,// 是否降序
            key: this.search // 搜索条件
          }
        }).then(resp => { // 这里使用箭头函数
          console.log(resp);
          // 将得到的数据赋值给本地属性
          this.brands = resp.data.items;
          this.totalBrands = resp.data.total;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        })
      },
      //点击增加事件
      addBrand() {
        // 控制弹窗可见：
        this.show = true;
      },
      //关闭窗口事件
      closeWindow() {
        // 关闭窗口
        this.show = false;
      }
    }
  }
</script>

<style scoped>

</style>
