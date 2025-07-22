import { computed } from 'vue'
import { useObjectStore, useCanvasStore, useToolbarStore } from '@/stores'
import { storeToRefs } from 'pinia'

export const useObjectCreator = () => {
  const objectStore = useObjectStore()
  const canvasStore = useCanvasStore()
  const { objectList } = storeToRefs(objectStore)

  /**
   *
   * @returns
   * 유니크 아이디 제너레이터
   */
  const generateUniqueId = () => {
    const idLst = []
    objectList.value.map((item) => {
      idLst.push(item.id)
    })
    const existingIds = new Set(...idLst)

    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let uniqueId

    do {
      uniqueId = ''
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        uniqueId += characters[randomIndex]
      }
    } while (existingIds.has(uniqueId))
    return uniqueId
  }

  const createObject = (type, config = {}) => {
    // console.log('createObject', type, config)
    // config = {} 는 가장 마지막에 덮어 동적으로 변하는 속성 내용임
    const uniqueId = generateUniqueId()
    const defaultProps = createDefaultProperties(type)
    const typeProps = config.diagramType
      ? getObjectPropsByType('diagram', config.diagramType)
      : type === 'mathTool'
      ? getObjectPropsByType('mathTool', config.mathToolType)
      : getObjectPropsByType(type)

    const initialPosition = { ...defaultProps.position }
    // 우선순위: config > typeProps > defaultProps > fallback
    const initialSize = config.size ||
      typeProps.size ||
      defaultProps.size || { width: 100, height: 100 }

    const newObject = {
      id: uniqueId,
      ...defaultProps,
      ...typeProps,
      ...config,
      size: initialSize, // size 동적으로 들어오는 경우가 있기때문에 분기 (미디어, 이미지 등 원본사이즈 필요한 경우)
      centerPoint: {
        x: initialPosition.x + initialSize.width / 2,
        y: initialPosition.y + initialSize.height / 2,
      },

      // ...createDefaultProperties(type),
      // ...(config.diagramType
      //   ? getObjectPropsByType('diagram', config.diagramType)
      //   : type === 'mathTool'
      //   ? getObjectPropsByType('mathTool', config.mathToolType)
      //   : getObjectPropsByType(type)),
      // ...config,
      // centerPoint: {
      //   x: initialPosition.x + initialSize.width / 2,
      //   y: initialPosition.y + initialSize.height / 2
      // }
    }
    objectStore.addObject(newObject)
    setObjectIndex()
    return newObject
  }

  // 모든 객체 공통 속성 (text, media, diagram, quiz, webviewer, memo, math)
  const createDefaultProperties = (type) => {
    const { x, y } = getViewportCenter()
    const index = objectList.value.length
    return {
      position: { x: x + index * 20, y: y + index * 20 },
      type: type,
      isVisible: true,
      isLocked: false,
      rotationAngle: 0,
    }
  }

  // 객체 타입별 속성
  const getObjectPropsByType = (type, subType) => {
    const configs = {
      textbox: () => ({
        size: { width: 232, height: 26 },
        contentData: {
          // 객체마다 있거나 없는 특수 속성
          text: '텍스트를 입력하세요',
          placeholder: '텍스트를 입력하세요',
          textProperties: {
            fontSize: 26,
            fontFamily: 'Arial',
            fontWeight: 400,
            fontStyle: 'normal',
            textAlign: 'left',
            color: '#000000',
            letterSpacing: 0,
            lineHeight: 1.2,
          },
          fill: 'transparent',
        },
      }),
      memo: () => ({
        size: { width: 240, height: 240 },
        contentData: {
          placeholder: 'Escreva um memo',
          fill: '#FAE1AF',
          text: '',
          // textProperties: {
          //   fontSize: 16,
          //   fontFamily: 'Arial',
          //   fontWeight: 400,
          //   fontStyle: 'normal',
          //   textDecoration: 'none',
          // },
        },
      }),
      diagram: {
        circle: () => ({
          contentData: {
            fill: '#fb6d9e',
            radius: { radiusX: 50, radiusY: 50 },
            // get centerPoint() {
            //   return {
            //     x: this.position.x + this.radius.radiusX,
            //     y: this.position.y + this.radius.radiusY,
            //   }
            // },
          },
          diagramType: 'circle',
          size: { width: 100, height: 100 },
        }),
        rectangle: () => ({
          contentData: {
            fill: '#fc3d3d',
          },
          diagramType: 'rectangle',
          size: { width: 100, height: 100 },
        }),
        equilateral: () => ({
          // 정삼각형
          contentData: {
            fill: '#10A235',
          },
          diagramType: 'equilateral',
          size: { width: 100, height: 100 },
        }),
        rightTriangle: () => ({
          // 직각삼각형
          contentData: {
            fill: '#4c6ce6',
          },
          diagramType: 'rightTriangle',
          size: { width: 100, height: 100 },
        }),
        star: () => ({
          // 별
          contentData: {
            fill: '#ffc032',
            starPoints: generateStarPoints(5),
          },
          diagramType: 'star',
          size: { width: 80, height: 80 },
        }),
        trapezoid: () => ({
          // 사다리꼴
          contentData: {
            fill: '#ad7ae1',
          },
          diagramType: 'trapezoid',
          size: { width: 120, height: 120 },
        }),
        pentagon: () => ({
          contentData: {
            fill: '#ff841d',
          },
          diagramType: 'pentagon',
          size: { width: 100, height: 100 },
        }),

        // polygon: () => ({
        //   diagramType: 'polygon',
        //   position: { x: 112, y: 340 },
        //   fillStyle: '#10A235',
        //   polygonPoints: generatePolygonPoints(3),

        //   polygonCount: 3,
        //   size: { width: 80, height: 80 },
        //   get centerPoint() {
        //     return {
        //       x: this.position.x + this.size.width / 2,
        //       y: this.position.y + this.size.height / 2,
        //     }
        //   },
        // }),
      },
      pen: () => ({}),
      mathTool: {
        calculator: () => ({
          size: { width: 280, height: 'auto' },
        }),
        // 수구슬
        'NO01NR-01': () => ({
          size: { width: 100, height: 'auto' },
        }),
        // 수 세기 모형
        'NO01SC-12': () => ({
          size: { width: 50, height: 'auto' },
        }),
        'NO01SC-13': () => ({
          size: { width: 50, height: 'auto' },
        }),
        'NO01SC-14': () => ({
          size: { width: 50, height: 'auto' },
        }),
        'NO01SC-17': () => ({
          size: { width: 50, height: 'auto' },
        }),
      },
      webviewer: () => ({ size: { width: 700, height: 500 } }),
      image: () => ({}),
      quiz: () => ({
        size: { width: 120, height: 120 },
      }),
    }

    return type === 'diagram' || type === 'mathTool'
      ? {
          ...configs[type][subType]?.(),
          contentData: {
            ...configs[type][subType]?.().contentData,
            border: {
              width: 2,
              color: '#7E7F9A',
              style: 'solid',
            },
          },
        }
      : configs[type]?.()
  }

  const setObjectIndex = () => {
    objectList.value.forEach((lst, index) => {
      lst.zIndex = index + 100
    })
  }

  const getViewportCenter = () => {
    const toolbarStore = useToolbarStore()
    // const zoomFactor = toolbarStore.zoom
    const zoomFactor = 1

    const screenCenterX = window.innerWidth / 2
    const screenCenterY = window.innerHeight / 2

    const canvasX = (screenCenterX - canvasStore.offsetX) / zoomFactor
    const canvasY = (screenCenterY - canvasStore.offsetY) / zoomFactor
    return { x: canvasX, y: canvasY - 180 }
  }

  // count 변경시 새로운 starPoints 생성
  const generateStarPoints = (starCount, ratio = 40) => {
    const starPoints = []
    const outerRadius = 50 // 외부 반지름
    const innerRadius = outerRadius * (ratio / 100) // 내부 반지름
    // const innerRadius = 20 // 내부 반지름
    const angleStep = (Math.PI * 2) / starCount
    const startAngle = -Math.PI / 2 // 시작 각도 -90

    for (let i = 0; i < starCount; i++) {
      const outerAngle = startAngle + i * angleStep
      const innerAngle = startAngle + i * angleStep + angleStep / 2
      // const outerAngle = i * angleStep
      // const innerAngle = outerAngle + angleStep / 2

      // 외부 꼭지점
      starPoints.push({
        x: Math.cos(outerAngle) * outerRadius,
        y: Math.sin(outerAngle) * outerRadius,
      })

      // 내부 꼭지점
      starPoints.push({
        x: Math.cos(innerAngle) * innerRadius,
        y: Math.sin(innerAngle) * innerRadius,
      })
    }
    return starPoints
  }

  const generatePolygonPoints = (polygonCount) => {
    const polygonPoints = []
    const angleStep = (Math.PI * 2) / polygonCount
    const startAngle = -Math.PI / 2 // 시작 각도 -90

    for (let i = 0; i < polygonCount; i++) {
      const angle = startAngle + i * angleStep
      const x = Math.cos(angle) * 50
      const y = Math.sin(angle) * 50
      polygonPoints.push({ x, y })
    }
    console.log('polygonPoints', polygonPoints)
    return polygonPoints
  }

  return {
    generateUniqueId,
    createObject,
    generateStarPoints,
    generatePolygonPoints,
  }
}
