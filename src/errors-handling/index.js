export class ErrorHandling {
  constructor(errorMessage) {
    this.errorMessage = errorMessage
  }

  handle(message) {
    message.channel.send(this.errorMessage)
  }
}

export class CommandNotFound extends ErrorHandling {
  constructor() {
    super('Comando não implementado')
  }
}

export class MissingMemberError extends ErrorHandling {
  constructor() {
    super('O parametro de membro não pode ser nulo')
  }
}

export class FirstArgMissingError extends ErrorHandling {
  constructor() {
    super('O primeiro parametro do argumento não pode ser nulo')
  }
}

export class MissingNewNameError extends ErrorHandling {
  constructor() {
    super('O parametro de novo nome não pode ser nulo')
  }
}

export class GetWeatherError extends ErrorHandling {
  constructor() {
    super('Erro ao obter informações de clima')
  }
}

export class GetDollarError extends ErrorHandling {
  constructor() {
    super('Erro ao obter informações de câmbio')
  }
}
