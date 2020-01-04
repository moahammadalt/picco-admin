import React, { useContext, useState, useEffect } from 'react';
import { Table, Row, Button } from 'antd';
import { CSVLink } from 'react-csv';

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
      let tmpExportedSubscribersData = [];
      tmpExportedSubscribersData.push(['Email', 'Date']);

      const tmpSubscribersList = data.map(subscriber => {
        tmpExportedSubscribersData.push([
          subscriber.email,
          getUIDate(subscriber.date_created, true)
        ]);

        subscriber['key'] = subscriber.id;
        return subscriber;
      });

      setSubscribersList(tmpSubscribersList);
      setExportedSubscribersData(tmpExportedSubscribersData);
    }
  });

  const [subscribersList, setSubscribersList] = useState([]);
  const [exportedSubscribersData, setExportedSubscribersData] = useState([]);

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
      render: date_created => getUIDate(date_created, true)
    }
  ];

  return (
    <Row>
      <div className="flex-r m-b-20">
        <CSVLink data={exportedSubscribersData} filename="subscribers-list">
          <Button icon="download">Download</Button>
        </CSVLink>
      </div>
      <Table columns={columns} dataSource={subscribersList} />
    </Row>
  );
}

export default Subscribers;
