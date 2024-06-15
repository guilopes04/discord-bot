import { prefix } from '../config/config.js'
import { ErrorHandling } from '../errors-handling/index.js'
import { serviceFactory } from '../factory/factory.js'

export default class CommandHandler {
  service
  constructor(client, serverQueue) {
    this.client = client
    this.serverQueue = serverQueue
  }
  async handleCommand(message) {
    const serverName = message.guild.name
    const userTag = `${message.author.tag} (${serverName} > #${message.channel.name})`
    console.log(
      `[${new Date().toLocaleTimeString()}] ${userTag}: ${message.content}`
    )

    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    let command = args.shift()

    try {
      this.service = serviceFactory(command).create(args, this.serverQueue)
      const response = await this.service.handle(command, message)
      if (response) message.channel.send(response)
    } catch (e) {
      if (e instanceof ErrorHandling) e.handle(message)
    }
  }
}
