import type { Command } from '../../commands.js'

const provider = {
  type: 'local',
  name: 'provider',
  description: 'View and manage compatible API providers',
  argumentHint: '[info|use|add|rename|remove]',
  supportsNonInteractive: false,
  immediate: true,
  load: () => import('./provider.js'),
} satisfies Command

export default provider
