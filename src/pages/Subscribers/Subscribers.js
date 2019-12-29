import React, { useContext, useState, useEffect } from 'react';
import { Table, Row } from 'antd';

import { LayoutContext } from '../../contexts';
import { useFetch, usePrevious } from '../../hooks';
import { URLS } from '../../constants';
import { getUIDate } from '../../utils/helpers';

function Subscribers() {
  const { setHeaderComponent } = useContext(LayoutContext);

  useFetch({
    url: URLS.subscribersList,
    defaultValue: [],
    onSuccess: data => {
      const tmpSubscribersList = data.map(demand => {
        demand['key'] = demand.id;
        return demand;
      });
      setSubscribersList(tmpSubscribersList);
    }
  });

  const [subscribersList, setSubscribersList] = useState([]);

  const prevSubscribersList = usePrevious(subscribersList);

  useEffect(() => {
    return () => {
      setHeaderComponent(null);
    };
  }, []);

  useEffect(() => {
    const subscribersListChanged =
      JSON.stringify(prevSubscribersList) !== JSON.stringify(subscribersList);
    subscribersListChanged &&
      setHeaderComponent(<b>Subscribers count {subscribersList.length}</b>);
  }, [subscribersList]);

  const columns = [
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
      <Table columns={columns} dataSource={subscribersList} />
    </Row>
  );
}

export default Subscribers;
