import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
  // base: 'weixin',
  routes: [
    {
      path: '/',
      redirect: 'circulateIndex'
    },
    {
      path: '/author',
      name: 'author',
      meta: {
        title: '传阅身份选择'
      },
      component: resolve => require(['@/view/circulate/author'], resolve)
    },
    /* 绑定用户 */
    {
      path: '/bindUser',
      name: 'bindUser',
      meta: {
        title: '身份验证'
      },
      component: resolve => require(['@/view/circulate/bindUser'], resolve)
    },

    /* 首页 */
    {
      path: '/circulateIndex',
      name: 'circulateIndex',
      meta: {
        title: '首页'
      },
      component: resolve => require(['@/view/circulate/circulateIndex'], resolve)
    },

    {
      path: '/excellentWriting',
      name: 'excellentWriting',
      meta: {
        title: '作文精批'
      },
      component: resolve => require(['@/view/circulate/excellentWriting'], resolve)
    },
    {
      path: '/compositionCorrection',
      name: 'compositionCorrection',
      meta: {
        title: '作文批改'
      },
      component: resolve => require(['@/view/circulate/compositionCorrection'], resolve)
    },
    {
      path: '/synchronizedCounseling',
      name: 'synchronizedCounseling',
      meta: {
        title: '同步辅导'
      },
      component: resolve => require(['@/view/circulate/synchronizedCounseling'], resolve)
    },
    {
      path: '/abilityTesting',
      name: 'abilityTesting',
      meta: {
        title: '能力测试'
      },
      component: resolve => require(['@/view/circulate/abilityTesting'], resolve)
    },
    {
      path: '/resultQuery',
      name: 'resultQuery',
      meta: {
        title: '结果查询'
      },
      component: resolve => require(['@/view/circulate/resultQuery'], resolve)
    },
    {
      path: '/preferentialZone',
      name: 'preferentialZone',
      meta: {
        title: '优惠专区'
      },
      component: resolve => require(['@/view/circulate/preferentialZone'], resolve)
    },
    {
      path: '/hotDetails',
      name: 'hotDetails',
      meta: {
        title: '详情'
      },
      component: resolve => require(['@/view/circulate/hotDetails'], resolve)
    },

    /* 点击上传 */
    {
      path: '/uploadIndex',
      name: 'uploadIndex',
      component: resolve => require(['@/view/circulate/uploadIndex'], resolve)
    },
    {
      path: '/teacherUpload',
      name: 'teacherUpload',
      meta: {
        title: '作品上传'
      },
      component: resolve => require(['@/view/circulate/teacherUpload'], resolve)
    },
    {
      path: '/correctionDetails',
      name: 'correctionDetails',
      meta: {
        title: '详情'
      },
      component: resolve => require(['@/view/circulate/correctionDetails'], resolve)
    },

    {
      path: '/correctionDetailsInfo',
      name: 'correctionDetailsInfo',
      meta: {
        title: '批改详情'
      },
      component: resolve => require(['@/view/circulate/correctionDetailsInfo'], resolve)
    },

    {
      path: '/synchronizationDetails',
      name: 'synchronizationDetails',
      meta: {
        title: '批改详情'
      },
      component: resolve => require(['@/view/circulate/synchronizationDetails'], resolve)
    },

    {
      path: '/institutionalDetails',
      name: 'institutionalDetails',
      meta: {
        title: '机构详情'
      },
      component: resolve => require(['@/view/circulate/institutionalDetails'], resolve)
    },

    {
      path: '/classDetails',
      name: 'classDetails',
      meta: {
        title: '班级详情'
      },
      component: resolve => require(['@/view/circulate/classDetails'], resolve)
    },
    {
      path: '/teacherUploadStudents',
      name: 'teacherUploadStudents',
      meta: {
        title: '作品上传'
      },
      component: resolve => require(['@/view/circulate/teacherUploadStudents'], resolve)
    },
    {
      path: '/administrationClass',
      name: 'administrationClass',
      meta: {
        title: '班级管理'
      },
      component: resolve => require(['@/view/circulate/administrationClass'], resolve)
    },
    {
      path: '/uploadExcellent',
      name: 'uploadExcellent',
      meta: {
        title: '作文精批上传'
      },
      component: resolve => require(['@/view/circulate/uploadExcellent'], resolve)
    },

    /* 个人中心 */
    {
      path: '/myCenterIndex',
      name: 'myCenterIndex',
      meta: {
        title: '个人中心'
      },
      component: resolve => require(['@/view/circulate/myCenterIndex'], resolve)
    },

    {
      path: '/addChildren',
      name: 'addChildren',
      meta: {
        title: '添加学员'
      },
      component: resolve => require(['@/view/circulate/addChildren'], resolve)
    },

    {
      path: '/seayMyChilds',
      name: 'seayMyChilds',
      meta: {
        title: '查看学员'
      },
      component: resolve => require(['@/view/circulate/seayMyChilds'], resolve)
    },

    {
      path: '/myChildsLists',
      name: 'myChildsLists',
      meta: {
        title: '学员列表'
      },
      component: resolve => require(['@/view/circulate/myChildsLists'], resolve)
    },

    {
      path: '/myCart',
      name: 'myCart',
      meta: {
        title: '我的购物车'
      },
      component: resolve => require(['@/view/circulate/myCart'], resolve)
    },

    {
      path: '/submitOrder',
      name: 'submitOrder',
      meta: {
        title: '提交订单'
      },
      component: resolve => require(['@/view/circulate/submitOrder'], resolve)
    },

    {
      path: '/orderDetails',
      name: 'orderDetails',
      meta: {
        title: '订单详情'
      },
      component: resolve => require(['@/view/circulate/orderDetails'], resolve)
    },

    {
      path: '/goodsDetails',
      name: 'goodsDetails',
      meta: {
        title: '商品详情'
      },
      component: resolve => require(['@/view/circulate/goodsDetails'], resolve)
    },

    {
      path: '/packageDetails',
      name: 'packageDetails',
      meta: {
        title: '套餐详情'
      },
      component: resolve => require(['@/view/circulate/packageDetails'], resolve)
    },

    {
      path: '/myOrderLists',
      name: 'myOrderLists',
      meta: {
        title: '我的订单'
      },
      component: resolve => require(['@/view/circulate/myOrderLists'], resolve)
    },

    {
      path: '/myAddress',
      name: 'myAddress',
      meta: {
        title: '地址管理'
      },
      component: resolve => require(['@/view/circulate/myAddress'], resolve)
    },

    {
      path: '/personalData',
      name: 'personalData',
      meta: {
        title: '个人资料'
      },
      component: resolve => require(['@/view/circulate/personalData'], resolve)
    },

    {
      path: '/addAddress',
      name: 'addAddress',
      meta: {
        title: '新增地址'
      },
      component: resolve => require(['@/view/circulate/addAddress'], resolve)
    },

    {
      path: '/resultSearchPage',
      name: 'resultSearchPage',
      meta: {
        title: ''
      },
      component: resolve => require(['@/view/circulate/resultSearchPage'], resolve)
    },

    {
      path: '/remainingResult',
      name: 'remainingResult',
      meta: {
        title: '余量结果查询'
      },
      component: resolve => require(['@/view/circulate/remainingResult'], resolve)
    },

    {
      path: '*',
      name: '404',
      meta: {
        title: '404'
      },
      component: resolve => require(['@/view/404'], resolve)
    },

    {
      path: '/wx_authorization',
      name: 'wx_authorization',
      meta: {
        title: '微信授权登录中....'
      },
      component: resolve => require(['@/view/user/wx_authorization'], resolve)
    }

  ],
  mode: 'history'
})

/* eslint-disable */

router.beforeEach((to, form, next) => {
  /* 路由变化修改title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
