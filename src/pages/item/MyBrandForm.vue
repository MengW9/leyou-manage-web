<template>
  <v-form v-model="valid" ref="myBrandForm">
    <v-text-field
      label="品牌名称"
      v-model="brand.name"
      :rules="[v => !!v || '品牌名称不能为空']"
      :counter="10"
      required
    />
    <v-text-field
      label="首字母"
      v-model="brand.letter"
      :rules="[v => v.length === 1 || '首字母只能是1位']"
      required
      mask="A"
    />

    <v-cascader
      url="/item/category/list"
      multiple
      required
      v-model="brand.categories"
      label="请选择商品分类"/>

    <v-layout row>
      <v-flex xs3>
        <span style="font-size: 16px; color: #444">品牌LOGO：</span>
      </v-flex>
      <v-flex>
        <v-upload
          v-model="brand.image"
          url="/upload/image"
          :multiple="false"
          :pic-width="250" :pic-height="90"
        />
      </v-flex>
    </v-layout>

    <v-layout class="my-4" row>
      <v-spacer/>
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear">重置</v-btn>
    </v-layout>
  </v-form>
</template>


<script>
  export default {
    name: "my-brand-form",
    props: {
      oldBrand: {
        type: Object
      },
      isEdit: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        valid: false, // 表单校验结果标记
        brand: {
          name: '', // 品牌名称
          letter: '', // 品牌首字母
          image: '',// 品牌logo
          categories: [], // 品牌所属的商品分类数组

        }
      }
    },
    methods: {
      submit() {
        // 提交表单
        // 1、表单校验
        if (this.$refs.myBrandForm.validate()) {
          // 2、定义一个请求参数对象，通过解构表达式来获取brand中的属性
          const {categories, letter, ...params} = this.brand;
          // 3、数据库中只要保存分类的id即可，因此我们对categories的值进行处理,只保留id，并转为字符串
          params.cids = categories.map(c => c.id).join(",");
          // 4、将字母都处理为大写
          params.letter = letter.toUpperCase();
          // 5、将数据提交到后台
          /*this.$http.post('/item/brand', this.$qs.stringify(params))
            .then(() => {
              // 6、弹出提示
              this.$emit("close");
              this.$message.success("保存成功！");

            })
            .catch(() => {
              this.$message.error("保存失败！");
            });*/


          // 将数据提交到后台
// this.$http.post('/item/brand', this.$qs.stringify(params))
          this.$http({
            method: this.isEdit ? 'put' : 'post', // 动态判断是POST还是PUT
            url: '/item/brand',
            data: this.$qs.stringify(params)
          }).then(() => {
            // 关闭窗口
            this.$emit("close");
            this.$message.success("保存成功！");
          })
            .catch(() => {
              this.$message.error("保存失败！");
            });

        }
      },
      clear() {
        // 重置表单
        this.$refs.myBrandForm.reset();
        // 需要手动清空商品分类
        this.categories = [];
      }
    },
    watch: {
      oldBrand: {// 监控oldBrand的变化
        handler(val) {
          if (val) {
            // 注意不要直接复制，否则这边的修改会影响到父组件的数据，copy属性即可
            this.brand = Object.deepCopy(val)
          } else {
            // 为空，初始化brand
            this.brand = {
              name: '',
              letter: '',
              image: '',
              categories: [],
            }
          }
        },
        deep: true
      }
    },
  }
</script>
