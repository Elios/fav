<template>
  <div class="wrap-content">
    <div class="wrap-header">
      <div class="header">FORECAST AND VISUALIZATION</div>
    </div>
    <div class="wrap-input grid-align-center">
      <div class="form-area">
        <Form :label-width="80" ref="queryForm" :model="formItems">
          <FormItem label-for="hphm" label="号牌号码" prop="hphm">
            <Input type="text" v-model="formItems.hphm" element-id="hphm" placeholder="请输入号牌号码"/>
          </FormItem>
          <FormItem label="车牌颜色" prop="hpzl">
            <Select v-model="formItems.hpzl" placeholder="请选择车牌颜色">
              <Option v-for="v of ys" :value="v.key" :key="v.key">{{v.value}}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" :loading="loadingData" @click.prevent="query" shape="circle" icon="ios-search">
              <span v-if="!loadingData">查询</span>
              <span v-else>查询中....</span>
            </Button>
            <Button @click.prevent="reset" shape="circle">重置</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="wrap-img grid-align-center">
      <div v-if="!imgSrc">暂无图片</div>
      <div v-else>
        <Spin size="large" v-if="loading"></Spin>
        <img v-else :src="imgSrc" width="auto" height="280px" @click="showImg" style="cursor:pointer;">
        <Modal v-model="show" fullscreen>
          <img :src="imgSrc" alt="车辆图片">
        </Modal>
      </div>
    </div>
    <div class="wrap-display-data">
      <DataView :loading="loadingData" :data="data" :columns="columns" @onGettingForecast="onGettingForecast" @onGotForecast="onGotForecast" @onPageChange="onPageChange" @setImage="setImage"></DataView>
    </div>
    <div class="wrap-pie grid-align-center">
      <div v-if="!dataSet">暂无预测信息</div>
      <div v-else>
        <Spin size="large" v-if="loading"></Spin>
        <Pie v-else :data-set="dataSet" :inner-radius="innerRadius" :height="height" :width="width" :outter-radius="outterRadius"></Pie>
      </div>
    </div>
  </div>
</template>

<script>
import Pie from './Pie'
import DataView from './DataView'
import Services from '@/services/'

export default {
  name: 'Home',
  components: {DataView, Pie},
  data () {
    return {
      ys: [
        {
          key: '1',
          value: '黄'
        },
        {
          key: '2',
          value: '蓝'
        }
      ],
      loadingData: false,
      loading: false,
      show: false,
      innerRadius: 70,
      outterRadius: 150,
      height: 300,
      width: 300,
      imgSrc: null,
      formItems: {
        hphm: '',
        hpzl: ''
      },
      columns: [
        {
          key: 'hphm',
          align: 'center',
          renderHeader (h, params) {
            return h('span', '号牌号码')
          }
        },
        {
          title: '经过时间',
          key: 'jgsj',
          align: 'center',
          tooltip: true,
          sortable: true
        },
        {
          title: '设备名称',
          key: 'sbmc',
          align: 'center',
          tooltip: true
        },
        {
          title: '号牌颜色',
          key: 'hpys',
          align: 'center'
        }
      ],
      data: [],
      dataSet: undefined
    }
  },
  methods: {
    query () {
      if (!this.formItems.hphm || !this.formItems.hpzl) {
        this.$Message.info('请输入号牌号码和号牌颜色')
        return
      }
      this.loadingData = true
      const data = {
        hphm: this.formItems.hphm,
        hpzl: this.formItems.hpzl,
        pageNum: '1'
      }
      Services.carList.getCarList(data)
        .then((result) => {
          this.loadingData = false
          this.data = result.data.rows
        })
        .catch(() => {
          this.loadingData = false
          this.$Message.error('获取车辆信息失败')
        })
    },
    reset () {
      this.$refs['queryForm'].resetFields()
    },
    onGettingForecast (v) {
      this.loading = v
    },
    onGotForecast (v) {
      console.log(v)
      this.dataSet = v[Math.floor(Math.random() * 3)]
    },
    onPageChange (pageNum) {
      this.loadingData = true
      const data = {
        hphm: this.formItems.hphm,
        hpzl: this.formItems.hpzl,
        pageNum: pageNum
      }
      Services.carList.getCarList(data)
        .then((result) => {
          this.loadingData = false
          this.data = result.data.rows
        })
        .catch(() => {
          this.loadingData = false
          this.$Message.error('获取车辆信息失败')
        })
    },
    setImage (src) {
      this.imgSrc = src
    },
    // getCarList (data) {
    //   return this.$axios({
    //     url: 'carList',
    //     data: JSON.stringify(data),
    //     method: 'POST'
    //   })
    // },
    showImg () {
      this.show = true
    }
  }
}
</script>

<style scoped lang="less">
  @import '../less/home';
</style>
