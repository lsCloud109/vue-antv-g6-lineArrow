<template>
  <div class="srcIpCountBar">
    <div>
      <el-button
        type="primary"
        size="small"
        :disabled="chooseNode.id === '9'"
        @click="addItem('and')"
      >与</el-button>
      <el-button
        type="primary"
        size="small"
        :disabled="chooseNode.id === '0'"
        @click="addItem('or')"
      >或</el-button>
      <el-button
        type="primary"
        size="small"
        :disabled="chooseNode.id === '0'||chooseNode.id === '9'"
        @click="changeChildren()"
      >删除</el-button>
      <!-- <el-button
        type="primary"
        size="small"
        @click="changeModel()"
      >更新</el-button> -->
    </div>
    <!-- 规则 -->
    <div class="ruleCheck">
      <!-- <p>
        <span v-for="(item,index) in ruleList" :key="index">
          {{ '('+item + ')' }}
        </span>
      </p> -->
      <span v-if="ruleList.length === 1 &&ruleList[0].length === 2" v-html="'暂无规则'" />
      <span v-for="(item,index) in ruleList" v-else :key="index">
        {{ '(' }}
        <span v-for="(model,num) in item" :key="num">
          <span v-if="num === 0 || item.length -1 === num">
            {{ '' }}
          </span>
          <span v-else>
            {{ item.length -2 === num ? showName(model) :showName(model) + '&&' }}
          </span>
        </span>
        {{ ruleList.length - index > 1 ? ')‖' : ')' }}
      </span>
    </div>
    <!-- 规则 -->
    <div
      id="container"
      ref="container"
    />
  </div>
