export const randomMoveUser = async (client, newState) => {
  const guildId = newState.guild
  const guild = await client.guilds.fetch(guildId)
  const voiceChannels = guild.channels.cache.filter(
    (channel) => channel.type === 2
  )
  const randomVoiceChannelId = Math.floor(Math.random() * voiceChannels.size)
  console.log('randomVoiceChannelId', randomVoiceChannelId)
  voiceChannels.at(randomVoiceChannelId)
  const randomVoiceChannel = voiceChannels.at(randomVoiceChannelId)
  console.log('randomVoiceChannel', randomVoiceChannel)
  if (randomVoiceChannel) {
    try {
      await newState.member.voice.setChannel(randomVoiceChannel)
    } catch (error) {
      console.error(`Failed to move user to a random voice channel: ${error}`)
    }
  }
}
