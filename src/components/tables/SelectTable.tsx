/**
 * Created by hao.cheng on 2017/4/15.
 */
import React from 'react';
import { Button, Icon, Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text: any, record: any) => (
            <span>
                <Button>Action 一 {record.name}</Button>
                <span className="ant-divider" />
                <Button>Delete</Button>
                <span className="ant-divider" />
                <Button className="ant-dropdown-link">
                    More actions <Icon type="down" />
                </Button>
            </span>
        ),
    },
];

const data: any[] = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
    });
}

class SelectTable extends React.Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
    };
    onSelectChange = (selectedRowKeys: string[] | number[]) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection: TableRowSelection<any> = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [
                {
                    key: 'odd',
                    text: '选择奇数列',
                    onSelect: (changableRowKeys: string[]) => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return false;
                            }
                            return true;
                        });
                        this.setState({ selectedRowKeys: newSelectedRowKeys });
                    },
                },
                {
                    key: 'even',
                    text: '选择偶数列',
                    onSelect: (changableRowKeys: string[]) => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return true;
                            }
                            return false;
                        });
                        this.setState({ selectedRowKeys: newSelectedRowKeys });
                    },
                },
            ],
            // onSelection: this.onSelection,
        };
        return <Table rowSelection={rowSelection} columns={columns} dataSource={data} />;
    }
}

export default SelectTable;
