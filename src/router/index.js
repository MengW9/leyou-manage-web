import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

export default new Router({
  routes: [
    route("/login",'/Login',"Login"),//login路径，路由到登录组件
    {
      path:"/",//根路径，路由到Layout
      component: () => import('../pages/Layout'),
      redirect:"/index/dashboard",
      children:[//其他所有组件都是Layout的子组件
        route("/index/dashboard","/Dashboard","Dashboard"),
        route("/item/category",'/item/Category',"Category"),
        route("/item/brand",'/item/Brand',"Brand"),
        route("/item/myBrand",'/item/MyBrand',"MyBrand"),
        route("/item/list",'/item/Goods',"Goods"),
        route("/item/list2",'/item/MyGoods',"MyGoods"),
        route("/item/specification",'/item/Specification',"Specification"),
        route("/user/statistics",'/item/Statistics',"Statistics"),
        route("/trade/promotion",'/trade/Promotion',"Promotion")
      ]
    }
  ]
})
