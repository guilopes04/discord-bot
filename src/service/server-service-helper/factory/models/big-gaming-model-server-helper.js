import { bigGamingServerModelConfig } from '../config/big-gaming-server-model-config.js'
import { ModelServerHelper } from './model-server-helper.js'

export class BigGamingServerHelper extends ModelServerHelper {
  constructor(guild) {
    super(guild)
    this.guild = guild
  }

  async handle() {
    await this.handleServerSchema(bigGamingServerModelConfig)
  }
}
