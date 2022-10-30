import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastError, toastSuccess } from "../../components/ToastifyConfig";
import {
  ApiStatus,
  IPost,
  IUpdateUserActionProps,
  IPostForm,
  IPostState,
} from "./Post.type";
import {
  createUserApi,
  deleteUserApi,
  getUserListApi,
  updateUserApi,
} from "./PostService";

const initialState: IPostState = {
  list: [],
  listStatus: ApiStatus.ideal,
  createPostFormStatus: ApiStatus.ideal,
  updatePostFormStatus: ApiStatus.ideal,
};

export const getUserListAction = createAsyncThunk(
  "user/getUserListAction",
  async () => {
    const response = await getUserListApi();
    return response.data;
  }
);

export const createUserAction = createAsyncThunk(
  "user/createUserAction",
  async (data: IPostForm) => {
    const response = await createUserApi(data);
    return data;
    
  }
);

export const deleteUserAction = createAsyncThunk(
  "user/deleteUserAction",
  async (id: number) => {
    await deleteUserApi(id);
    return id;
  }
);

export const updateUserAction = createAsyncThunk(
  "user/updateUserAction",
  async ({ id, data }: IUpdateUserActionProps) => {
    const response = await updateUserApi(id, data);
    return {id, data};
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetCreateListStatus: (state) => {
      state.createPostFormStatus = ApiStatus.ideal;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserListAction.pending, (state) => {
      state.listStatus = ApiStatus.loading;
    });
    builder.addCase(getUserListAction.fulfilled, (state, action) => {
      state.listStatus = ApiStatus.ideal;
      if(state.list.length>1){

      }else{
        state.list = action.payload;
      }
      
    });
    builder.addCase(getUserListAction.rejected, (state) => {
      state.listStatus = ApiStatus.error;
    });
    builder.addCase(createUserAction.pending, (state) => {
      state.createPostFormStatus = ApiStatus.loading;
    });
    builder.addCase(createUserAction.fulfilled, (state, action) => {
      state.createPostFormStatus = ApiStatus.success;
      state.list.push({
        id: state.list.length+1,
        title: action.payload.title,
        body: action.payload.body,
        userId: action.payload.userId
      });
      toastSuccess("User created");
    });
    builder.addCase(createUserAction.rejected, (state) => {
      state.createPostFormStatus = ApiStatus.error;
      toastSuccess("Error while creating user");
    });
    builder.addCase(deleteUserAction.fulfilled, (state, action) => {
      const newList = state.list.filter((x) => x.id !== action.payload);
      state.list = newList;
    });
    builder.addCase(updateUserAction.pending, (state) => {
      state.updatePostFormStatus = ApiStatus.loading;
    });
    builder.addCase(updateUserAction.fulfilled, (state,action) => {
      state.updatePostFormStatus = ApiStatus.ideal;
      state.list[action.payload.id-1]=({
        id: action.payload.id,
        title: action.payload.data.title,
        body: action.payload.data.body,
        userId: action.payload.data.userId
      });
      toastSuccess("User updated");
    });
    builder.addCase(updateUserAction.rejected, (state) => {
      state.updatePostFormStatus = ApiStatus.error;
      toastError("Error while updating user");
    });
  },
});

export default userSlice.reducer;
export const { resetCreateListStatus } = userSlice.actions;
