import type { Command } from '../../commands.js'
import { shouldInferenceConfigCommandBeImmediate } from '../../utils/immediateCommand.js'
import {
  getSettings_DEPRECATED,
} from '../../utils/settings/settings.js'
import { renderModelSetting } from '../../utils/model/model.js'

function getTierSummary(): string {
  const selection = getSettings_DEPRECATED()?.modelSelection
  const fast = selection?.fast ? renderModelSetting(selection.fast) : 'Default'
  const balance = selection?.balance
    ? renderModelSetting(selection.balance)
    : 'Default'
  const quality = selection?.quality
    ? renderModelSetting(selection.quality)
    : 'Default'

  return `Fast ${fast} · Balance ${balance} · Quality ${quality}`
}

export default {
  type: 'local-jsx',
  name: 'model-selection',
  get description() {
    return `Configure Fast / Balance / Quality model mappings (${getTierSummary()})`
  },
  get immediate() {
    return shouldInferenceConfigCommandBeImmediate()
  },
  load: () => import('./model-selection.js'),
} satisfies Command
