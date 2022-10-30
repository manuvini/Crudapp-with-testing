import httpService from "../../service/HttpService";
import ApiConfig from "../../service/ApiConfig";
import { IPost, IPostForm } from "./Post.type";

export const getUserListApi = async () => {
  return await httpService.get<IPost[]>(ApiConfig.user);
};

export const createUserApi = async (data: IPostForm) => {
  return await httpService.post<IPost>(ApiConfig.user, data);
};

export const deleteUserApi = async (id: number) => {
  const url = `${ApiConfig.user}/${id}`;
  return await httpService.delete(url);
};

export const updateUserApi = async (id: number, data: IPostForm) => {
  const url = `${ApiConfig.user}/${id}`;
  return await httpService.put(url, data);
};
