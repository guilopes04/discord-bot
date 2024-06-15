import axios from 'axios'
import { GetDollarError, GetWeatherError } from '../errors-handling/index.js'

export class ExternalApiService {
  constructor(args) {
    this.weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'
    this.currencyApiUrl = 'https://api.exchangerate-api.com/v4/latest/USD'
    this.args = args
  }

  async handle(command, message) {
    const arg = !this.args.length ? 'São Carlos' : this.args.join(' ')
    let response
    switch (command) {
      case 'clima':
        response = await this.getWeather(arg)
        break
      case 'dolar':
        response = await this.getDollarRate()
        break
      default:
        response = 'Comando não implementado'
        break
    }

    return response
  }

  async getWeather(city = 'São Carlos') {
    try {
      console.log('• city:', city)
      const response = await axios.get(this.weatherApiUrl, {
        params: {
          q: city,
          appid: '518cf2ea642e910a69b441ed92769f4e'
        }
      })
      const tempCelsius = response.data.main.temp - 273.15
      return `A temperatura no momento em ${city} é ${tempCelsius >> 0}°C`
    } catch (error) {
      console.error('Erro ao obter dados meteorológicos:', error)
      throw new GetWeatherError()
    }
  }

  async getDollarRate() {
    try {
      const response = await axios.get(this.currencyApiUrl)
      const { rates, date, time_last_update: timeLastUpdate } = response.data

      const valorDolarEmReal = rates['BRL']
      const lastUpdatedDate = new Date(date)
      const monthNames = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
      ]
      const lastUpdatedDateFormated = `${lastUpdatedDate.getDate() + 1} de ${
        monthNames[lastUpdatedDate.getMonth()]
      } de ${lastUpdatedDate.getFullYear()}`

      return `A cotação do dolar no dia ${lastUpdatedDateFormated} é de R$${valorDolarEmReal}`
    } catch (error) {
      console.error('Erro ao obter a cotação do dólar:', error)
      throw new GetDollarError()
    }
  }
}
