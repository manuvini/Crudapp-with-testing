export interface IPost {
  id: number;
  title: string;
  body: string;
  userId : number
}

export enum ApiStatus {
  "loading",
  "ideal",
  "success",
  "error",
}

export interface IPostState {
  list: IPost[];
  listStatus: ApiStatus;
  createPostFormStatus: ApiStatus;
  updatePostFormStatus: ApiStatus;
}

export interface IPostForm {
  title: string;
  body: string;
  userId : number
}

export interface IUpdateUserActionProps {
  id: number;
  data: IPostForm;
}
