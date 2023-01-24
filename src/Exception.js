let options;

/**
 * The base class of all exceptions.
 * @extends Error
 */
class Exception extends Error {
	/**
	 * Creates an exception instance with the given message and information for debug.
	 * You can interpolate variables into `msg` with `%varName%` notation.
	 * `varName` must be a property of `info` object.
	 *
	 * @example
	 * let info = { value: 'foo' };
	 * throw new Exception('%value% is not a valid value', info);
	 * // "foo is not valid value"
	 *
	 * @param {string} [msg] Message
	 * @param {object} [info] Additional information for debug
	 * @param {boolean} [hidesInfo=false] If `true`, `info` won't be included in the message
	 */
	constructor(msg = null, info = null, hidesInfo = false) {
		super((msg ? format(msg, info) : format(new.target.message, info)) + ((info && !hidesInfo) ? `\n[${new.target.name}] To debug, try/catch this exception and see its .info: ${JSON.stringify(info, null, 2)}` : ''));
		this.name = new.target.name;
		this._info = info;
	}
	/**
	 * Additional information for debug.
	 * @type {object}
	 * @readonly
	 */
	get info() {
		return this._info;
	}
	/**
	 * The default message for this exception class.
	 * @type {string}
	 * @readonly
	 */
	static get message() {
		return '';
	}
	/**
	 * Throws this exception if `handler` option is not set.
	 * If `handler` option is set, calls it and returns the result.
	 * @see Exception.option
	 * @return {any} The result of [option.handler]{@link Exception.option} function
	 * @throws This exception
	 */
	trigger() {
		if (typeof options.handler != 'function') throw this;
		return options.handler(this);
	}
	/**
	 * Returns whether this exception has expected `value` specifically.
	 * @param {any} value An expectation
	 * @return {boolean}
	 * @abstract
	 */
	expects(value) {
		return false; // noop
	}
	/**
	 * Resets all the options to the default values.
	 * @return {class} This exception class
	 */
	static reset() {
		options = {
			handler: null
		};
		return this;
	}
	/**
	 * Returns the value of the option specified by `name`.
	 * If `value` is provided, assigns the value to the option.
	 * You can customize the default behavior of `Exception` by changing option values.
	 *
	 * ##### Available options:
	 * | Name | Type | Description |
	 * |-----:|:-----|:------------|
	 * | `handler` | function | Runs when [trigger()]{@link Exception#trigger} is called. Receives the triggered exception instance as the argument |
	 *
	 * @param {string} name Option name
	 * @param {any} [value] Option value to set
	 * @return {any|class} The option value, or this exception class if `value` is provided
	 */
	static option(name, value = undefined) {
		if (arguments.length < 2) return options[name];
		options[name] = value;
		return this;
	}
	/**
	 * If `set` is not provided, returns all the current option values in a plain object form.
	 * If `set` is provided, assigns each value in `set` to the option corresponding with the key.
	 * @param {object} [set] Multiple key-value pairs
	 * @return {object|class} The current options in a plain object form, or this exception class if `set` is provided
	 */
	static options(set) {
		if (!arguments.length) return Object.assign({}, options);
		Object.assign(options, set);
		return this;
	}
	/**
	 * Checks if `value` meets expected condition (varied by each subclass)
	 * @param {any} value A value to check
	 * @return {any} the `value` argument untouched if there's no problem. Otherwise triggers the exception.
	 * @abstract
	 */
	static check(value) {
		return value; // noop
	}
}

function format(str, data) {
	let r = str;
	if (typeof data == 'object') {
		for (let i in data) r = r.replaceAll(`%${i}%`, data[i]);
	}
	return r;
}

Exception.reset();
export default Exception;
