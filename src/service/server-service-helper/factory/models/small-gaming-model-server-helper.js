import { smallGamingServerModelConfig } from '../config/small-gaming-server-model-config.js'
import { ModelServerHelper } from './model-server-helper.js'

export class SmallGamingServerHelper extends ModelServerHelper {
  constructor(guild) {
    super(guild)
    this.guild = guild
  }

  async handle() {
    await this.handleServerSchema(smallGamingServerModelConfig)
  }
}
