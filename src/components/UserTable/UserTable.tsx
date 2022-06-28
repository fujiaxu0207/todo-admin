/**
 * Created by hao.cheng on 2017/4/15.
 */
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, Table, notification } from 'antd';
import { TableRowSelection } from 'antd/lib/table';
import FormItem from 'antd/lib/form/FormItem';
import {
    getUsers,
    userRegister,
    deletUser,
    updateUser,
    deleteBatchUsers,
    addBatchUsers,
} from '../../service/index';
import * as XLSX from 'xlsx';
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
    id: number;
}) => {
    const { title, visible, onOk, confirmLoading, onCancel, id } = props;
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
                onOk({ ...userInfo, id });
            }}
            confirmLoading={confirmLoading}
            onCancel={onCancel}
        >
            <div className="gutter-box">
                <Form>
                    <FormItem label="用户名" hasFeedback>
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
    const [id, setId] = useState(0);

    const [confirmLoadingState, setConfirmLoadingState] = useState(false);
    const [userData, setUserData] = useState([{ usrename: '', id: 0, password: '' }]);
    const [loadingState, setLoadingState] = useState(true);

    const handleChange = (selectedRowKeys: string[] | number[]) => {
        setSelectedRowKeys(selectedRowKeys);
    };
    const showModal = () => {
        setVisible(true);
    };
    const onImportExcel = (file) => {
        // 获取上传的文件对象
        const { files } = file.target;
        // 通过FileReader对象读取文件
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            try {
                const { result } = event.target;
                // 以二进制流方式读取得到整份excel表格对象
                const workbook = XLSX.read(result, { type: 'binary' });
                let data = []; // 存储获取到的数据
                // 遍历每张工作表进行读取（这里默认只读取第一张表）
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        // 利用 sheet_to_json 方法将 excel 转成 json 数据
                        data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                        // break; // 如果只取第一张表，就取消注释这行
                    }
                }
                console.log(typeof data[0]['用户名'],data[0]['用户名']);
                
                addBatchUsers(
                    data.map((v) => {
                        return {
                            "username": v['用户名'].toString(),
                            "password": v['密码'].toString(),
                        };
                    })
                )
                .then((res) => {
                    if (res.result === 'SUCCESS') {
                        refresh('批量添加成功');
                    }
                });
            } catch (e) {
                // 这里可以抛出文件类型错误不正确的相关提示
                console.log('文件类型不正确');
                return;
            }
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
    };

    const preOnImportExcel = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx, .xls';
        input.click();
        input.addEventListener('change', (file) => {
            onImportExcel(file);
        });
    };
    const columns = [
        {
            title: '用户id',
            dataIndex: 'id',
        },
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
                        <Button
                            onClick={() => {
                                setId(text.id);
                                setUpdateModalvisible(true);
                            }}
                        >
                            修改
                        </Button>
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
                <Button
                    style={{ visibility: selectedRowKeys.length >= 1 ? 'visible' : 'hidden' }}
                    onClick={() => {
                        const ids: string[] = [];
                        for (let i = 0; i < selectedRowKeys.length; i++) {
                            if (typeof selectedRowKeys[i] === 'string') {
                                console.log('123');

                                ids.push(userData[selectedRowKeys[i]].id);
                            } else {
                                ids.push(userData[selectedRowKeys[i]].id.toString());
                            }
                        }
                        console.log('ids', ids);

                        deleteBatchUsers(ids).then((res) => {
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
                // <input type='file' accept='.xlsx, .xls' onChange={onImportExcel} ="批量导入"/>
                <Button className="ant-dropdown-link" onClick={preOnImportExcel}>
                    批量导入用户
                </Button>
            ),
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
    const handleOk2 = (uerInfo: { id: number; username: string; password: string }) => {
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
            setSelectedRowKeys([]);
            notification.success({
                message: msg,
                duration: 1.5,
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
