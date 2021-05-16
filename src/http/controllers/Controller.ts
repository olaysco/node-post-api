import { Model } from "sequelize/types";

export abstract class Controller {

	public static paginate(page: number, size: number) {
		return {
			limit: size,
			offset: size * (page - 1),
		}
	}

	public static totalPage(count: number, size: number = 15) {
		return Math.ceil(count / size);
	}

	public static updateOrCreate(model: Model<any>, where: any, data: any): {item: Model, created: boolean} {
		return model.findOne({ where })
			.then(function (foundItem: Model) {
				if (!foundItem) {
					return model
						.create(data)
						.then(function (item: Model) { return { item: item, created: true }; })
				}
				return model
					.update(data, { where })
					.then(function (item) { return { item: item, created: false } });
			});
	}
}
