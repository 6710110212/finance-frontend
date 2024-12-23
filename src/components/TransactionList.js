import React, { useState } from "react"
import { Button, Table, Space, Tag, Popconfirm, Modal } from "antd"
import { DeleteOutlined,EditOutlined, BugOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import EditItem from "./EditItem";

export default function TransactionList(props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  }

  const handleItemEdited = (updatedItem) => {
    props.onRowEdit(updatedItem);
    setIsEditModalOpen(false);
  };

  const columns = [
    { 
      title: "Date-Time", 
      dataIndex: "action_datetime", 
      key: "action_datetime",
      render: (_, record) => dayjs(record.action_datetime).format("DD/MM/YYYY - HH:mm")
    },
    { 
      title: "Type", dataIndex: "type", key: "type", render: (_, record) => (
        <Tag color={record.type === "income" ? 'green' : 'red'}>{record.type}</Tag>
      ) 
    },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Action", key: "action", render: (_, record) => (
        <Space size="middle">
          
          <Button 
              type="primary"
              shape="square"
              icon={<EditOutlined />}
              style={{backgroundColor: '#998ed9'}}
              onClick={() => handleEdit(record)}
          >Edit</Button>

          <EditItem
            isOpen={isEditModalOpen}
            item={currentItem}
            onItemEdited={handleItemEdited}
            onCancel={() => setIsEditModalOpen(false)} />

          <Popconfirm
            title="Delete the transaction"
            description="Are you sure to delete this transaction?"
            onConfirm={() => props.onRowDeleted(record.id)}
          >
            <Button danger 
              type="primary" 
              shape="circle" 
              icon={<DeleteOutlined />} />
            
          </Popconfirm>

          <Button 
            type="primary" 
            shape="circle" 
            icon={<BugOutlined/>} 
            onClick={() => {
              Modal.info({
                title: "Debug",
                content: JSON.stringify(record)
              })
            }}/>
        </Space>
      ), 
    },
  ]

  return (
    <>
    <Table columns={columns} dataSource={props.data}/>
    </>
  )
}
