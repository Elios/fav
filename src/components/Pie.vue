<template>
  <div class="container-pie">
    <div class="pie"></div>
    <div class="legend"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Pie',
  props: {
    margin: {
      default () {
        return {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      }
    },
    color: {
      default () {
        return ['#9966FF', '#6666FF', '#6699FF', '#66FF99', '#DECAFB', '#FF9966', '#CAFEDB', '#FF6666', '#ABCDEF', '#AAAAAA']
      }
    },
    dataSet: {
      required: true
    },
    innerRadius: {
      type: Number,
      default: 0
    },
    outterRadius: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 400
    },
    width: {
      type: Number,
      default: 400
    }
  },
  data () {
    return {
      enterClockWise: {
        startAngle: 0,
        endAngle: 0
      },
      rectangle: {
        width: 40,
        height: 20
      }
    }
  },
  methods: {
    genPie () {
      const pie = d3.pie()
      const pieData = pie(this.dataSet.ratio)
      const arc = d3.arc().innerRadius(this.innerRadius).outerRadius(this.outterRadius)
      const svg = d3.select('.pie').append('svg')
        .attr('height', this.height)
        .attr('width', this.width)
      const g = svg.append('g').attr('transform', `translate(${this.margin.top},${this.margin.left})`)
      const g2 = g.append('g').attr('transform', `translate(${this.width / 2},${this.height / 2})`)
      const path = g2.selectAll('path')
        .data(pieData).enter().append('path')
        .attr('d', arc(this.enterClockWise))
        .attr('fill', (d, i) => this.color[i])
        .each((d) => {
          this._current = {
            data: d.data,
            value: d.value,
            startAngle: this.enterClockWise.startAngle,
            endAngle: this.enterClockWise.endAngle
          }
        })
      path
        .transition()
        .duration(1000)
        .ease(d3.easeBounce)
        .attrTween('d', (d) => {
          const i = d3.interpolate(this._current, d)
          this._current = i(0)
          return function (t) {
            return arc(i(t))
          }
        })

      g2.selectAll('text').data(pieData).enter()
        .append('text').attr('text-anchor', 'middle').attr('font-size', 15)
        .attr('fill', '#3a4a5a')
        .attr('font-weight', 'bold')
        .text(() => null)
        .transition()
        .duration(1000)
        .attr('transform', (d) => `translate(${arc.centroid(d)})`)
        .text((d) => d.data)
    },
    genLegend () {
      const svg = d3.select('.legend').append('svg').attr('height', this.height).attr('width', this.width)
      const g = svg.append('g').attr('transition', `translate(${this.margin.top},${this.margin.left})`)
      g.append('g').selectAll('rect')
        .data(this.dataSet.ratio)
        .enter()
        .append('rect')
        .attr('x', '0')
        .attr('y', (d, i) => {
          return i * this.rectangle.height + i * 20
        })
        .attr('rx', '5')
        .attr('ry', '5')
        .attr('height', this.rectangle.height)
        .attr('width', this.rectangle.width)
        .attr('fill', (d, i) => {
          return this.color[i]
        })
      g.append('g')
        .selectAll('text')
        .data(this.dataSet.ratio)
        .enter()
        .append('text')
        .attr('x', () => this.rectangle.width + 5)
        .attr('y', (d, i) => {
          return i * this.rectangle.height + (i + 1) * 20
        })
        .attr('dy', '-6')
        .attr('title', (d, i) => `${this.dataSet.cost[i]}  ${this.dataSet.device[i]}`)
        .text((d, i) => `${this.dataSet.cost[i]}  ${this.dataSet.device[i]}`)
    }
  },
  mounted () {
    this.genPie()
    this.genLegend()
  }

}
</script>

<style scoped lang="less">
  @import '../less/pie';
</style>