</template>
<script>
import G6 from '@antv/g6'
let count = 0
// 受害主机
export default {
  name: 'SrcIpCountBar',
  props: ['xdata', 'ydata', 'ydata1'],
  data () {
    return {
      bgImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAqCAYAAADbCvnoAAAABGdBTUEAALGPC/xhBQAABU9JREFUWAnNmGtsFFUUx/8z++pj2263RVpLC61QpagFChJMVYQmbVr54DtNW42VGAhY/YAG+YAfTPxgACN+EROKSvCRiIbQYoxBqQpYWqggBh+ULVDS2tJ3u+2+5nruhZ3uY/rY2ZV4ktm5j3PP+e29M+fcOxJIOlctnOdirnckhjUMLJO3RSPSosU/53363UN6bMgcxs1c58BYZSxgBIQtrdhRU9asC4jPDGPMrmfwdGOYLe0BR3XZ6el0tPpkvkxaHbFoY6lpKyOFkmO2TFP8Aw7VUV3WMkV3WLMc1hKLBoUFWVFS01Y4qkpbgxqnqPw3QJ6JMHfMnl7UUTMzVFRAkiUOloKlMMzJCAYYGQ6u36optvQiR3XpGc3OW426gUw5ecj+6idkfXQEOQ2nkVK5QfXDev9Ry6EFlpq+nKDOhrb767qB7Ju3wUgzo4w7IUkSUje9DtmafNPuKM3QwA2/j7A7QS3rICgKN1Jop24g88J7hK3+99+G4pqAHBcPU16+ap+1/wW4xtV6aEGZAko3kG94UPhQxsfg7eoUZdmaNOnX6wH7/VdgiueJKzL7nKU0U22BM6UbyHPlsnBuvutuGGxpoqwMDoi7+uN2E1QbWPsfYHwZNYSgCgOhjBo6s2qaON+KpPInYS17nIBSxRhP1zXtsfwhp4sZTZDMZsAQ7JaiVuHlR/MraHCD7hka+/4omNcLY/pcAeHt6YIy0KcN5G/ly+gcAxsZCrsME24fV9MNpAz2w3nquN8Vxs+cUsvRFHQDcadDB/eqvl20hLGQqIB8/ZOxxlr+FCggRc0UFVBSxdMqQNx9y5H8bK1a11vQD0SzYS1/IsivnaK18c6coLZIK7qB4lc9LFIHd+j8pUn4leMTkLF7P+QUW6Qcqr5uoKT1zwgj7o5L6H71OTibfxR1M6WPjHc/gUSpRI8ER6hZWuDLkriWxzF60z7fBygKenbUIav+MExZ8xF37zKC+hiui+dgXrAIxswsSrwp4NsVX38vxgl+oH4PlKGQyE72dAHZnt8MyWCAjwyONn4pwHhQ7NpShaz9R0Tkji9aDX6FCo/qfBbjH1yLzsoSgIJloEQMZLgjE0mP0StOMvz1QTDK9Ob8JUgoXkdXCeTkFNFHCVNsS3jFRzlupOELuCjZWgoKYavZBPP8PJiyF8Dj+Fvo+38iBrLVbIRkonxEYll8P3IaW27ui8ZGKVqfRN+uN2lJmuiYx5C+9S0krF4jZsxWvdHvU9wVSiGeq46gNl6ZNZA5v0D8s8SS9aqRuMKVGPvhG4wePYTx1hM0FSIdqf3dr9Qg4ZFSWNdVwEK6psx5oo/nvRs7d5C+V9X1F2YE4ltV+8vbkUiG/eJu/xODlDbGjjWC0Y5xOnE2fQt+cZFtdtoEMc2H2W9jaiB6aFNr62B7oQ6ScVKN7w67X9sAb2eH38as7zwhzySTngI0JbMFc3fVI4GCHxdvb7caBAf3vacLJsD8tEXNwGjfsl3AMIov/Xt3gj+AXCZ+O4vBAx9MazDaTs0ZiitcIex6r1+BreolcZrw0L65e2ut5oMYLUTgeM0Zcp44JnRM2bkCxn3pIgW9ypl3hIGWdZY1Z2jgw93w9fWCv9YTF9owcvgzEQB1+ohomCYQtzB86IC4IrIWA2XNJYuBXd0m/n9AdC6fOVrp/r+zH6hIPnGG4l/QYnN+mb3vME06Gjgli/E875BNRmkbHRfcYVq3sUGC/Ebu8Q7xlUvOOXntAkwops1LK5Eqt5GDH5uuQ5ZezG25usfvN+gg1bNmidXlGgr5HOZXje3do5hG8podYV+2/gWzbNc4FDi3jgAAAABJRU5ErkJggg==',
      chooseNode: {},
      chooseNodeId: '',
      // 模拟数据
      lineData: {
        nodes: [
          {
            id: '0',
            label: '开始',
            description: 'description'
          },
          {
            id: '9',
            label: '结束',
            description: 'description'
          }
        ],
        edges: [
          {
            source: '0',
            target: '9'
          }
        ]
      },
      ruleList: [
        ['0', '9']
      ],
      lineData1: {
        nodes: [
          {
            id: '0',
            label: '开始',
            description: 'description'
          },
          {
            id: '1',
            label: '1',
            description: 'description'
          },
          {
            id: '2',
            label: '2',
            description: 'description'
          },
          {
            id: '3',
            label: '3',
            description: 'description'
          },
          {
            id: '4',
            label: '4',
            description: 'description'
          },
          {
            id: '5',
            label: '5',
            description: 'description'
          },
          {
            id: '6',
            label: '6',
            description: 'description'
          },
          {
            id: '7',
            label: '7',
            description: 'description'
          },
          {
            id: '8',
            label: '8',
            description: 'description'
          },
          {
            id: '10',
            label: '10',
            description: 'description'
          },
          {
            id: '9',
            label: '结束',
            description: 'description'
          }
        ],
        edges: [
          {
            source: '0',
            target: '1'
          },
          {
            source: '0',
            target: '2'
          },
          {
            source: '1',
            target: '4'
          },
          {
            source: '0',
            target: '3'
          },
          {
            source: '0',
            target: '6'
          },
          {
            source: '4',
            target: '5'
          },
          {
            source: '3',
            target: '9'
          },

          {
            source: '5',
            target: '7'
          },
          {
            source: '5',
            target: '8'
          },
          {
            source: '8',
            target: '10'
          },
          {
            source: '10',
            target: '9'
          },
          {
            source: '2',
            target: '9'
          },
          {
            source: '6',
            target: '9'
          },
          {
            source: '7',
            target: '9'
          }
        ]
      },
      chooseIndexList: [],
      cavTree: null
    }
  },
  watch: {
    // ruleList: {
    //   handler: function(val) {
    //     console.log('watch srcIpCountBar', this.ydata1)

    //   },
    //   deep: true
    // }
  },
  created () {
    console.log('srcIpCountBar', this.xdata)
  },
  mounted () {
    this.init()
  },
  methods: {
    // 去重
    ruleTrans (val) {
      const newarrr = []
      for (const item of val) {
        const mode = JSON.stringify(item)
        newarrr.push(mode)
      }
      const res = [...new Set(newarrr)]
      const resultData = []
      for (const item of res) {
        const mode = JSON.parse(item)
        resultData.push(mode)
      }
      console.log('resultData', resultData)
      return resultData
    },
    edgesTrans (val) {
      if (val.length > 1) {
        for (const index in val) {
          if (val[index].source === '0' && val[index].target === '9') {
            val.splice(index, 1)
          }
        }
      }
      return val
    },
    // getNodeById(id) {
    //   var hasFound = false // 表示是否有找到id值
    //   var result = null
    //   let end = false
    //   // const that = this
    //   const data = this.dataList.children
    //   var fn = function(data) {
    //     if (Array.isArray(data) && !hasFound) { // 判断是否是数组并且没有的情况下，
    //       data.forEach((item, index) => {
    //         if (item.id === id) { // 数据循环每个子项，并且判断子项下边是否有id值
    //           // that.chooseIndexList.push(index)
    //           end = true
    //           result = item // 返回的结果等于每一项
    //           hasFound = true // 并且找到id值
    //         } else if (item.children) {
    //           if (!end) {
    //             // that.chooseIndexList.push(index)
    //           }
    //           fn(item.children) // 递归调用下边的子项
    //         }
    //       })
    //     }
    //   }
    //   fn(data) // 调用一下
    //   return result
    // },
    // // 转化为树
    // translateDataToTree(data) {
    //   // 没有父节点的数据
    //   const parents = data.filter(value => value.parentId === 'undefined' || value.parentId == null)

    //   // 有父节点的数据
    //   const children = data.filter(value => value.parentId !== 'undefined' && value.parentId != null)

    //   // 定义转换方法的具体实现
    //   const translator = (parents, children) => {
    //     // 遍历父节点数据
    //     parents.forEach((parent) => {
    //       // 遍历子节点数据
    //       children.forEach((current, index) => {
    //         // 此时找到父节点对应的一个子节点
    //         if (current.parentId === parent.id) {
    //           // 对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
    //           const temp = JSON.parse(JSON.stringify(children))
    //           // 让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
    //           temp.splice(index, 1)
    //           // 让当前子节点作为唯一的父节点，去递归查找其对应的子节点
    //           translator([current], temp)
    //           // 把找到子节点放入父节点的children属性中
    //           typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
    //         }
    //       }
    //       )
    //     }
    //     )
    //   }

    //   // 调用转换方法
    //   translator(parents, children)

    //   // 返回最终的结果
    //   return parents
    // },
    showName (val) {
      const rule = this.lineData.nodes
      for (const item of rule) {
        if (item.id === val) {
          return item.label
        }
      }
    },
    init () {
      const that = this
      const minimap = new G6.Minimap({
        size: [100, 100],
        className: 'minimap',
        type: 'delegate'
      })
      // 实例化 grid 插件
      const grid = new G6.Grid()
      G6.registerNode('card-node', {
        draw: function drawShape (cfg, group) {
          const r = 2
          const strokeColor = '#DCDEE2'
          const color = '#0090FF'
          const w = cfg.size[0]
          const h = cfg.size[1]
          let shape = null
          // 开始结束
          if (cfg.label === '开始' || cfg.label === '结束') {
            shape = group.addShape('rect', {
              attrs: {
                x: -w / 2,
                y: -h / 2,
                width: w / 2,
                height: h,
                stroke: strokeColor,
                radius: r,
                fill: '#fff',
                cursor: 'pointer'
              },
              name: 'main-box',
              draggable: true
            })
            group.addShape('text', {
              attrs: {
                textBaseline: 'top',
                x: -w / 2 + 25,
                y: -h / 2 + 28,
                fontSize: 20,
                lineHeight: h,
                text: cfg.label,
                fill: '#0090FF',
                cursor: 'pointer'
              },
              name: 'title'
            })
          } else {
            shape = group.addShape('rect', {
              attrs: {
                x: -w / 2,
                y: -h / 2,
                width: w, // 200,
                height: h, // 60
                stroke: strokeColor,
                radius: r,
                fill: '#fff'
              },
              name: 'main-box',
              draggable: true
            })

            group.addShape('rect', {
              attrs: {
                x: -w / 2,
                y: -h / 2,
                width: w, // 200,
                height: h / 2 - 6, // 60
                fill: color,
                radius: [r, r, 0, 0]
              },
              name: 'title-box',
              draggable: true
            })

            // title text
            group.addShape('text', {
              attrs: {
                textBaseline: 'top',
                x: -w / 2 + 20,
                y: -h / 2 + 8,
                fontSize: 18,
                text: cfg.label,
                fill: '#fff'
              },
              name: 'title'
            })
            group.addShape('text', {
              attrs: {
                textBaseline: 'top',
                x: -w / 2 + 20,
                y: -h / 2 + 40,
                fontSize: 18,
                lineHeight: 20,
                text: cfg.description,
                fill: 'rgba(0,0,0, 1)'
              },
              name: `description`
            })
          }
          return shape
        },
        getAnchorPoints () {
          return [
            [0, 0.5],
            [1, 0.5]
          ]
        },
        setState (name, value, item) {
          if (name === 'active') {
            console.log('setState -> value', value)
            const marker = item.get('group').find(ele => ele.get('name') === 'main-box')
            if (value) {
              that.chooseNode = item.get('model')
              marker.attr('stroke', 'red')
            } else {
              marker.attr('stroke', '#DCDEE2')
              that.chooseNode = {}
            }
          }
        }
      })

      // 自定义行为
      G6.registerBehavior('activate-node', {
        getDefaultCfg () {
          return {
            multiple: true
          }
        },
        getEvents () {
          return {
            'node:click': 'onNodeClick',
            'canvas:click': 'onCanvasClick'
          }
        },
        removeNodesState () {
          graph.findAllByState('node', 'active').forEach(node => {
            graph.setItemState(node, 'active', false)
            // const marker = node.get('group').find(ele => ele.get('name') === 'main-box')
            // marker.attr('stroke', '#DCDEE2')
          })
        },
        onNodeClick (e) {
          console.log('onNodeClick -> e', e)
          const graph = this.graph
          const item = e.item
          console.log('onNodeClick -> item', item)
          // 点击取消选中 本业务无须此功能
          // if (item.hasState('active')) {
          //   graph.setItemState(item, 'active', false)
          //   return
          // }
          // this 上即可取到配置，如果不允许多个 'active'，先取消其他节点的 'active' 状态
          this.removeNodesState()

          // 置点击的节点状态 'active' 为 true
          graph.setItemState(item, 'active', true)
          const tapList = ['main-box', 'title-box', 'title', 'description']
          const name = e.target.get('name')
          if (tapList.indexOf(name) > -1) {
            // 点击 card-node
            console.log('点击 card-node')
            // const marker = item.get('group').find(ele => ele.get('name') === 'main-box')
            // marker.attr('stroke', 'red')
            // 选中node
            // const id = item.get('id')
            // that.chooseNode = item.get('model')
          }
        },
        onCanvasClick (e) {
          // shouldUpdate 可以由用户复写，返回 true 时取消所有节点的 'active' 状态，即将 'active' 状态置为 false
          if (this.shouldUpdate(e)) {
            this.removeNodesState()
          }
        }
      })
      // G6.registerEdge('hvh', {
      //   draw(cfg, group) {
      //     const startPoint = cfg.startPoint
      //     const endPoint = cfg.endPoint
      //     const shape = group.addShape('path', {
      //       attrs: {
      //         stroke: '#333',
      //         path: [
      //           ['M', startPoint.x, startPoint.y],
      //           ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
      //           ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
      //           ['L', endPoint.x, endPoint.y]
      //         ]
      //       },
      //       // must be assigned in G6 3.3 and later versions. it can be any value you want
      //       name: 'path-shape'
      //     })
      //     return shape
      //   }
      // })
      G6.registerEdge(
        'line-arrow',
        {
          getPath (points) {
            const startPoint = points[0]
            const endPoint = points[1]
            const leftPointX = startPoint.x + 25
            return [
              ['M', startPoint.x, startPoint.y],
              ['L', leftPointX, startPoint.y],
              ['L', leftPointX, endPoint.y],
              ['L', endPoint.x, endPoint.y]
            ]
          },
          getShapeStyle (cfg) {
            const startPoint = cfg.startPoint
            const endPoint = cfg.endPoint
            const controlPoints = this.getControlPoints(cfg)
            let points = [startPoint] // the start point
            // the control points
            if (controlPoints) {
              points = points.concat(controlPoints)
            }
            // the end point
            points.push(endPoint)
            const path = this.getPath(points)
            const style = Object.assign(
              {},
              G6.Global.defaultEdge.style,
              {
                stroke: '#B0B6B8',
                lineWidth: 4,
                path
              },
              cfg.style
            )
            return style
          }
        },
        'line'
      )

      const data = JSON.parse(JSON.stringify(this.lineData))

      const width = document.getElementById('container').scrollWidth
      const height = document.getElementById('container').scrollHeight || 500
      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        plugins: [minimap, grid], // 将 grid 实例配置到图上
        fitView: true,
        fitViewPadding: [40, 20, 20, 40],
        modes: {
          default: [
            {
              type: 'zoom-canvas',
              minZoom: 0.01,
              maxZoom: 100
            },
            {
              type: 'drag-canvas'
              // direction: 'x'
            },
            {
              type: 'tooltip',
              formatText: function formatText (model) {
                const text = 'description: ' + model.description
                return text
              },
              offset: 70,
              shouldBegin: (e) => {
                if (e.item.getModel().id === '1') return false
                const div = document.getElementsByClassName('g6-tooltip')[0]
                if (div) div.style.display = 'none'
                return true
              },
              shouldUpdate: (e) => {
                const tapList = ['main-box', 'title-box', 'title', 'description']
                const name = e.target.get('name')
                if (tapList.indexOf(name) > -1) {
                  const div = document.getElementsByClassName('g6-tooltip')[0]
                  if (div) div.style.display = 'block'
                  return true
                }
                return false
              }
            },
            'activate-node']
        },
        layout: {
          type: 'dagre',
          rankdir: 'LR',
          align: 'UL',
          controlPoints: true,
          nodesep: 50, // 左右间隔
          ranksep: 70,
          nodesepFunc: () => 1,
          ranksepFunc: () => 1
        },
        defaultNode: {
          type: 'card-node',
          size: [176, 70],
          style: {
            fill: '#0090FF',
            stroke: '#fff'
          }
        },
        defaultEdge: {
          type: 'line-arrow',
          size: 1,
          color: '#e2e2e2',
          style: {
            radius: 10 // 拐弯处的圆角弧度，若不设置则为直角
          }
        }
      })
      graph.data(data)
      graph.render()

      graph.fitView()

      this.cavTree = graph
    },
    addItem (type) {
      if (JSON.stringify(this.chooseNode) !== '{}') {
        const node = this.chooseNode
        console.log('addItem -> node', node)

        const nodeId = node.id
        const childData = {
          id: 'child-data-' + count,
          label: '过滤规则-' + count,
          description: '过滤规则-描述'
        }
        const lineData = JSON.parse(JSON.stringify(this.lineData))
        console.log('addItem -> lineData', lineData)
        const { nodes } = lineData
        let { edges } = lineData
        nodes.push(childData)
        let beforeNodeId = ''
        for (const item of edges) {
          if (item.target === nodeId) {
            beforeNodeId = item.source
          }
        }
        // 规则组
        let ruleList = JSON.parse(JSON.stringify(this.ruleList))
        // 规则添加
        let newRule = []
        switch (type) {
          case 'and':
            // 与操作
            for (const item of edges) {
              if (item.source === nodeId) {
                item.source = childData.id
              }
            }
            // 连接选中节点与新增节点
            edges.push({
              source: nodeId,
              target: childData.id
            })
            // if (ruleList.length === 0) {
            //   const arr = []
            //   arr.push(childData.id)
            //   ruleList.push(arr)
            // } else {
            for (const item of ruleList) {
              for (const index in item) {
                if (item[index] === nodeId) {
                  console.log('addItem -> item[index]', item[index])
                  const res = String(Number(index) + 1)
                  // 找到每一条链路
                  item.splice(res, 0, childData.id)
                }
              }
            }
            // }
            break
          case 'or':

            // 或操作
            for (const item of edges) {
              if (item.target === nodeId) {
                edges.push({
                  source: item.source,
                  target: childData.id
                })
              }
            }
            for (const item of ruleList) {
              const newarr = []
              for (let index = 0; index < item.length; index++) {
                // 每条链路
                newarr.push(item[index])
                if (item[index] === beforeNodeId) {
                  const sec = index + 1
                  if (item[sec] === nodeId) {
                    // 找到链路
                    newarr.push(childData.id)
                    newarr.push('9')
                    newRule = newarr

                    console.log('addItem -> ruleList', ruleList)
                    break
                  }
                }
              }
              // item = newRule
            }
            console.log('addItem -> newRule', newRule)
            // }
            ruleList.push(newRule)
            console.log('addItem -> ruleList', ruleList)

            edges.push({
              source: childData.id,
              target: '9' // 9为结束
            })

            break
          default:
            break
        }
        ruleList = this.ruleTrans(ruleList)
        this.ruleList = ruleList
        console.log('addItem -> ruleList', ruleList)
        console.log('addItem -> newRule', newRule)
        console.log('addItem -> edges', edges)
        edges = this.edgesTrans(edges)
        this.lineData = {
          nodes: nodes,
          edges: edges
        }
        const list = JSON.parse(JSON.stringify(lineData))
        this.cavTree.changeData(list)
        // 更新选中node
        this.updatedNode(childData.id)
        count++
      } else {
        this.$message('请先选择节点')
      }
    },
    updatedNode (nodeId) {
      console.log('updatedNode -> nodeId', nodeId)
      const graph = this.cavTree
      // const nodeItem = this.chooseNode
      // 取消之前的节点状态

      graph.findAllByState('node', 'active').forEach(node => {
        graph.setItemState(node, 'active', false)
      })

      const newNode = graph.findById(nodeId)
      graph.setItemState(newNode, 'active', true)
      this.chooseNode = newNode.get('model')
    },
    changeChildren () {
      if (JSON.stringify(this.chooseNode) !== '{}') {
        const nodeItem = this.chooseNode
        const nodeId = nodeItem.id
        const lineData = JSON.parse(JSON.stringify(this.lineData))
        console.log('addItem -> lineData', lineData)
        const { nodes } = lineData
        let { edges } = lineData
        for (const index in nodes) {
          if (nodeId === nodes[index].id) {
            nodes.splice(index, 1)
          }
        }

        // 规则链路
        let beforeNodeId = ''
        for (const index in edges) {
          if (edges[index].target === nodeId) {
            beforeNodeId = edges[index].source
            edges.splice(index, 1)
          }
        }

        for (const index in edges) {
          if (edges[index].source === nodeId) {
            // 检查是否需要连接前后两锚点
            const status = this.checkNodeStatus(beforeNodeId, edges[index].target)
            if (!status) {
              edges[index].source = beforeNodeId
            } else {
              edges.splice(index, 1)
            }
          }
        }

        if (edges.length < 1) {
          edges.push({
            source: '0',
            target: '9'
          })
        }
        console.log('断点2')
        edges = this.edgesTrans(edges)
        this.lineData = {
          nodes: nodes,
          edges: edges

        }
        console.log('changeChildren -> edges', edges)

        let ruleList = JSON.parse(JSON.stringify(this.ruleList))
        for (const item of ruleList) {
          for (const index in item) {
            if (item[index] === nodeId) {
              console.log('changeChildren -> index', index)
              item.splice(index, 1)
            }
          }
        }
        console.log('断点3')
        for (const index in ruleList) {
          if (ruleList[index].length === 2 && ruleList.length > 1) {
            ruleList.splice(index, 1)
          }
        }

        ruleList = this.ruleTrans(ruleList)
        this.ruleList = ruleList
        console.log('断点4')
        console.log('changeChildren -> lineData', lineData)
        const list = JSON.parse(JSON.stringify(lineData))

        this.cavTree.changeData(list)

        console.log('断点5')
        this.updatedNode(beforeNodeId)
      } else {
        this.$message('请选择节点')
      }
    },
    checkNodeStatus (beforeNodeId, afterNodeId) {
      const rule = this.ruleList
      // 日志规则组
      let status = false
      for (const item of rule) {
        for (const num in item) {
          if (item[num] === beforeNodeId) {
            // 找到有前一节点的链路
            const sec = String(Number(num) + 1)
            if (item[sec] === afterNodeId) {
              status = true
            }
          }
        }
      }
      return status
    },
    changeModel () {
      this.lineData = this.lineData1
      this.cavTree.changeData(this.lineData1)
    },
    refreshForm () {
      this.cavTree.destroy()
      this.chooseNode = {}
      this.init()
    }
  }
}
</script>
<style lang="scss">
.srcIpCountBar {
  // width: 100%;
  // height: 100%;
  // #main {
  //   width: 100%;
  //   height: 100%;
  // }
  z-index: 2;
  #container {
    position: relative;
    // display: flex;

  }
  #container > :first-child {
    z-index: 0 !important;
  }
  #container > :nth-child(2)  {
      z-index: 1 !important;
      position: absolute;
    }
}
.minimap{
    position: absolute;
          left: 20px;
    top: 500px;
}
.g6-tooltip {
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 12px;
  color: #545454;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 8px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  z-index: 10;
}
#container {
  /deep/ .g6-grid {
    z-index: 0;
  }
}
.ruleCheck{
  font-size: 14px;
color: #222222;
padding: 20px;
}
</style>
