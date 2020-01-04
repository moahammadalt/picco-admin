import React, { useContext, useState, useEffect } from 'react';
import { Table, Row, Button } from 'antd';
import { CSVLink } from 'react-csv';

import { LayoutContext } from '../../contexts';
import { useFetch, usePrevious } from '../../hooks';
import { URLS } from '../../constants';
import { getUIDate } from '../../utils/helpers';

function Users() {
  const { setHeaderComponent } = useContext(LayoutContext);

  useFetch({
    url: URLS.usersList,
    defaultValue: [],
    onSuccess: data => {
      let tmpExportedUsersData = [];
      tmpExportedUsersData.push(['ID', 'Email', 'Date']);

      const tmpUsersList = data.map(user => {
        tmpExportedUsersData.push([
          user.id,
          user.email,
          getUIDate(user.date_created, true)
        ]);

        user['key'] = user.id;
        return user;
      });
      setUsersList(tmpUsersList);
      setExportedUsersData(tmpExportedUsersData);
    }
  });

  const [usersList, setUsersList] = useState([]);
  const [exportedUsersData, setExportedUsersData] = useState([]);

  const prevUsersList = usePrevious(usersList);

  useEffect(() => {
    return () => {
      setHeaderComponent(null);
    };
  }, [setHeaderComponent]);

  useEffect(() => {
    const usersListChanged =
      JSON.stringify(prevUsersList) !== JSON.stringify(usersList);
    usersListChanged &&
      setHeaderComponent(<b>Users count {usersList.length}</b>);
  }, [usersList]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Date',
      dataIndex: 'date_created',
      key: 'date_created',
      render: date_created => getUIDate(date_created)
    }
  ];

  return (
    <Row>
      <div className="flex-r m-b-20">
        <CSVLink data={exportedUsersData} filename="users-list">
          <Button icon="download">Download</Button>
        </CSVLink>
      </div>
      <Table columns={columns} dataSource={usersList} />
    </Row>
  );
}

export default Users;
