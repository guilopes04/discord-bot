export class GameService {
  constructor(args) {
    this.args = args
  }

  async handle(command, message) {
    let response
    switch (command) {
      case 'sorteio':
        response = await this.handleSorteio(message)
        break
      default:
        response = 'Comando não implementado'
        break
    }

    return response
  }

  async handleSorteio(message) {
    try {
      await message.channel.send('Quantos participantes deseja sortear?')

      const collector = message.channel.createMessageCollector({
        filter: (msg) => msg.author.id === message.author.id,
        time: 15000, // Tempo em milissegundos
        max: 1 // Apenas uma resposta será coletada
      })

      let numParticipants

      collector.on('collect', (msg) => {
        numParticipants = parseInt(msg.content.trim())

        if (isNaN(numParticipants)) {
          message.channel.send('Por favor, insira um número válido.')
          return
        }

        // Perguntar os nomes dos participantes
        message.channel.send(
          `Digite os nomes dos participantes separados por vírgula. (Você tem 3min, caso deseje cancelar, envie "cancelar")`
        )
      })

      collector.on('end', async (collected) => {
        if (!numParticipants) {
          // Caso nenhum participante tenha sido inserido
          message.channel.send('Nenhum número de participantes foi inserido.')
          return
        }

        const participantsCollector = message.channel.createMessageCollector({
          filter: (msg) => msg.author.id === message.author.id,
          max: 1,
          time: 180000 // Tempo em milissegundos para inserir os participantes
        })

        participantsCollector.on('collect', async (msg) => {
          if (msg.content === 'cancelar') {
            message.channel.send('Sorteio cancelado')
            return
          }
          const participants = msg.content.split(',').map((name) => name.trim())

          // Realizar o sorteio com base nos participantes e no número desejado
          const winners = this.performSorteio(participants, numParticipants)

          // Enviar mensagem com os vencedores
          const winnersMessage = `Vencedores: ${winners.join(', ')}`
          await message.channel.send(winnersMessage)
        })

        participantsCollector.on('end', () => {
          return 'Tempo esgotado para inserir os participantes.'
        })
      })

      return 'Insira a resposta: (você tem 15 segundos antes que seje cancelado o sorteio.)'
    } catch (error) {
      console.error('Erro durante o sorteio:', error)
      return `Ocorreu um erro durante o sorteio: ${error.message}`
    }
  }

  performSorteio(participants, numWinners) {
    // Lógica para realizar o sorteio aqui
    // Exemplo: selecionar aleatoriamente numWinners participantes
    const winners = []
    while (winners.length < numWinners) {
      const randomIndex = Math.floor(Math.random() * participants.length)
      winners.push(participants[randomIndex])
      participants.splice(randomIndex, 1)
    }
    return winners
  }
}
