/**
 * Created by hao.cheng on 2017/4/15.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    Form,
    Input,
    Modal,
    notification,
    Table,
    DatePicker,
    InputNumber,
    Select,
} from 'antd';
import { TableRowSelection } from 'antd/lib/table';
import { getAllTodo, deleteTodo, deleteBatchTodo, updateTodo ,addTodo} from '../../service/index';
import FormItem from 'antd/lib/form/FormItem';
import { RangePickerPresetRange } from 'antd/lib/date-picker/interface';

const { Option } = Select;
const UpdateModal = (props: {
    title: any;
    visible: any;
    onOk: any;
    confirmLoading: any;
    onCancel: any;
    id: number;
    uid: number;
}) => {
    const { title, visible, onOk, confirmLoading, onCancel, id, uid } = props;
    console.log('ID', id, uid);

    const [todoInfo, setTodoInfo] = useState({
        name: '',
        id: id,
        content: '',
        createTime: '',
        deadline: '',
        degree: 1,
        today: 1,
        uid: uid,
        done: 1,
        doneTime: '',
    });
    useEffect(() => {
        setTodoInfo({
            ...todoInfo,
            uid: uid,
            id: id,
        });
    }, [id, uid]);
    const timeRangeChange = (date: string[]) => {
        setTodoInfo({
            ...todoInfo,
            createTime: date[0],
            deadline: date[1],
        });
    };
    const handleTodoInfoChange = (type: number, e: { target: { value: any } }) => {
        switch (type) {
            case 0:
                setTodoInfo({
                    ...todoInfo,
                    name: e.target.value,
                });
                break;
            case 1:
                setTodoInfo({
                    ...todoInfo,
                    content: e.target.value,
                });
                break;
            case 2:
                setTodoInfo({
                    ...todoInfo,
                    createTime: e.target.value,
                });
                break;
            case 3:
                setTodoInfo({
                    ...todoInfo,
                    deadline: e.target.value,
                });
                break;
            case 4:
                setTodoInfo({
                    ...todoInfo,
                    degree: Number(e.target.value),
                });
                break;
            case 5:
                setTodoInfo({
                    ...todoInfo,
                    today: Number(e.target.value),
                });
                break;
            case 6:
                setTodoInfo({
                    ...todoInfo,
                    done: Number(e.target.value),
                });
                break;
            case 7:
                setTodoInfo({
                    ...todoInfo,
                    doneTime: e.target.value,
                });
                break;
            default:
                break;
        }
    };
    const { RangePicker } = DatePicker;
    console.log('todoInfo', todoInfo);

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={(e) => {
                onOk({ ...todoInfo, id, uid });
            }}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
        >
            <div className="gutter-box">
                <Form>
                    <FormItem label="待办项名" hasFeedback style={{ marginBottom: '5px' }}>
                        <Input
                            required
                            value={todoInfo.name}
                            onChange={(e) => handleTodoInfoChange(0, e)}
                        />
                    </FormItem>
                    <FormItem label="待办内容" hasFeedback>
                        <Input
                            required
                            value={todoInfo.content}
                            onChange={(e) => handleTodoInfoChange(1, e)}
                        />
                    </FormItem>
                    <FormItem label="待办项创建时间" hasFeedback>
                        <RangePicker
                            showTime={{ format: 'HH:mm:ss' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            // onChange={onChange}
                            onChange={(dates, dateStrings: string[]) => {
                                timeRangeChange(dateStrings);
                            }}
                        />
                    </FormItem>
                    <FormItem label="待办项重要程度" hasFeedback>
                        <Input
                            required
                            value={todoInfo.degree}
                            placeholder={'1>2>3'}
                            onChange={(e) => handleTodoInfoChange(4, e)}
                        />
                    </FormItem>
                    <FormItem label="待办项是否为今日代办" hasFeedback>
                        <Select
                            defaultValue="是"
                            onChange={(data) => {
                                setTodoInfo({
                                    ...todoInfo,
                                    today: data === '是' ? 1 : 0,
                                });
                            }}
                        >
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="待办项是否已完成" hasFeedback>
                        <Select
                            defaultValue="是"
                            onChange={(data) => {
                                setTodoInfo({
                                    ...todoInfo,
                                    done: data === '是' ? 1 : 0,
                                });
                            }}
                        >
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                        </Select>
                    </FormItem>
                    {todoInfo.done === 1 && (
                        <FormItem label="完成时间" hasFeedback>
                            <DatePicker
                                showTime
                                placeholder="Select Time"
                                onChange={(data, string) => {
                                    setTodoInfo({
                                        ...todoInfo,
                                        doneTime: string,
                                    });
                                }}
                            />
                        </FormItem>
                    )}
                </Form>
            </div>
        </Modal>
    );
};

const AddModal = (props: {
    title: any;
    visible: any;
    onOk: any;
    confirmLoading: any;
    onCancel: any;
}) => {
    const { title, visible, onOk, confirmLoading, onCancel } = props;

    const [todoInfo, setTodoInfo] = useState({
        name: '',
        content: '',
        createTime: '',
        deadline: '',
        degree: 1,
        today: 1,
        uid: "",
        done: 1,
        doneTime: '',
    });
    const timeRangeChange = (date: string[]) => {
        setTodoInfo({
            ...todoInfo,
            createTime: date[0],
            deadline: date[1],
        });
    };
    const handleTodoInfoChange = (type: number, e: { target: { value: any } }) => {
        switch (type) {
            case -1:
                setTodoInfo({
                    ...todoInfo,
                    uid: e.target.value,
                });
                break;
            case 0:
                setTodoInfo({
                    ...todoInfo,
                    name: e.target.value,
                });
                break;
            case 1:
                setTodoInfo({
                    ...todoInfo,
                    content: e.target.value,
                });
                break;
            case 2:
                setTodoInfo({
                    ...todoInfo,
                    createTime: e.target.value,
                });
                break;
            case 3:
                setTodoInfo({
                    ...todoInfo,
                    deadline: e.target.value,
                });
                break;
            case 4:
                setTodoInfo({
                    ...todoInfo,
                    degree: Number(e.target.value),
                });
                break;
            case 5:
                setTodoInfo({
                    ...todoInfo,
                    today: Number(e.target.value),
                });
                break;
            case 6:
                setTodoInfo({
                    ...todoInfo,
                    done: Number(e.target.value),
                });
                break;
            case 7:
                setTodoInfo({
                    ...todoInfo,
                    doneTime: e.target.value,
                });
                break;
            default:
                break;
        }
    };
    const { RangePicker } = DatePicker;
    console.log('todoInfo', todoInfo);

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={(e) => {
                onOk({ ...todoInfo});
            }}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
        >
            <div className="gutter-box">
                <Form>
                    <FormItem label="用户id" hasFeedback style={{ marginBottom: '5px' }}>
                        <Input
                            required
                            value={todoInfo.uid}
                            onChange={(e) => handleTodoInfoChange(-1, e)}
                        />
                    </FormItem>
                    <FormItem label="待办项名" hasFeedback style={{ marginBottom: '5px' }}>
                        <Input
                            required
                            value={todoInfo.name}
                            onChange={(e) => handleTodoInfoChange(0, e)}
                        />
                    </FormItem>
                    <FormItem label="待办内容" hasFeedback>
                        <Input
                            required
                            value={todoInfo.content}
                            onChange={(e) => handleTodoInfoChange(1, e)}
                        />
                    </FormItem>
                    <FormItem label="待办项创建时间" hasFeedback>
                        <RangePicker
                            showTime={{ format: 'HH:mm:ss' }}
                            format="YYYY-MM-DD HH:mm:ss"
                            // onChange={onChange}
                            onChange={(dates, dateStrings: string[]) => {
                                timeRangeChange(dateStrings);
                            }}
                        />
                    </FormItem>
                    <FormItem label="待办项重要程度" hasFeedback>
                        <Input
                            required
                            value={todoInfo.degree}
                            placeholder={'1>2>3'}
                            onChange={(e) => handleTodoInfoChange(4, e)}
                        />
                    </FormItem>
                    <FormItem label="待办项是否为今日代办" hasFeedback>
                        <Select
                            defaultValue="是"
                            onChange={(data) => {
                                setTodoInfo({
                                    ...todoInfo,
                                    today: data === '是' ? 1 : 0,
                                });
                            }}
                        >
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="待办项是否已完成" hasFeedback>
                        <Select
                            defaultValue="是"
                            onChange={(data) => {
                                setTodoInfo({
                                    ...todoInfo,
                                    done: data === '是' ? 1 : 0,
                                });
                            }}
                        >
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                        </Select>
                    </FormItem>
                    {todoInfo.done === 1 && (
                        <FormItem label="完成时间" hasFeedback>
                            <DatePicker
                                showTime
                                placeholder="Select Time"
                                onChange={(data, string) => {
                                    setTodoInfo({
                                        ...todoInfo,
                                        doneTime: string,
                                    });
                                }}
                            />
                        </FormItem>
                    )}
                </Form>
            </div>
        </Modal>
    );
};

const SelectTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);
    const [visible, setVisible] = useState(false);
    const [confirmLoadingState, setConfirmLoadingState] = useState(false);
    const [id, setId] = useState(0);
    const [uid, setUid] = useState(0);
    const [filterId, setFilterId] = useState('');
    const [updateModalvisible, setUpdateModalvisible] = useState(false);
    const [loadingState, setLoadingState] = useState(true);
    const [todoData, setTodoData] = useState([
        {
            name: '',
            id: 0,
            content: '',
            createTime: '',
            deadline: '',
            degree: 1,
            today: 1,
            uid: 1,
            doneTime: '',
            done: 1,
        },
    ]);
    const handleChange = (selectedRowKeys: string[] | number[]) => {
        setSelectedRowKeys(selectedRowKeys);
    };
    const handleFilter = () => {
        if (parseInt(filterId) >= 0) {
            setTodoData(
                todoData.filter((v) => {
                    return v.id === parseInt(filterId);
                })
            );
        }
    };
    const columns = [
        {
            title: '用户id',
            dataIndex: 'uid',
            filterDropdown: () => {
                return (
                    <div style={{ padding: 8 }}>
                        <Input
                            placeholder={'过滤用户id'}
                            value={filterId}
                            onChange={(e: { target: { value: string } }) => {
                                setFilterId(e.target.value);
                            }}
                            //   onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                            style={{ marginBottom: 8, display: 'block' }}
                        />
                        <Button
                            type="primary"
                            // onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                            size="small"
                            style={{ width: 90 }}
                            onClick={handleFilter}
                        >
                            过滤
                        </Button>
                        <Button
                            // onClick={() => clearFilters && handleReset(clearFilters)}
                            size="small"
                            style={{ width: 90 }}
                            onClick={() => {
                                refresh();
                            }}
                        >
                            重置
                        </Button>
                    </div>
                );
            },
        },
        {
            title: '待办项id',
            dataIndex: 'id',
        },
        {
            title: '待办名',
            dataIndex: 'name',
        },
        {
            title: '待办内容',
            dataIndex: 'content',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
        },
        {
            title: '终止时间',
            dataIndex: 'deadline',
        },
        {
            title: '重要程度',
            dataIndex: 'degree',
        },
        {
            title: '是否为今日待办',
            dataIndex: 'today',
            render: (text: any, record: any) => {
                if (text.today === 1) {
                    return '是';
                }
                return '否';
            },
        },
        {
            title: '待办完成时间',
            dataIndex: 'doneTime',
        },
        {
            title: '待办是否完成',
            dataIndex: 'done',
            render: (text: any, record: any) => {
                if (text.done === 1) {
                    return '是';
                }
                return '否';
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (text: any, record: any) => (
                <span>
                    <Button
                        onClick={() => {
                            setUpdateModalvisible(true);
                            setId(text.id);
                            setUid(text.uid);
                        }}
                    >
                        修改
                    </Button>
                    <span className="ant-divider" />
                    <Button
                        className="ant-dropdown-link"
                        onClick={() => {
                            deleteTodo(text.id).then((res) => {
                                if (res.result === 'SUCCESS') {
                                    refresh('删除成功');
                                }
                            });
                        }}
                    >
                        删除
                    </Button>
                </span>
            ),
        },
        {
            title: (
                <Button
                    style={{ visibility: selectedRowKeys.length >= 1 ? 'visible' : 'hidden' }}
                    onClick={() => {
                        const ids: string[] = [];
                        for (let i = 0; i < selectedRowKeys.length; i++) {
                            if (typeof selectedRowKeys[i] === 'string') {
                                console.log("123");
                                
                                ids.push(todoData[selectedRowKeys[i]].id);
                            } else {
                                ids.push(todoData[selectedRowKeys[i]].id.toString());
                            }
                            console.log(typeof selectedRowKeys[i]);
                        }
                        deleteBatchTodo(ids).then((res) => {
                            if (res.result === 'SUCCESS') {
                                refresh('删除成功');
                            }
                        });
                    }}
                >
                    批量删除
                </Button>
            ),
            key: 'batchDelete',
        },
        {
            title: (
                <Button className="ant-dropdown-link" onClick={e=>setVisible(true)}>
                    添加待办项
                </Button>
            ),
            key: 'addItem',
        },
    ];
    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys,
        onChange: handleChange,
    };
    const refresh = (msg?: string) => {
        setLoadingState(true);
        getAllTodo().then((res) => {
            setLoadingState(false);
            setConfirmLoadingState(false);
            setVisible(false);
            setUpdateModalvisible(false);
            setTodoData(res.data);
            if (msg) {
                notification.success({
                    message: msg,
                    duration: 0.8,
                });
            }
        });
    };
    const handleOk2 = (todoInfo) => {
        setConfirmLoadingState(true);
        updateTodo(todoInfo).then((res) => {
            refresh('修改信息成功');
        });
    };
    const handleOk = (todoInfo) => {
        setConfirmLoadingState(true);
        addTodo(todoInfo).then((res) => {
            refresh('添加待办项成功');
        });
    };
    const handleCancel = () => {
        setVisible(false);
        setUpdateModalvisible(false);
    };
    useEffect(() => {
        getAllTodo().then((res) => {
            console.log('res', res);
            setLoadingState(false);
            if (res.result === 'SUCCESS') {
                setTodoData(res.data);
            } else {
                setTodoData([]);
            }
        });
    }, []);
    return (
        <>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={todoData}
                loading={loadingState}
            />
            <UpdateModal
                title="修改待办项信息"
                id={id}
                uid={uid}
                visible={updateModalvisible}
                onOk={handleOk2}
                confirmLoading={confirmLoadingState}
                onCancel={handleCancel}
            />
            <AddModal
                title="添加待办项"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoadingState}
                onCancel={handleCancel}
            />
        </>
    );
};

export default SelectTable;
