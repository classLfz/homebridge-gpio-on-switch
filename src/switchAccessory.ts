import { AccessoryConfig, AccessoryPlugin, API, Logger, Service } from 'homebridge'
import { MANU_FACTURER, MODEL } from './settings'
import rpio from 'rpio'

const { version } = require('../package.json')

export class SwitchAccessory implements AccessoryPlugin {
	public readonly Service: typeof Service = this.api.hap.Service
	public readonly switchService: any
	public readonly informationService: Service

	constructor (
		public readonly log: Logger,
		public readonly config: AccessoryConfig,
		public readonly api: API
	) {
		this.log = log
		this.config = config
		this.api = api
		this.log.debug('initializing accessory with config: ', this.config)

		// rpio init
		rpio.init({
			mapping: 'gpio'
		})

		this.informationService = new this.api.hap.Service.AccessoryInformation()
			.setCharacteristic(this.api.hap.Characteristic.Manufacturer, MANU_FACTURER)
			.setCharacteristic(this.api.hap.Characteristic.Model, MODEL)
			.setCharacteristic(this.api.hap.Characteristic.SerialNumber, 'Version ' + version)

		this.switchService = new this.api.hap.Service.Switch(this.config.name)

		this.switchService.getCharacteristic(this.api.hap.Characteristic.On)
			.on('get', this.getOnHandler.bind(this))
			.on('set', this.setOnHandler.bind(this))
	}

	getServices () {
		return [
			this.informationService,
			this.switchService
		]
	}

	getOnHandler (callback: any) {
		const on = !!rpio.read(this.config.pin)
		this.log.info('Getting switch state: ', on)
		callback(null, on)
	}

	setOnHandler (value: boolean, callback: any) {
		this.log.info('Setting switch state to: ', value)
		rpio.open(this.config.pin, value ? rpio.HIGH : rpio.LOW)
		callback(null)
	}
}
