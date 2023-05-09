import { fatalError, success } from "../../utils/utils.js";
import UserModel from "./userModel.js";

const userServices = {};

userServices.addAction = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await UserModel.create(body);

            if (user) {
                resolve(success(user));
            } else {
                reject("No fue posible crear el usuario");
            }
        } catch (error) {
            reject(fatalError(error.message));
        }
    });
};

export default userServices;
