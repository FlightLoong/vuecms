<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索和添加用户 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border="" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">{{ scope.row.is_send }}</template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="editAddressVisible" @close="editHandleClose">
      <el-form
        ref="addressFormRef"
        :rules="addressFromRules"
        :model="editAddressForm"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="editAddressForm.address1" :options="cityData"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="提示" :visible.sync="progressVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 订单列表
      orderList: [],
      // 修改地址的弹框显示与否
      editAddressVisible: false,
      editAddressForm: {
        address1: '',
        address2: ''
      },
      addressFromRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      // 物流弹框
      progressVisible: false,
      // 物流数据
      progressInfo: []
    }
  },
  created () {
    this.getOrderlist()
  },
  methods: {
    async getOrderlist () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败!')
      }

      res.data.goods.forEach(item => {
        item.create_time = this.$dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')
      })

      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.orderList)
    },

    // 修改地址弹框关闭
    editHandleClose () {
      this.$refs.addressFormRef.resetFields()
    },

    showBox () {
      this.editAddressVisible = true
    },

    // 展示物流弹框
    async showProgressBox () {
      // const { data: res } = await this.$http.get('/kuaidi/598333152416196609')
      // console.log(res)

      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取物流进度失败！')
      // }

      this.progressVisible = true
      // this.progressInfo = res.data
      // console.log(this.progressInfo)
    },

    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderlist()
    },

    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderlist()
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}

.el-pagination {
  margin-top: 20px;
}

.el-cascader {
  width: 100%;
}
</style>
