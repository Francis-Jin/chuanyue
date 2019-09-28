// import {Promise} from 'es6-promise'
import axios from 'axios'

const instance = axios.create({
  // baseURL: 'http://cy.zhiyanginfo.top/chuanyue', // 正式环境
  // baseURL: 'http://tellsea.natapp1.cc/chuanyue', // 本地环境
  // baseURL: 'http://houtan.zhiyanginfo.top/chuanyue/', // 测试服环境
  // baseURL: 'http://hidkee.4kb.cn/chuanyue/', // 测试服环境
  baseURL: '/api', // 测试服环境
  timeout: 60000, // 请求超时设置
  headers: {'Accept': 'application/json'}
})

// 测试例子
export const upload = params => {
  return instance.get(`/xxx/xxx`, params)
}

// 获取短信验证码
export const sendSmsCode = params => {
  return instance.post(`/app/smsCode/sendSmsCode.action?` + params)
}

// 微信支付
export const wxPayApi = params => {
  return instance.post(`/app/orderInfo/payFee.action?` + params)
}
// 微信支付
// export const wxPayApi = (url, params) => {
//   return instance.post(url, params)
// }

// 获取签名
export const getJsSingle = params => {
  return instance.get(`/getJsSingle.action?` + params)
}

/** 文件上传. */
export const uploadFile = params => {
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  instance.headers = config
  return instance.post('/app/fileUpload/uploadCors.action', params)
}

// 获取openid
export const getOIDApi = params => {
  return instance.get(`/oauth20/getOID.action?` + params)
}

// 获取最新资讯和好文推荐
export const getHotArticle = params => {
  return instance.post('app/newsInfo/list.action?' + params)
}

// 获取最新资讯和好文推荐的详情
export const getHotArticleDetails = params => {
  return instance.get('app/newsInfo/detail.action?' + params)
}

// 获取轮播图
export const getBannerLists = params => {
  return instance.get('/app/adsInfo/list.action', params)
}

// 获取轮播图自定义详情
export const getBannerCustomDetailsApi = params => {
  return instance.get('/app/adsInfo/get.action?' + params)
}

// 获取机构列表
export const getMechanismLists = params => {
  return instance.get('/app/publicData/listTrainingSchoolIdAndNameAll.action', params)
}

// 获取机构详情
export const getInstitutionalDetailsApi = params => {
  return instance.get('/app/trainingSchool/getTrainingSchoolByApp.action?' + params)
}

// 教师认证
export const teacherLogin = params => {
  return instance.post('/app/teacherLogin.action?' + params)
}

// 家长认证
export const parentLogin = params => {
  return instance.post('/app/parentLogin.action?' + params)
}

// 普通用户认证
export const userLogin = params => {
  return instance.post('/app/userLogin.action?' + params)
}

// 获取验证码
export const getPhoneCodeApi = params => {
  return instance.post('/app/sendSmsCode.action?' + params)
}

// 获取批改详情
export const getCorrectionDetailsApi = params => {
  return instance.get('/app/uploadBatch/getUploadBatch.action?' + params)
}

// 班级作品上传
export const getCorrectionUploadApi = params => {
  return instance.get('/app/uploadBatch/getUploadBatchByUpload.action?' + params)
}

// 获取批改列表
export const getCorrectionListsApi = params => {
  return instance.post('/app/uploadBatch/listUploadBatch.action?' + params)
}

// 获取上传列表
export const getUploadListsApi = params => {
  return instance.post('/app/uploadBatch/listUploadBatchByUpload.action?' + params)
}

// 根据班级id查询学生
export const getStudentsListsApi = params => {
  return instance.get('/app/classInfo/listStudentInfoByClassId.action?' + params)
}

// 新增上传批次
export const uploadBatchApi = params => {
  return instance.post('/app/uploadBatch/saveUploadBatch.action?' + params)
}

// 获取当前用户信息
export const getUrserInfoApi = params => {
  return instance.get('/app/userInfo/getUserInfoByOpenId.action?' + params)
}

// 更新用户头像
export const upDateHeadPortraitApi = params => {
  return instance.post('/app/userInfo/updateUserInfoPhotoUrl.action?' + params)
}

// 获取所有班级
export const getAllClassNameApi = params => {
  return instance.get('/app/publicData/listClassInfoIdAndName.action?' + params)
}

// 根据年级和机构查班级
export const getConditionClassApi = params => {
  return instance.get('/app/publicData/listClassByTrainingId.action?' + params)
}

// 获取所有年级
export const getAllGradeApi = params => {
  return instance.get('/app/publicData/listDimGrade.action?' + params)
}

// 根据openid获取对应所有班级
export const getOpenIdAllClassNameApi = params => {
  return instance.post('/app/classInfo/listClassInfoByApp.action?' + params)
}

// 获取学员管理列表
export const getAdminStudentListsApi = params => {
  return instance.get('/app/studentInfo/listStudentInfoByApp.action?' + params)
}

