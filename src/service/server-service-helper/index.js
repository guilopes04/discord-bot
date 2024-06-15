import { BigGamingServerHelper } from './factory/models/big-gaming-model-server-helper.js'
import { PersonalizedServerHelper } from './factory/models/personalized-model-server-helper.js'
import { SmallGamingServerHelper } from './factory/models/small-gaming-model-server-helper.js'

export const createServerServiceHelper = (
  guild,
  serverModel,
  serverStructure
) => {
  const serverModelServiceMapping = {
    small: new SmallGamingServerHelper(guild),
    big: new BigGamingServerHelper(guild),
    personalized: new PersonalizedServerHelper(guild, serverStructure)
  }

  if (serverStructure) {
    return serverModelServiceMapping['personalized']
  }

  return (
    serverModelServiceMapping[serverModel] || serverModelServiceMapping['small']
  )
}
