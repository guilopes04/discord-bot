import { ModelServerHelper } from './model-server-helper.js'

export class PersonalizedServerHelper extends ModelServerHelper {
  constructor(guild, serverStructure) {
    super(guild)
    this.guild = guild
    this.serverStructure = serverStructure
  }

  async handle() {
    await this.handleServerSchema(this.serverStructure)
  }
}
