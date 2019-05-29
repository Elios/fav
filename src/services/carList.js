import myAxios from './myAxios'
import apis from './apis'
import rest from './rest'

export default {
  getCarList: async (data) => {
    console.log(rest.POST, apis.carList)
    const result = await myAxios({
      url: apis.carList,
      method: rest.GET,
      data: JSON.stringify(data)
    })
    return result
  }
}
