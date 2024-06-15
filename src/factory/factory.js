import { getServicesTypes } from '../config/config.js'
import { CommandNotFound } from '../errors-handling/index.js'
import { AdminService } from '../service/admin-service.js'
import { ExternalApiService } from '../service/external-service.js'
import { GameService } from '../service/game-service.js'
import { MusicService } from '../service/music-service.js'
import { ServerService } from '../service/server-service.js'
import { servicesCommands } from './helper-commands/index.js'

export const serviceFactory = (command) => {
  const create = (args, serverQueue) => {
    const mappingService = {
      music: {
        commands: servicesCommands['musicCommands'],
        createService: () => new MusicService(args, serverQueue)
      },
      admin: {
        commands: servicesCommands['adminCommands'],
        createService: () => new AdminService(args)
      },
      external: {
        commands: servicesCommands['externalCommands'],
        createService: () => new ExternalApiService(args)
      },
      game: {
        commands: servicesCommands['gameCommands'],
        createService: () => new GameService(args)
      },
      server: {
        commands: servicesCommands['serverCommands'],
        createService: () => new ServerService(args)
      }
    }

    const serviceTypes = getServicesTypes()
    for (const serviceType of serviceTypes) {
      const service = mappingService[serviceType]
      if (service.commands.includes(command)) {
        return service.createService()
      }
    }

    throw new CommandNotFound()
  }

  return {
    create
  }
}
