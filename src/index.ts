import { API } from 'homebridge'

import { ACCESSORY_NAME } from './settings'
import { SwitchAccessory } from './switchAccessory'

export = (api: API) => {
	api.registerAccessory(ACCESSORY_NAME, SwitchAccessory)
}
