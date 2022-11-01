import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { Input } from "../../components/Input";
import { ApiStatus, IUpdateUserActionProps, IPostForm } from "./Post.type";
import Style from "./PostFormStyle.module.css";
import {
  createUserAction,
  resetCreateListStatus,
  updateUserAction,
} from "./PostSlice";
import { useParams } from "react-router-dom";
import { toastError } from "../../components/ToastifyConfig";
interface IProps {
  isEditForm?: boolean;
}

const UserForm = (props: IProps) => {
  const { isEditForm } = props;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userid, setUserid] = useState(1);
  const params = useParams();
  const userIdToEdit = useRef(parseInt(params.id || ""));

  const { list } = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isEditForm && userIdToEdit.current) {
      // list of post
      const userData = list.filter((x) => x.id === userIdToEdit.current);

      if (userData.length) {
        setTitle(userData[0].title);
        setBody(userData[0].body);
        setUserid(userData[0].userId);

      }
    }
  }, [isEditForm]);

  const { createPostFormStatus, updatePostFormStatus } = useAppSelector(
    (state: RootState) => state.user
  );
  const dispatch = useAppDispatch();

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    var userId =userid;

    const data: IPostForm = { title, body, userId };

    if (title && body && userId) {
      if (isEditForm) {
        const dirtyFormData: IUpdateUserActionProps = {
          id: userIdToEdit.current,
          data,
        };
        dispatch(updateUserAction(dirtyFormData));
      } else {
        
        const data: IPostForm = { title, body, userId };
        dispatch(createUserAction(data));
      }
    } else {
      toastError("Please fill the form");
    }
  };

  useEffect(() => {
    if (createPostFormStatus === ApiStatus.success) {
      setTitle("");
      setBody("");
      setUserid(1)
      dispatch(resetCreateListStatus());
    }
  }, [createPostFormStatus]);

  return (
    <div className={Style.container}> 
      <form className={Style.form} onSubmit={onSubmitForm}>
      Form to add and edit post
        <Input
          label="Title"
          value={title}
          testid="Title"                    
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setTitle(e.target.value);
          }}
        />
        <Input
          label="Body"
          value={body}
          testid="Body"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setBody(e.target.value);
          }}
        />

        <Input
          label="Userid"
          value={userid+""}
          type="number"
          testid="Userid"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUserid(parseInt(e.target.value));
          }}
        />
        <div className={Style["btn-wrapper"]}>
          <input
            type="submit"
            data-testid="submit"    
            value={isEditForm ? "Update" : "Create"}
            disabled={
              createPostFormStatus === ApiStatus.loading ||
              updatePostFormStatus === ApiStatus.loading
            }
          />
        </div>
      </form>
    </div>
  );
};

export default UserForm;
