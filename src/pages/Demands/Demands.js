import React, { useContext, useState, useEffect } from 'react';
import { Table, Input, Button, Icon, Row, Select, Popover } from 'antd';
import Highlighter from 'react-highlight-words';
import { CSVLink } from 'react-csv';

import { LayoutContext } from '../../contexts';
import { useFetch, usePrevious } from '../../hooks';
import { URLS } from '../../constants';
import { baseURL } from '../../utils/API';
import { getUIDate } from '../../utils/helpers';

const { Option } = Select;

function Demands() {
  const { setHeaderComponent } = useContext(LayoutContext);

  const { data: demandsListData } = useFetch({
    url: URLS.demandsList,
    defaultValue: [],
    onSuccess: data => {
      let tmpExportedDemandsData = [];
      tmpExportedDemandsData.push([
        'Name',
        'Email',
        'Phone Number',
        'Subject',
        'Message',
        'Date',
        'Sent From',
        'Product Link'
      ]);
      const tmpDemandsList = data.map(demand => {
        tmpExportedDemandsData.push([
          demand.name,
          demand.email,
          demand.phone,
          demand.subject,
          demand.message,
          getUIDate(demand.date_created, true),
          demand.product_id ? 'product page' : 'contact page',
          demand.product_id ? `${baseURL}/${demand.product_id}` : '',
        ]);

        demand['key'] = demand.id;
        return demand;
      });
      setDemandsList(tmpDemandsList);
      setExportedDemandsData(tmpExportedDemandsData);
    }
  });

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [demandsList, setDemandsList] = useState([]);
  const [exportedDemandsData, setExportedDemandsData] = useState([]);

  const prevDemandsList = usePrevious(demandsList);

  let searchInput;

  useEffect(() => {
    return () => {
      setHeaderComponent(null);
    };
  }, []);

  useEffect(() => {
    const demandsListChanged =
      JSON.stringify(prevDemandsList) !== JSON.stringify(demandsList);
    demandsListChanged && setHeaderComponent(getFilterComponent);
  }, [demandsList]);

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const handleFilterChange = value => {
    setSelectedFilter(value);
    const tmpDemandsList = value
      ? demandsListData.filter(demand =>
          value === 'product' ? demand.product_id : !demand.product_id
        )
      : demandsListData;
    setDemandsList(tmpDemandsList);
  };

  function getFilterComponent() {
    return (
      <>
        <div className="filter-item">
          <b>Demands count: {demandsList.length}</b>
        </div>
        <div className="filter-item">
          <b>Show demands from:</b>
          <Select
            value={selectedFilter}
            className="filter-select"
            onChange={handleFilterChange}
          >
            <Option value="">All</Option>
            <Option value="contact">Only from contact page</Option>
            <Option value="product">Only from products pages</Option>
          </Select>
        </div>
      </>
    );
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email')
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: subject =>
        subject && subject.length > 20 ? (
          <Popover
            className="message-popover"
            content={subject}
            title="Subject"
          >
            {subject.substr(0, 20)}...
          </Popover>
        ) : (
          subject
        )
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: message =>
        message && message.length > 20 ? (
          <Popover
            className="message-popover"
            content={message}
            title="Message"
          >
            {message.substr(0, 20)}...
          </Popover>
        ) : (
          message
        )
    },
    {
      title: 'Date',
      dataIndex: 'date_created',
      key: 'date_created',
      render: date_created => getUIDate(date_created)
    },
    {
      title: 'Sent From',
      dataIndex: 'product_id',
      key: 'product_source',
      render: product_id => (
        <span>{product_id ? 'product' : 'contact'} page</span>
      )
    },
    {
      title: 'Product',
      dataIndex: 'product_id',
      key: 'product_id',
      render: product_id =>
        product_id && (
          <a href={`${baseURL}/${product_id}`} target="_blank">
            see product
          </a>
        )
    }
  ];

  return (
    <Row>
      <div className="flex-r m-b-20">
        <CSVLink data={exportedDemandsData} filename="demands-list">
          <Button icon="download">Download</Button>
        </CSVLink>
      </div>
      <Table columns={columns} dataSource={demandsList} />
    </Row>
  );
}

export default Demands;
