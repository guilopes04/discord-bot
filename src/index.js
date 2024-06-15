// Arquivo: index.js (arquivo principal)
import { Client, REST, Routes } from 'discord.js'
import {
  beltrameUserId,
  clientConfig,
  euUserId,
  friendsMapping,
  minsquitoUserId,
  token
} from './config/config.js'
import CommandHandler from './service/command-handler.js'
import { AdminService } from './service/admin-service.js'
import { randomMoveUser } from './helpers/index.js'
import { servicesCommands } from './factory/helper-commands/index.js'

const client = new Client(clientConfig)
const serverQueue = new Map()
const commandHandler = new CommandHandler(client, serverQueue)

client.on('messageCreate', async (message) => {
  await commandHandler.handleCommand(message)
})
client.on('error', (error) => {
  console.error(error)
})

// client.on('interactionCreate', async (interaction) => {
//   if (!interaction.isCommand()) return

//   const { commandName } = interaction

//   if (commandName === 'setupserver') {
//     // Nome do comando deve ser em minúsculas
//     const response = await serverService.handle('setupserver', interaction)
//     await interaction.reply(response)
//   }
// })

const registerCommands = async (clientId, guildId, token) => {
  const commands = [
    ...servicesCommands.adminCommands.map((command) => {
      return { name: command.toLowerCase(), description: 'Admin commands' }
    }),
    ...servicesCommands.musicCommands.map((command) => {
      return { name: command.toLowerCase(), description: 'Music commands' }
    }),
    ...servicesCommands.externalCommands.map((command) => {
      return { name: command.toLowerCase(), description: 'External commands' }
    }),
    ...servicesCommands.serverCommands.map((command) => {
      return { name: command.toLowerCase(), description: 'Server commands' }
    }),
    ...servicesCommands.gameCommands.map((command) => {
      return { name: command.toLowerCase(), description: 'Game commands' }
    })
  ]

  const rest = new REST({ version: '10' }).setToken(token)

  try {
    //console.log('Started refreshing application (/) commands.')
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands
    })

    //console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)

  const guildIds = client.guilds.cache
  await Promise.all(
    guildIds.map((guildId) =>
      registerCommands(client.user.id, guildId.id, token)
    )
  )
})

client.on('voiceStateUpdate', async (oldState, newState) => {
  const userId = newState.member.id
  const channel = newState.channel
  if (!channel) return
  const isVoiceMutedChannel = newState.suppress
  if (!isVoiceMutedChannel) {
    console.log(
      `${
        newState.member.nickname ?? newState.member.displayName
      } connected to voice channel ${channel.name}`
    )
    const targetsUsersIds = [beltrameUserId]

    if (targetsUsersIds.includes(userId)) {
      console.log(`Pessoa a ser kikada: ${friendsMapping[userId] ?? userId}`)
      const possiblesChoice = ['disconnect', 'castigo', 'ban', 'kick']
      const randomNum = Math.random() * 100 // Generate a random number between 0 and 100

      if (randomNum < 10) {
        // 10% chance
        console.log('Possibility 1 happened')
        // Perform actions for Possibility 1
      } else if (randomNum < 30) {
        // 20% chance
        console.log('Possibility 2 happened')
        // Perform actions for Possibility 2
      } else if (randomNum < 60) {
        // 30% chance
        console.log('Possibility 3 happened')
        // Perform actions for Possibility 3
      } else {
        // 40% chance
        console.log('Possibility 4 happened')
        // Perform actions for Possibility 4
        return await newState.member.voice.disconnect()
      }

      //await randomMoveUser(client, newState)
    }
  }
})

client.on('guildMemberAdd', async (member) => {
  console.log(
    `[${new Date().toLocaleTimeString()}] Novo membro no servidor ${
      member.guild.name
    }: ${member.user.tag}`
  )
  const args = [member]

  await new AdminService(args).addPermissionToNewUser(member)

  const channel = member.guild.channels.cache.find((ch) =>
    ['bem-vindo', 'seja-bem-vindo', 'boas-vindas-e-regras', 'general'].includes(
      ch.name
    )
  )
  if (!channel) return
  channel.send(`Bem vindo ao servidor ${member.guild.name}, ${member}!`)
})

client.login(token)
