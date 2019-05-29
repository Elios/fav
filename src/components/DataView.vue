<template>
    <div>
      <Table ref="table" height="400" :loading="loading" :columns="cols" :data="getData" @on-row-click="onRowClick" border highlight-row stripe></Table>
      <div style="float: right; margin-top: 10px">
        <Page :total="100" show-elevator @on-change="onChange"></Page>
      </div>
    </div>
</template>

<script>
import Services from '@/services/'
export default {
  name: 'DataView',
  props: {
    data: {
      required: true
    },
    columns: {
      required: true
    },
    loading: {
      default: false
    }
  },
  computed: {
    getData () {
      return this.data
    }
  },
  data () {
    return {
      cols: this.columns
    }
  },
  methods: {
    onRowClick (row) {
      this.$emit('onGettingForecast', true)
      this.$emit('setImage', row.bz)
      Services.forecast.getForecast(row)
        .then((result) => {
          this.$emit('onGettingForecast', false)
          this.$emit('onGotForecast', result.data)
        })
        .catch(() => {
          this.$emit('onGettingForecast', false)
          this.$Message.error('获取预测数据失败')
        })
    },
    onChange (pageNum) {
      this.$emit('onPageChange', pageNum)
    }
  }
}
</script>

<style scoped>
</style>
