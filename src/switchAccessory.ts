import { AccessoryConfig, AccessoryPlugin, API, Logger, Service } from 'homebridge'
import rpio from 'rpio'

export class SwitchAccessory implements AccessoryPlugin {
	public readonly Service: typeof Service = this.api.hap.Service
	public readonly switchService: any
	public readonly informationService: Service
	public on: boolean

	constructor (
		public readonly log: Logger,
		public readonly config: AccessoryConfig,
		public readonly api: API
	) {
		this.log.debug('initializing accessory: ', this.config.name)

		this.on = !!rpio.read(this.config.pin)

		this.informationService = new this.api.hap.Service.AccessoryInformation()
			.setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'homebridge gpio on switch')
			.setCharacteristic(this.api.hap.Characteristic.Model, 'RaspberryPI GPIO Switch')
			.setCharacteristic(this.api.hap.Characteristic.SerialNumber, 'Version 1.0.0')

		this.switchService = new this.api.hap.Service.Switch(this.config.name)

		this.switchService.getCharacteristic(this.api.hap.Characteristic.On)
			.onGet(this.getOnHandler.bind(this))
			.onSet(this.setOnHandler.bind(this))
	}

	getServices () {
		return [
			this.informationService,
			this.switchService
		]
	}

	async getOnHandler () {
		this.log.info('Getting switch state')
		this.on = !!rpio.read(this.config.pin)
		return this.on
	}

	async setOnHandler (value: boolean) {
		const newOn = value ? rpio.HIGH : rpio.LOW
		rpio.write(this.config.pin, newOn)
		this.log.info('Setting switch state to: ', newOn)
	}
}
