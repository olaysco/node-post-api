import { Model } from "sequelize/types";

export abstract class Controller {

	/**
	 * Calculate offset of paginated model instances
	 * 
	 * @param page 
	 * @param size 
	 * @returns { limit: number; offset: number}
	 */
	public static paginate(page: number, size: number): { limit: number; offset: number} {
		return {
			limit: size,
			offset: size * (page - 1),
		}
	}

	/**
	 * Returns Total Page in pagination
	 * 
	 * @param count 
	 * @param size 
	 * @returns number
	 */
	public static totalPage(count: number, size = 15): number {
		return Math.ceil(count / size);
	}

	/**
	 * Performs Upsert, i.e. either update an existing model instance
	 * or create a new one if it doesn't exist
	 * 
	 * @param model Model<any>
	 * @param where any
	 * @param data 
	 * @returns {item: Model; created: boolean}
	 */
	public static updateOrCreate(model: any, where: any, data: any): { item: Model; created: boolean } {
		return model.findOne({ where })
			.then(function (foundItem: Model) {
				if (!foundItem) {
					return model
						.create(data)
						.then(function (item: Model) { return { item: item, created: true }; })
				}
				return model
					.update(data, { where })
					.then(function (item: any) { return { item: item, created: false } });
			});
	}
}
