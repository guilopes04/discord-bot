import { IntentsBitField, GatewayIntentBits } from 'discord.js'
import * as dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

export const prefix = `${process.env.PREFIX}`
export const token = `${process.env.BOT_KEY}`

export const mandaChuva = `${process.env.MANDA_CHUVA}`

export const beltrameUserId = '1116042163998949537'
export const minsquitoUserId = '1033491977045553172'
export const euUserId = '298185970657001473'

export const friendsMapping = {
  [`${beltrameUserId}`]: 'beltramen',
  [`${minsquitoUserId}`]: 'minsquito',
  [`${euUserId}`]: 'eu'
}

export const clientConfig = {
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks
  ]
}

export const getArgsFromMessage = (message) => {
  const args = message.content.split(' ')
  const command = args[0].slice(prefix.length).trim()
  const additionalInfo = args[1] ? args[1].trim() : null

  return { command, additionalInfo }
}

export const getServicesTypes = () => {
  const serviceFolderPath =
    '/Users/guilhermelopes/Documents/Projects/discord-bot/src/service'
  const fileNames = fs.readdirSync(serviceFolderPath)

  const serviceTypes = fileNames
    .filter((fileName) => fileName.includes('-service'))
    .map((fileName) => fileName.split('-')[0])

  return serviceTypes
}
