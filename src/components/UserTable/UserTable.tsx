/**
 * Created by hao.cheng on 2017/4/15.
 */
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, Table, notification } from 'antd';
import { TableRowSelection } from 'antd/lib/table';
import FormItem from 'antd/lib/form/FormItem';
import { getUsers, userRegister, deletUser,updateUser } from '../../service/index';

const RegisterModal = (props: {
    title: any;
    visible: any;
    onOk: any;
    confirmLoading: any;
    onCancel: any;
}) => {
    const { title, visible, onOk, confirmLoading, onCancel } = props;
    const [userInfo, setUserInfo] = useState({
        username: '',
        password: '',
    });
    const handleUserNameChange = (e: { target: { value: any } }) => {
        setUserInfo({
            ...userInfo,
            username: e.target.value,
        });
    };
    const handlePasswordChange = (e: { target: { value: any } }) => {
        setUserInfo({
            ...userInfo,
            password: e.target.value,
        });
    };
    return (
        <Modal
            title={title}
            visible={visible}
            onOk={(e) => {
                onOk(userInfo);
            }}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
        >
            <div className="gutter-box">
                <Form>
                    <FormItem label="用户名" hasFeedback>
                        //to 空校验
                        <Input required value={userInfo.username} onChange={handleUserNameChange} />
                    </FormItem>
                    <FormItem label="密码" hasFeedback>
                        <Input
                            required
                            type="password"
                            value={userInfo.password}
                            onChange={handlePasswordChange}
                        />
                    </FormItem>
                </Form>
            </div>
        </Modal>
    );
};

const UpdateModal = (props: {
    title: any;
    visible: any;
    onOk: any;
    confirmLoading: any;
    onCancel: any;
    id:number
}) => {
    const { title, visible, onOk, confirmLoading, onCancel,id } = props;
    const [userInfo, setUserInfo] = useState({
        username: '',
        password: '',
    });
    const handleUserNameChange = (e: { target: { value: any } }) => {
        setUserInfo({
            ...userInfo,
            username: e.target.value,
        });
    };
    const handlePasswordChange = (e: { target: { value: any } }) => {
        setUserInfo({
            ...userInfo,
            password: e.target.value,
        });
    };
    return (
        <Modal
            title={title}
            visible={visible}
            onOk={(e) => {
                onOk({...userInfo,id});
            }}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
        >
            <div className="gutter-box">
                <Form>
                    <FormItem label="用户名" hasFeedback>
                        //to 空校验
                        <Input required value={userInfo.username} onChange={handleUserNameChange} />
                    </FormItem>
                    <FormItem label="密码" hasFeedback>
                        <Input
                            required
                            type="password"
                            value={userInfo.password}
                            onChange={handlePasswordChange}
                        />
                    </FormItem>
                </Form>
            </div>
        </Modal>
    );
};

const SelectTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);
    const [visible, setVisible] = useState(false);
    const [updateModalvisible, setUpdateModalvisible] = useState(false);
    const [id,setId] = useState(0);

    const [confirmLoadingState, setConfirmLoadingState] = useState(false);
    const [userData, setUserData] = useState([{ usrename: '', id: 0, password: '' }]);
    const [loadingState, setLoadingState] = useState(true);

    const handleChange = (selectedRowKeys: string[] | number[]) => {
        setSelectedRowKeys(selectedRowKeys);
    };
    const showModal = () => {
        setVisible(true);
    };
    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '密码',
            dataIndex: 'password',
        },

        {
            title: '操作',
            key: 'action',
            render: (text: any, record: any, index: any) => {
                return (
                    <span>
                        <Button onClick={() => {
                            setId(text.id);
                            setUpdateModalvisible(true);
                        }}>修改</Button>
                        <span className="ant-divider" />
                        <Button
                            className="ant-dropdown-link"
                            onClick={() => {
                                deletUser(text.id).then((res) => {
                                    if (res.result === 'SUCCESS') {
                                        refresh('删除成功');
                                    } else {
                                        refresh('删除失败');
                                    }
                                });
                            }}
                        >
                            删除
                        </Button>
                    </span>
                );
            },
        },
        {
            title: (
                <Button className="ant-dropdown-link" onClick={showModal}>
                    添加用户
                </Button>
            ),
            key: 'addUser',
        },
    ];
    const rowSelection: TableRowSelection<any> = {
        selectedRowKeys,
        onChange: handleChange,
    };
    const handleOk = (uerInfo: { username: string; password: string }) => {
        setConfirmLoadingState(true);
        userRegister(uerInfo).then((res) => {
            refresh('添加成功');
        });
    };
    const handleOk2 = (uerInfo: { id:number,username: string; password: string }) => {
        setConfirmLoadingState(true);
        updateUser(uerInfo).then((res) => {
            refresh('修改用户信息成功');
        });
    };
    const refresh = (msg: string) => {
        setLoadingState(true);
        getUsers().then((res) => {
            setLoadingState(false);
            setConfirmLoadingState(false);
            setVisible(false);
            setUpdateModalvisible(false);
            setUserData(res.data);
            notification.success({
                message: msg,
                duration: 0.8,
            });
        });
    };
    const handleCancel = () => {
        setVisible(false);
        setUpdateModalvisible(false);
    };
    useEffect(() => {
        getUsers().then((res) => {
            setLoadingState(false);
            setUserData(res.data);
        });
    }, []);
    const onDataChange = (
        data: React.SetStateAction<{ usrename: string; id: number; password: string }[]>
    ) => {};
    return (
        <>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={userData}
                loading={loadingState}
            />
            <RegisterModal
                title="添加用户"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoadingState}
                onCancel={handleCancel}
            />
            <UpdateModal
                title="修改用户信息"
                id={id}
                visible={updateModalvisible}
                onOk={handleOk2}
                confirmLoading={confirmLoadingState}
                onCancel={handleCancel}
            />
        </>
    );
};

export default SelectTable;
