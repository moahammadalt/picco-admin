import React, { useContext, useState, useEffect } from 'react';
import { Table, Row } from 'antd';

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
      const tmpUsersList = data.map(demand => {
        demand['key'] = demand.id;
        return demand;
      });
      setUsersList(tmpUsersList);
    }
  });

  const [usersList, setUsersList] = useState([]);

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
      <Table columns={columns} dataSource={usersList} />
    </Row>
  );
}

export default Users;
