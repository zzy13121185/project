import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
 roles: ['admin','editor']    control the page roles (you can set multiple roles)
 title: 'title'               the name show in sidebar and breadcrumb (recommend set)
 icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
 noCache: true                if set true, the page will no be cached(default is false)
 affix: true                  if set true, the tag will affix in the tags-view
 breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
 activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
 }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/studentManagement',
    children: [
      {
        path: 'studentManagement',
        component: () => import('@/views/studentManagement/index'),
        name: 'studentManagement',
        meta: {
          title: '学生管理',
          icon: 'el-icon-s-custom',
          affix: true
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/index',
    name: 'Teacher',
    meta: {
      title: 'teacher',
      icon: 'el-icon-s-check'
    },
    children: [
      {
        path: 'teacher',
        component: () => import('@/views/teacher/index'),
        name: 'teacher',
        meta: { title: '老师管理' }
      }
    ]
  },
  {
    path: '/place',
    component: Layout,
    redirect: '/place/index',
    name: 'Place',
    meta: {
      title: '场地管理',
      icon: 'el-icon-school',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/place/index'),
        name: 'Index',
        meta: {
          title: '场地信息'
          // roles: ['admin']
        }
      },
      {
        path: 'room',
        component: () => import('@/views/place/room'),
        name: 'room',
        meta: {
          title: '舞室信息'
          // roles: ['admin']
        }
      },
      {
        path: 'booking',
        component: () => import('@/views/place/booking'),
        name: 'booking',
        meta: {
          title: '舞室预约'
        }
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/index',
    name: 'Course',
    meta: {
      title: 'course',
      icon: 'el-icon-reading'
    },
    children: [
      {
        path: 'course',
        component: () => import('@/views/course/index'),
        name: 'course',
        meta: { title: '课程管理' }
      }
    ]
  },
  {
    path: '/commencement',
    component: Layout,
    redirect: '/commencement/index',
    name: 'Commencement',
    meta: {
      title: 'commencement',
      icon: 'el-icon-document'
    },
    children: [
      {
        path: 'commencement',
        component: () => import('@/views/commencement/index'),
        name: 'commencement',
        meta: { title: '开课管理' }
      }
    ]
  },
  {
    path: '/recharge',
    component: Layout,
    redirect: '/recharge/index',
    name: 'Recharge',
    meta: {
      title: 'recharge',
      icon: 'el-icon-s-shop\n'
    },
    children: [
      {
        path: 'recharge',
        component: () => import('@/views/recharge/index'),
        name: 'recharge',
        meta: { title: '充值管理' }
      }
    ]
  },
  {
    path: '/deposit',
    component: Layout,
    redirect: '/deposit/index',
    name: 'Deposit',
    meta: {
      title: 'deposit',
      icon: 'el-icon-wallet'
    },
    children: [
      {
        path: 'deposit',
        component: () => import('@/views/deposit/index'),
        name: 'deposit',
        meta: { title: '提现管理' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    name: 'Order',
    meta: {
      title: 'order',
      icon: 'el-icon-s-order'
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/order/index'),
        name: 'order',
        meta: { title: '订单管理' }
      }
    ]
  },
  // {
  //   path: '/finance',
  //   component: Layout,
  //   redirect: '/finance/index',
  //   name: 'Finance',
  //   meta: {
  //     title: 'finance',
  //     icon: 'excel',
  //     roles: ['second']
  //   },
  //   children: [
  //     {
  //       path: 'finance',
  //       component: () => import('@/views/finance/index'),
  //       name: 'finance',
  //       meta: { title: '财务管理' }
  //     }
  //   ]
  // },
  // {
  //   path: '/audit',
  //   component: Layout,
  //   redirect: '/audit/index',
  //   name: 'Audit',
  //   meta: {
  //     title: 'audit',
  //     icon: 'excel',
  //     roles: ['second']
  //   },
  //   children: [
  //     {
  //       path: 'audit',
  //       component: () => import('@/views/audit/index'),
  //       name: 'audit',
  //       meta: { title: '审核管理' }
  //     }
  //   ]
  // },
  // {
  //   path: '/marketing',
  //   component: Layout,
  //   redirect: '/marketing/index',
  //   name: 'Marketing',
  //   meta: {
  //     title: 'marketing',
  //     icon: 'excel',
  //     roles: ['second']
  //   },
  //   children: [
  //     {
  //       path: 'marketing',
  //       component: () => import('@/views/marketing/index'),
  //       name: 'marketing',
  //       meta: { title: '营销管理' }
  //     }
  //   ]
  // },
  // {
  //   path: '/operation',
  //   component: Layout,
  //   redirect: '/operation/index',
  //   name: 'Operation',
  //   meta: {
  //     title: 'operation',
  //     icon: 'excel',
  //     roles: ['second']
  //   },
  //   children: [
  //     {
  //       path: 'operation',
  //       component: () => import('@/views/operation/index'),
  //       name: 'operation',
  //       meta: { title: '运营管理' }
  //     }
  //   ]
  // },
  /** when your routing map is too long, you can split it into small modules **/

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
