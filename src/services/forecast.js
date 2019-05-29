import myAxios from './myAxios'
import apis from './apis'
import rest from './rest'

export default {
  getForecast: async (data) => {
    console.log(rest.POST, apis.forecast)
    const result = await myAxios({
      url: apis.forecast,
      method: rest.GET,
      data: JSON.stringify(data)
    })
    return result
  }
}
