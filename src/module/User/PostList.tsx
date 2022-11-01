import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { Modal } from "../../components/Modal";
import { ApiStatus, IPost } from "./Post.type";
import { deleteUserAction, getUserListAction } from "./PostSlice";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [userDataToView, setUserDataToView] = useState<IPost | null>(null);
  const { list, listStatus } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const navigator = useNavigate();

  useEffect(() => {
    dispatch(getUserListAction());
  }, []);

  return (
    <>
      <table  >
        <tr>
          <th>Sl. No</th>
          <th>Title</th>
          <th>Body</th>
          <th>UserId</th>
          <th>Action</th>
        </tr>
        {listStatus === ApiStatus.loading && <tbody data-testid="body">List is loading</tbody>}
        {listStatus === ApiStatus.error && (
          <tbody>Error while loading list</tbody>
        )}

        {listStatus === ApiStatus.ideal &&
          list.map((user: IPost, index: number) => {

            var num = index;
            var viewbtn = "viewbtn"+index +"";
            var deletebtn = "deletebtn"+index +"";
            var editbtn = "editbtn"+index +"";
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{user.title}</td>
                <td>{user.body}</td>
                <td>{user.userId}</td>
                <td>
                  <div>
                    <input
                      type="button"
                      value="View"
                      onClick={() => {
                        setUserDataToView(user);
                      }}
                      data-testid={viewbtn}                    
                      />
                    <input
                      type="button"
                      value="Edit"
                      onClick={() => {
                        navigator(`/edit/${user.id}`);
                      }}
                      data-testid={editbtn}

                    />
                    <input
                      type="button"
                      value="Delete"
                      onClick={() => {
                        dispatch(deleteUserAction(user.id));
                      }}
                      data-testid={deletebtn}

                    />
                  </div>
                </td>
              </tr>
            );
          })}
      </table>
      {userDataToView && (
        <Modal
          title="Post Details"
          onClose={() => {
            setUserDataToView(null);
          }}
        >
          <div>
            <div>
              <label> Title : {userDataToView.title}</label>
            </div>
            <div>
              <label> Body : {userDataToView.body}</label>
            </div>
            <div>
              <label> UserId : {userDataToView.userId}</label>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UserList;