// 获取批次号列表
export const getBatchListsApi = params => {
  return instance.get('/app/uploadBatch/listUploadBatchByUserId.action?' + params)
}

// 新增作品
export const additionalWorksApi = params => {
  return instance.post('/app/schoolworkInfo/saveSchoolworkInfo.action?' + params)
}

// 批改报告
export const getCorrectionReportListsApi = params => {
  return instance.post('/app/schoolworkInfo/listSchoolworkInfoByUserId.action?' + params)
}

// 家长添加学生
export const parentAddChildrenApi = params => {
  return instance.post('/app/mapUserStudent/saveMapUserStudent.action?' + params)
}

// 普通家长添加学生
export const ordinaryParentAddChildrenApi = params => {
  return instance.post('/app/mapUserStudent/saveMapUserStudentGeneral.action?' + params)
}

// 机构家长学生详情
export const parentGetChildrenDetailsApi = params => {
  return instance.get('/app/studentInfo/listStudentInfoByUserId.action?' + params)
}

// // 普通家长学生详情
// export const simpleParentGetChildrenDetailsApi = params => {
//   return instance.get('/app/studentInfo/listStudentInfoBySimpleUserId.action?' + params)
// }

// 获取商品列表
export const getGoodsListsApi = params => {
  return instance.get('/app/productInfo/listProductInfoByApp.action?' + params)
}

// 获取商品详情
export const getGoodsDetailsApi = params => {
  return instance.get('/app/productInfo/getProductInfoByApp.action?' + params)
}

// 获取套餐详情
export const getPackageDetailsApi = params => {
  return instance.get('/app/productInfo/getProductPackageByApp.action?' + params)
}

// 加入购物车
export const addCartApi = params => {
  return instance.post('/app/shoppingCart/saveShoppingCart.action?' + params)
}

// 查看购物车
export const getCartListsApi = params => {
  return instance.post('/app/shoppingCart/listShoppingCartByApp.action?' + params)
}

// 删除购物车商品
export const deleteCartGoodsApi = params => {
  return instance.get('/app/shoppingCart/deleteShoppingCart.action?' + params)
}

// 更新购物车商品数量
export const updateCartGoodsQuantityApi = params => {
  return instance.post('/app/shoppingCart/updateQuantity.action?' + params)
}

// 家长删除学员
export const deleteStudentApi = params => {
  return instance.post('/app/mapUserStudent/deleteMapUserStudent.action?' + params)
}

// 获取上传剩余次数
export const getSurplusNumApi = params => {
  return instance.post('/app/userCorrectTimes/getCorrectTimes.action?' + params)
}

// 提交订单
export const submitOrderApi = params => {
  return instance.post('/app/orderDetailInfo/saveOrderDetail.action?' + params)
}

// 所有订单状态
export const getAllOrderStatusApi = params => {
  return instance.get('/app/publicData/listdimOrderStatus.action?' + params)
}

// 获取订单列表
export const getOrderListsApi = params => {
  return instance.get('/app/orderInfo/listOrderInfoByApp.action?' + params)
}

// 获取订单详情
export const getOrderDetailsApi = params => {
  return instance.get('/app/orderInfo/getProductInfoByOrderId.action?' + params)
}

// 判断用户是否认证
export const getAuthenticationStatusApi = params => {
  return instance.get('/app/userInfo/cheackAuth.action?' + params)
}

// 获取新闻类型
export const getNewsStatusApi = params => {
  return instance.get('/app/publicData/listDimNewsType.action?' + params)
}

// 获取单条作业详情
export const getcorrectionDetailsInfoApi = params => {
  return instance.get('/app/schoolworkInfo/getSchoolworkCorrectVoBySchoolworkId.action?' + params)
}

// 获取同步輔導試卷详情
export const getSynchronizationDetailsApi = params => {
  return instance.get('/app/schoolworkInfo/getSchoolworkSynchronization.action?' + params)
}

// 用户结果查询
// export const getSearchResultApi = params => {
//   return instance.get('/app/schoolworkInfo/getSchoolworkInfoBySimpleUserId.action?' + params)
// }

// 用户结果查询
export const getSearchResultApi = params => {
  return instance.post('/app/schoolworkInfo/listSchoolworkInfoByUserId.action?' + params)
}

// 余量查询
export const getAllowanceApi = params => {
  return instance.get('/app/userCorrectTimes/getCorrectTimesByUserId.action?' + params)
}

// 系统客服
export const getSystemMessageApi = params => {
  return instance.get('/app/sysConf/getSysConfByApp.action?' + params)
}

// 修改个人资料
export const editMyDataApi = params => {
  return instance.post('/app/userInfo/udpateUserInfoByApp.action?' + params)
}

// 获取购物车总数量
export const getCartShopAllQuantityApi = params => {
  return instance.get('/app/shoppingCart/countTotal.action?' + params)
}

// 判断试卷是否有效
export const countSchoolworkInfoExistApi = params => {
  return instance.post('/app/schoolworkInfo/countSchoolworkInfoExist.action?' + params)
}
